import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { slugify, stripUndefined } from "@yunity/utilities";
import { CMS_LOCALES } from "@yunity/contracts";
import { escapeRegex } from "../../common/regex";
import { Page, type PageDocument } from "./schemas/page.schema";
import type { PageTranslationValue } from "./schemas/page.schema";
import type { ContentSectionDocument } from "./schemas/content-section.schema";
import { RevisionsService } from "./revisions.service";
import { SectionsService } from "./sections.service";
import {
  nextStatus,
  type ContentStatus,
  type WorkflowAction,
} from "./publishing/workflow";

const ENTITY_TYPE = "PAGE";

export interface PageListQuery {
  status?: string;
  search?: string;
  locale?: string;
  page: number;
  limit: number;
}

export interface CreatePageInput {
  internalName: string;
  templateKey?: string;
  title?: string;
  slug?: string;
  locale?: string;
  isHomepage?: boolean;
}

export interface UpdatePageInput {
  internalName?: string;
  templateKey?: string;
  isHomepage?: boolean;
  locale?: string;
  translation?: PageTranslationValue;
}

/** Momentaufnahme einer Sektion fuer den Publish-Snapshot. */
interface SnapshotSection {
  id: string;
  blockType: string;
  schemaVersion: number;
  data: Record<string, unknown>;
  settings: Record<string, unknown>;
  isEnabled: boolean;
}

