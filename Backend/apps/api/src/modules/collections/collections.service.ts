import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { Model, Types } from "mongoose";
import { slugify, stripUndefined } from "@yunity/utilities";
import { CMS_LOCALES } from "@yunity/contracts";
import { escapeRegex } from "../../common/regex";
import { MediaService } from "../media/media.service";
import { RevisionsService } from "../pages/revisions.service";
import { SectionsService } from "../pages/sections.service";
import {
  nextStatus,
  type ContentStatus,
  type WorkflowAction,
} from "../pages/publishing/workflow";
import type { ContentSectionDocument } from "../pages/schemas/content-section.schema";
import {
  CollectionItem,
  type CollectionItemDocument,
  type CollectionKind,
  type CollectionRelations,
  type CollectionTranslationValue,
} from "./collection-item.schema";
import { KIND_CONFIG } from "./kinds";

const RELATION_KEYS: (keyof CollectionRelations)[] = [
  "serviceIds",
  "industryIds",
  "competencyIds",
];

export interface CollectionListQuery {
  status?: string;
  search?: string;
  locale?: string;
  page: number;
  limit: number;
}

export interface CreateCollectionInput {
  title?: string;
  slug?: string;
  locale?: string;
  attributes?: Record<string, unknown>;
}

export interface UpdateCollectionInput {
  locale?: string;
  translation?: CollectionTranslationValue;
  attributes?: Record<string, unknown>;
  relations?: CollectionRelations;
  imageId?: string | null;
  icon?: string | null;
  featured?: boolean;
}