export interface PublishedPageSnapshot {
  translations: Record<string, PageTranslationValue>;
  templateKey: string;
  isHomepage: boolean;
  sections: SnapshotSection[];
}

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<Page>,
    private readonly sectionsService: SectionsService,
    private readonly revisionsService: RevisionsService,
  ) {}

  // --- Abfragen ---

  async list(
    siteId: string,
    query: PageListQuery,
  ): Promise<{ items: PageDocument[]; total: number }> {
    const filter: Record<string, unknown> = { siteId, deletedAt: null };
    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      const search = { $regex: escapeRegex(query.search), $options: "i" };
      filter.$or = [
        { internalName: search },
        { [`translations.${query.locale ?? "de"}.title`]: search },
      ];
    }
    const [items, total] = await Promise.all([
      this.pageModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .exec() as Promise<PageDocument[]>,
      this.pageModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async getOwned(siteId: string, pageId: string): Promise<PageDocument> {
    if (!Types.ObjectId.isValid(pageId)) {
      throw new NotFoundException("Seite nicht gefunden.");
    }
    const page = (await this.pageModel
      .findOne({ _id: pageId, siteId, deletedAt: null })
      .exec()) as PageDocument | null;
    if (!page) {
      throw new NotFoundException("Seite nicht gefunden.");
    }
    return page;
  }

  async getSections(
    siteId: string,
    pageId: string,
  ): Promise<ContentSectionDocument[]> {
    return this.sectionsService.listByOwner(siteId, "PAGE", pageId);
  }

  // --- Schreiboperationen ---

  async create(
    siteId: string,
    userId: string,
    input: CreatePageInput,
  ): Promise<PageDocument> {
    const locale = input.locale ?? "de";
    const slug = input.slug ? slugify(input.slug) : slugify(input.internalName);
    await this.assertSlugAvailable(siteId, locale, slug, null);

    if (input.isHomepage) {
      await this.clearHomepage(siteId, null);
    }

    const created = await this.pageModel.create({
      siteId: new Types.ObjectId(siteId),
      internalName: input.internalName,
      templateKey: input.templateKey ?? "default",
      status: "DRAFT",
      isHomepage: input.isHomepage ?? false,
      translations: {
        [locale]: {
          title: input.title ?? input.internalName,
          slug,
          translationStatus: "DRAFT",
        },
      },
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });
    return created as PageDocument;
  }

  async update(
    siteId: string,
    userId: string,
    pageId: string,
    input: UpdatePageInput,
  ): Promise<PageDocument> {
    const page = await this.getOwned(siteId, pageId);

    if (input.internalName !== undefined) {
      page.internalName = input.internalName;
    }
    if (input.templateKey !== undefined) {
      page.templateKey = input.templateKey;
    }
    if (input.isHomepage !== undefined && input.isHomepage !== page.isHomepage) {
      if (input.isHomepage) {
        await this.clearHomepage(siteId, pageId);
      }
      page.isHomepage = input.isHomepage;
    }
    if (input.translation) {
      const locale = input.locale ?? "de";
      const current = page.translations[locale] ?? {};
      // undefined-Felder aus dem DTO entfernen (class-transformer setzt alle
      // optionalen Felder), damit ein Teil-Update bestehende Werte behaelt.
      const incoming = stripUndefined(
        input.translation as Record<string, unknown>,
      );
      const merged: PageTranslationValue = { ...current, ...incoming };
      if (typeof incoming.slug === "string") {
        merged.slug = slugify(incoming.slug);
        await this.assertSlugAvailable(siteId, locale, merged.slug, pageId);
      }
      page.translations = { ...page.translations, [locale]: merged };
      page.markModified("translations");
    }
    page.updatedBy = new Types.ObjectId(userId);
    await page.save();
    return page;
  }

  async duplicate(
    siteId: string,
    userId: string,
    pageId: string,
  ): Promise<PageDocument> {
    const page = await this.getOwned(siteId, pageId);
    const sections = await this.getSections(siteId, pageId);

    const translations = structuredClone(page.translations);
    for (const [locale, value] of Object.entries(translations)) {
      const base = value.slug ? `${value.slug}-kopie` : undefined;
      translations[locale] = {
        ...value,
        title: value.title ? `${value.title} (Kopie)` : value.title,
        slug: base ? await this.uniqueSlug(siteId, locale, base) : base,
        translationStatus: "DRAFT",
      };
    }

    const copy = (await this.pageModel.create({
      siteId: page.siteId,
      internalName: `${page.internalName} (Kopie)`,
      templateKey: page.templateKey,
      status: "DRAFT",
      isHomepage: false,
      translations,
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    })) as PageDocument;

    // Sektionen mitkopieren.
    for (const section of sections) {
      await this.sectionsService.add(siteId, "PAGE", copy._id.toString(), {
        blockType: section.blockType,
        internalLabel: section.internalLabel ?? undefined,
      });
    }
    // Inhaltsdaten der kopierten Sektionen uebernehmen.
    const newSections = await this.getSections(siteId, copy._id.toString());
    await Promise.all(
      newSections.map((newSection, index) => {
        const original = sections[index];
        if (!original) {
          return Promise.resolve();
        }
        newSection.data = structuredClone(original.data);
        newSection.settings = structuredClone(original.settings);
        newSection.isEnabled = original.isEnabled;
        newSection.markModified("data");
        newSection.markModified("settings");
        return newSection.save();
      }),
    );
    return copy;
  }

  async remove(siteId: string, pageId: string): Promise<void> {
    const page = await this.getOwned(siteId, pageId);
    page.deletedAt = new Date();
    await page.save();
    await this.sectionsService.deleteAllForOwner(siteId, "PAGE", pageId);
  }

  // --- Workflow ---

  async runWorkflow(
    siteId: string,
    userId: string,
    pageId: string,
    action: WorkflowAction,
    options?: { scheduledAt?: string; changeSummary?: string },
  ): Promise<{ page: PageDocument; revalidateTags: string[] }> {
    const page = await this.getOwned(siteId, pageId);
    const target = nextStatus(page.status as ContentStatus, action);
    if (!target) {
      throw new BadRequestException(
        `Aktion "${action}" ist im Status "${page.status}" nicht erlaubt.`,
      );
    }

    let revalidateTags: string[] = [];

    if (action === "publish") {
      revalidateTags = await this.applyPublish(
        siteId,
        userId,
        page,
        options?.changeSummary ?? null,
      );
    } else if (action === "schedule") {
      if (!options?.scheduledAt) {
        throw new BadRequestException("Kein Veroeffentlichungszeitpunkt angegeben.");
      }
      page.scheduledPublishAt = new Date(options.scheduledAt);
      page.status = target;
    } else if (action === "unpublish") {
      page.status = target;
      page.currentPublishedRevisionId = null;
      page.publishedSlugs = {};
      page.markModified("publishedSlugs");
      revalidateTags = this.tagsForPage(page);
    } else {
      page.status = target;
    }

    page.updatedBy = new Types.ObjectId(userId);
    await page.save();
    return { page, revalidateTags };
  }

  private async applyPublish(
    siteId: string,
    userId: string,
    page: PageDocument,
    changeSummary: string | null,
  ): Promise<string[]> {
    const sections = await this.getSections(siteId, page._id.toString());
    const snapshot = this.buildSnapshot(page, sections);
    const revision = await this.revisionsService.create({
      siteId,
      entityType: ENTITY_TYPE,
      entityId: page._id.toString(),
      snapshot: snapshot as unknown as Record<string, unknown>,
      changeSummary,
      isPublishedSnapshot: true,
      createdBy: userId,
    });

    const publishedSlugs: Record<string, string> = {};
    for (const [locale, value] of Object.entries(page.translations)) {
      if (value.slug) {
        publishedSlugs[locale] = value.slug;
      }
    }

    page.status = "PUBLISHED";
    page.publishedAt = new Date();
    page.scheduledPublishAt = null;
    page.currentPublishedRevisionId = revision._id;
    page.publishedSlugs = publishedSlugs;
    page.markModified("publishedSlugs");
    return this.tagsForPage(page);
  }

  private buildSnapshot(
    page: PageDocument,
    sections: ContentSectionDocument[],
  ): PublishedPageSnapshot {
    return {
      translations: structuredClone(page.translations),
      templateKey: page.templateKey,
      isHomepage: page.isHomepage,
      sections: sections.map((section) => ({
        id: section._id.toString(),
        blockType: section.blockType,
        schemaVersion: section.schemaVersion,
        data: structuredClone(section.data),
        settings: structuredClone(section.settings),
        isEnabled: section.isEnabled,
      })),
    };
  }

  private tagsForPage(page: PageDocument): string[] {
    const tags = new Set<string>();
    if (page.isHomepage) {
      tags.add("page:home");
    }
    for (const value of Object.values(page.publishedSlugs)) {
      tags.add(`page:${value}`);
    }
    return [...tags];
  }

  // --- Public / Preview ---

  async getPublishedHome(siteId: string): Promise<PublishedPageSnapshot | null> {
    const page = (await this.pageModel
      .findOne({
        siteId,
        isHomepage: true,
        currentPublishedRevisionId: { $ne: null },
        deletedAt: null,
      })
      .exec()) as PageDocument | null;
    return page ? this.loadPublishedSnapshot(page) : null;
  }

  async getPublishedBySlug(
    siteId: string,
    slug: string,
    locale: string,
  ): Promise<PublishedPageSnapshot | null> {
    const page = (await this.pageModel
      .findOne({
        siteId,
        currentPublishedRevisionId: { $ne: null },
        deletedAt: null,
        $or: [locale, ...CMS_LOCALES.filter((value) => value !== locale)].map(
          (value) => ({ [`publishedSlugs.${value}`]: slug }),
        ),
      })
      .exec()) as PageDocument | null;
    return page ? this.loadPublishedSnapshot(page) : null;
  }

  private async loadPublishedSnapshot(
    page: PageDocument,
  ): Promise<PublishedPageSnapshot | null> {
    if (!page.currentPublishedRevisionId) {
      return null;
    }
    const revision = await this.revisionsService.get(
      page.siteId.toString(),
      page.currentPublishedRevisionId.toString(),
    );
    return revision
      ? (revision.snapshot as unknown as PublishedPageSnapshot)
      : null;
  }

  /** Live-Entwurf fuer die Vorschau (nicht veroeffentlichte Sektionen). */
  async getDraftSnapshot(
    siteId: string,
    pageId: string,
  ): Promise<PublishedPageSnapshot | null> {
    const page = (await this.pageModel
      .findOne({ _id: pageId, siteId, deletedAt: null })
      .exec()) as PageDocument | null;
    if (!page) {
      return null;
    }
    const sections = await this.getSections(siteId, pageId);
    return this.buildSnapshot(page, sections);
  }

  // --- Hilfen ---

  async countByStatus(siteId: string): Promise<Record<string, number>> {
    const rows = await this.pageModel.aggregate<{ _id: string; count: number }>(
      [
        { $match: { siteId: new Types.ObjectId(siteId), deletedAt: null } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ],
    );
    return Object.fromEntries(rows.map((row) => [row._id, row.count]));
  }

  async findRecent(siteId: string, limit = 8): Promise<PageDocument[]> {
    return this.pageModel
      .find({ siteId, deletedAt: null })
      .select("internalName translations status updatedAt")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec() as Promise<PageDocument[]>;
  }

  private async clearHomepage(
    siteId: string,
    exceptPageId: string | null,
  ): Promise<void> {
    const filter: Record<string, unknown> = { siteId, isHomepage: true };
    if (exceptPageId) {
      filter._id = { $ne: new Types.ObjectId(exceptPageId) };
    }
    await this.pageModel.updateMany(filter, { $set: { isHomepage: false } });
  }

  private async assertSlugAvailable(
    siteId: string,
    locale: string,
    slug: string,
    exceptPageId: string | null,
  ): Promise<void> {
    const filter: Record<string, unknown> = {
      siteId,
      deletedAt: null,
      [`translations.${locale}.slug`]: slug,
    };
    if (exceptPageId) {
      filter._id = { $ne: new Types.ObjectId(exceptPageId) };
    }
    const existing = await this.pageModel.findOne(filter).select("_id").exec();
    if (existing) {
      throw new ConflictException(
        `Slug "${slug}" ist in dieser Sprache bereits vergeben.`,
      );
    }
  }

  private async uniqueSlug(
    siteId: string,
    locale: string,
    base: string,
  ): Promise<string> {
    let candidate = slugify(base);
    let counter = 2;
    // Bei Kollision Suffix anhaengen, bis frei.
    while (
      await this.pageModel
        .findOne({
          siteId,
          deletedAt: null,
          [`translations.${locale}.slug`]: candidate,
        })
        .select("_id")
        .exec()
    ) {
      candidate = `${slugify(base)}-${counter}`;
      counter += 1;
    }
    return candidate;
  }
}