interface CollectionSnapshot {
  translations: Record<string, CollectionTranslationValue>;
  attributes: Record<string, unknown>;
  relations: CollectionRelations;
  imageId: string | null;
  icon: string | null;
  featured: boolean;
  sections: {
    id: string;
    blockType: string;
    schemaVersion: number;
    data: Record<string, unknown>;
    settings: Record<string, unknown>;
    isEnabled: boolean;
  }[];
}

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(CollectionItem.name)
    private readonly itemModel: Model<CollectionItem>,
    private readonly mediaService: MediaService,
    private readonly revisionsService: RevisionsService,
    private readonly sectionsService: SectionsService,
  ) {}

  // --- Abfragen ---

  async list(
    siteId: string,
    kind: CollectionKind,
    query: CollectionListQuery,
  ): Promise<{ items: CollectionItemDocument[]; total: number }> {
    const filter: Record<string, unknown> = { siteId, kind, deletedAt: null };
    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter[`translations.${query.locale ?? "de"}.title`] = {
        $regex: escapeRegex(query.search),
        $options: "i",
      };
    }
    const [items, total] = await Promise.all([
      this.itemModel
        .find(filter)
        .sort({ position: 1, updatedAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .exec() as Promise<CollectionItemDocument[]>,
      this.itemModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async getOwned(
    siteId: string,
    kind: CollectionKind,
    id: string,
  ): Promise<CollectionItemDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Eintrag nicht gefunden.");
    }
    const item = (await this.itemModel
      .findOne({ _id: id, siteId, kind, deletedAt: null })
      .exec()) as CollectionItemDocument | null;
    if (!item) {
      throw new NotFoundException("Eintrag nicht gefunden.");
    }
    return item;
  }

  async getSections(
    siteId: string,
    kind: CollectionKind,
    id: string,
  ): Promise<ContentSectionDocument[]> {
    return this.sectionsService.listByOwner(
      siteId,
      KIND_CONFIG[kind].ownerType,
      id,
    );
  }

  async imageUrl(
    siteId: string,
    item: CollectionItemDocument,
  ): Promise<string | null> {
    return item.imageId
      ? this.mediaService.resolveUrl(siteId, item.imageId.toString())
      : null;
  }

  async imageUrlById(
    siteId: string,
    assetId: string | null,
  ): Promise<string | null> {
    return assetId ? this.mediaService.resolveUrl(siteId, assetId) : null;
  }

  // --- Schreiboperationen ---

  async create(
    siteId: string,
    kind: CollectionKind,
    userId: string,
    input: CreateCollectionInput,
  ): Promise<CollectionItemDocument> {
    const locale = input.locale ?? "de";
    const title = input.title ?? "Neuer Eintrag";
    const slug = slugify(input.slug ?? title);
    await this.assertSlugAvailable(siteId, kind, locale, slug, null);

    const attributes = this.validateAttributes(kind, input.attributes ?? {});
    const siblings = await this.itemModel
      .find({ siteId, kind, deletedAt: null })
      .select("position")
      .exec();
    const position =
      (siblings.reduce((max, s) => Math.max(max, s.position), 0) || 0) + 1000;

    const created = await this.itemModel.create({
      siteId: new Types.ObjectId(siteId),
      kind,
      status: "DRAFT",
      position,
      translations: {
        [locale]: { title, slug, translationStatus: "DRAFT" },
      },
      attributes,
      relations: {},
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });
    return created as CollectionItemDocument;
  }

  async update(
    siteId: string,
    kind: CollectionKind,
    userId: string,
    id: string,
    input: UpdateCollectionInput,
  ): Promise<CollectionItemDocument> {
    const item = await this.getOwned(siteId, kind, id);

    if (input.translation) {
      const locale = input.locale ?? "de";
      const current = item.translations[locale] ?? {};
      // undefined-Felder aus dem DTO entfernen, damit bestehende Werte
      // (Titel, Slug …) beim Teil-Update nicht ueberschrieben werden.
      const incoming = stripUndefined(
        input.translation as Record<string, unknown>,
      );
      const merged: CollectionTranslationValue = { ...current, ...incoming };
      if (typeof incoming.slug === "string") {
        merged.slug = slugify(incoming.slug);
        await this.assertSlugAvailable(siteId, kind, locale, merged.slug, id);
      }
      item.translations = { ...item.translations, [locale]: merged };
      item.markModified("translations");
    }
    if (input.attributes !== undefined) {
      item.attributes = this.validateAttributes(kind, input.attributes);
      item.markModified("attributes");
    }
    if (input.relations !== undefined) {
      item.relations = this.sanitizeRelations(input.relations);
      item.markModified("relations");
    }
    if (input.imageId !== undefined) {
      item.imageId = input.imageId ? new Types.ObjectId(input.imageId) : null;
    }
    if (input.icon !== undefined) {
      item.icon = input.icon;
    }
    if (input.featured !== undefined) {
      item.featured = input.featured;
    }
    item.updatedBy = new Types.ObjectId(userId);
    await item.save();
    return item;
  }

  async remove(
    siteId: string,
    kind: CollectionKind,
    id: string,
  ): Promise<void> {
    const item = await this.getOwned(siteId, kind, id);
    item.deletedAt = new Date();
    await item.save();
    await this.sectionsService.deleteAllForOwner(
      siteId,
      KIND_CONFIG[kind].ownerType,
      id,
    );
  }

  async reorder(
    siteId: string,
    kind: CollectionKind,
    orderedIds: readonly string[],
  ): Promise<void> {
    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(id),
          siteId: new Types.ObjectId(siteId),
          kind,
        },
        update: { $set: { position: (index + 1) * 1000 } },
      },
    }));
    if (operations.length > 0) {
      await this.itemModel.bulkWrite(operations);
    }
  }

  // --- Workflow / Publishing ---

  async runWorkflow(
    siteId: string,
    kind: CollectionKind,
    userId: string,
    id: string,
    action: WorkflowAction,
  ): Promise<{ item: CollectionItemDocument; revalidateTags: string[] }> {
    const item = await this.getOwned(siteId, kind, id);
    const target = nextStatus(item.status as ContentStatus, action);
    if (!target) {
      throw new BadRequestException(
        `Aktion "${action}" ist im Status "${item.status}" nicht erlaubt.`,
      );
    }

    let revalidateTags: string[] = [];
    if (action === "publish") {
      revalidateTags = await this.applyPublish(siteId, kind, userId, item);
    } else if (action === "unpublish") {
      item.status = target;
      item.currentPublishedRevisionId = null;
      item.publishedSlugs = {};
      item.publishedCard = {};
      item.markModified("publishedSlugs");
      item.markModified("publishedCard");
      revalidateTags = [`${kind}:list`];
    } else {
      item.status = target;
    }

    item.updatedBy = new Types.ObjectId(userId);
    await item.save();
    return { item, revalidateTags };
  }

  private async applyPublish(
    siteId: string,
    kind: CollectionKind,
    userId: string,
    item: CollectionItemDocument,
  ): Promise<string[]> {
    const sections = await this.getSections(siteId, kind, item._id.toString());
    const snapshot = this.buildSnapshot(item, sections);
    const revision = await this.revisionsService.create({
      siteId,
      entityType: KIND_CONFIG[kind].entityType,
      entityId: item._id.toString(),
      snapshot: snapshot as unknown as Record<string, unknown>,
      isPublishedSnapshot: true,
      createdBy: userId,
    });

    const publishedSlugs: Record<string, string> = {};
    const publishedCard: Record<string, CollectionTranslationValue> = {};
    for (const [locale, value] of Object.entries(item.translations)) {
      if (value.slug) {
        publishedSlugs[locale] = value.slug;
      }
      publishedCard[locale] = {
        title: value.title,
        subtitle: value.subtitle,
        excerpt: value.excerpt,
        slug: value.slug,
        details: value.details,
      };
    }

    item.status = "PUBLISHED";
    item.publishedAt = new Date();
    item.currentPublishedRevisionId = revision._id;
    item.publishedSlugs = publishedSlugs;
    item.publishedCard = publishedCard;
    item.markModified("publishedSlugs");
    item.markModified("publishedCard");

    const tags = [`${kind}:list`];
    for (const slug of Object.values(publishedSlugs)) {
      tags.push(`${kind}:${slug}`);
    }
    return tags;
  }

  private buildSnapshot(
    item: CollectionItemDocument,
    sections: ContentSectionDocument[],
  ): CollectionSnapshot {
    return {
      translations: structuredClone(item.translations),
      attributes: structuredClone(item.attributes),
      relations: structuredClone(item.relations),
      imageId: item.imageId ? item.imageId.toString() : null,
      icon: item.icon,
      featured: item.featured,
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

  // --- Public ---

  async getPublishedBySlug(
    siteId: string,
    kind: CollectionKind,
    slug: string,
    locale: string,
  ): Promise<{ item: CollectionItemDocument; snapshot: CollectionSnapshot } | null> {
    const item = (await this.itemModel
      .findOne({
        siteId,
        kind,
        currentPublishedRevisionId: { $ne: null },
        deletedAt: null,
        $or: [locale, ...CMS_LOCALES.filter((value) => value !== locale)].map(
          (value) => ({ [`publishedSlugs.${value}`]: slug }),
        ),
      })
      .exec()) as CollectionItemDocument | null;
    if (!item || !item.currentPublishedRevisionId) {
      return null;
    }
    const revision = await this.revisionsService.get(
      siteId,
      item.currentPublishedRevisionId.toString(),
    );
    if (!revision) {
      return null;
    }
    return { item, snapshot: revision.snapshot as unknown as CollectionSnapshot };
  }

  /**
   * Aufloesung fuer Collection-Grid-Bloecke. Liefert veroeffentlichte Eintraege
   * gemaess Auswahlmodus als kompakte Karten (aus publishedCard, kein N+1).
   */
  async resolveForBlock(
    siteId: string,
    kind: CollectionKind,
    query: {
      selectionMode?: string;
      selectedIds?: string[];
      filterId?: string;
      limit?: number;
    },
    locale: string,
    defaultLocale: string,
  ): Promise<
    {
      id: string;
      slug: string;
      title: string;
      subtitle?: string;
      excerpt?: string;
      icon: string | null;
      imageUrl: string | null;
      attributes: Record<string, unknown>;
    }[]
  > {
    const filter: Record<string, unknown> = {
      siteId,
      kind,
      currentPublishedRevisionId: { $ne: null },
      deletedAt: null,
    };

    const mode = query.selectionMode ?? "all";
    switch (mode) {
      case "featured":
        filter.featured = true;
        break;
      case "manual":
      case "ordered":
        filter._id = {
          $in: (query.selectedIds ?? [])
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id)),
        };
        break;
      case "byService":
        filter["relations.serviceIds"] = query.filterId;
        break;
      case "byIndustry":
        filter["relations.industryIds"] = query.filterId;
        break;
      case "byCompetency":
        filter["relations.competencyIds"] = query.filterId;
        break;
      default:
        break;
    }

    const sort: Record<string, 1 | -1> =
      mode === "latest" ? { publishedAt: -1 } : { position: 1 };
    let cursor = this.itemModel.find(filter).sort(sort);
    if (query.limit) {
      cursor = cursor.limit(query.limit);
    }
    let items = (await cursor.exec()) as CollectionItemDocument[];

    // Manuelle Reihenfolge bei "ordered" erhalten.
    if (mode === "ordered" && query.selectedIds) {
      const order = new Map(query.selectedIds.map((id, i) => [id, i]));
      items = [...items].sort(
        (a, b) =>
          (order.get(a._id.toString()) ?? 0) -
          (order.get(b._id.toString()) ?? 0),
      );
    }

    const imageUrls = await this.mediaService.resolveUrls(
      siteId,
      items
        .map((item) => (item.imageId ? item.imageId.toString() : ""))
        .filter(Boolean),
    );

    return items.map((item) => {
      const card =
        item.publishedCard[locale] ?? item.publishedCard[defaultLocale] ?? {};
      return {
        id: item._id.toString(),
        slug: card.slug ?? "",
        title: card.title ?? "",
        subtitle: card.subtitle,
        excerpt: card.excerpt,
        icon: item.icon,
        imageUrl: item.imageId
          ? (imageUrls[item.imageId.toString()] ?? null)
          : typeof card.details?.imageUrl === "string"
            ? card.details.imageUrl
            : typeof item.attributes.imageUrl === "string"
              ? item.attributes.imageUrl
              : null,
        attributes: {
          ...item.attributes,
          ...(card.details ?? {}),
        },
      };
    });
  }

  async countByStatus(
    siteId: string,
    kind: CollectionKind,
  ): Promise<Record<string, number>> {
    const rows = await this.itemModel.aggregate<{ _id: string; count: number }>(
      [
        {
          $match: {
            siteId: new Types.ObjectId(siteId),
            kind,
            deletedAt: null,
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ],
    );
    return Object.fromEntries(rows.map((row) => [row._id, row.count]));
  }

  async findRecent(
    siteId: string,
    limit = 8,
  ): Promise<CollectionItemDocument[]> {
    return this.itemModel
      .find({ siteId, deletedAt: null })
      .select("kind translations status updatedAt")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec() as Promise<CollectionItemDocument[]>;
  }

  // --- Hilfen ---

  private validateAttributes(
    kind: CollectionKind,
    attributes: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = KIND_CONFIG[kind].attributesSchema.safeParse(attributes);
    if (!result.success) {
      throw new BadRequestException({
        message: "Attribute sind ungueltig.",
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    return result.data as Record<string, unknown>;
  }

  private sanitizeRelations(
    relations: CollectionRelations,
  ): CollectionRelations {
    const clean: CollectionRelations = {};
    for (const key of RELATION_KEYS) {
      const ids = relations[key];
      if (Array.isArray(ids)) {
        clean[key] = [...new Set(ids.filter((id) => Types.ObjectId.isValid(id)))];
      }
    }
    return clean;
  }

  private async assertSlugAvailable(
    siteId: string,
    kind: CollectionKind,
    locale: string,
    slug: string,
    exceptId: string | null,
  ): Promise<void> {
    const filter: Record<string, unknown> = {
      siteId,
      kind,
      deletedAt: null,
      [`translations.${locale}.slug`]: slug,
    };
    if (exceptId) {
      filter._id = { $ne: new Types.ObjectId(exceptId) };
    }
    const existing = await this.itemModel.findOne(filter).select("_id").exec();
    if (existing) {
      throw new ConflictException(
        `Slug "${slug}" ist in dieser Sprache bereits vergeben.`,
      );
    }
  }
}
