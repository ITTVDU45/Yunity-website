import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  defaultBlockData,
  getBlock,
  isKnownBlock,
  validateBlockData,
} from "@yunity/block-schemas";
import type { PublicSection } from "@yunity/contracts";
import { POSITION_GAP, nextPosition } from "@yunity/utilities";
import {
  ContentSection,
  type ContentSectionDocument,
  type SectionOwnerType,
} from "./schemas/content-section.schema";
import { sanitizeBlockData } from "./sanitize";

export interface AddSectionInput {
  blockType: string;
  internalLabel?: string;
  position?: number;
}

export interface UpdateSectionInput {
  internalLabel?: string | null;
  locale?: string;
  data?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  isEnabled?: boolean;
}

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(ContentSection.name)
    private readonly sectionModel: Model<ContentSection>,
  ) {}

  async listByOwner(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
  ): Promise<ContentSectionDocument[]> {
    return this.sectionModel
      .find({ siteId, ownerType, ownerId, deletedAt: null })
      .sort({ position: 1 })
      .exec();
  }

  async add(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
    input: AddSectionInput,
  ): Promise<ContentSectionDocument> {
    if (!isKnownBlock(input.blockType)) {
      throw new BadRequestException(
        `Unbekannter Blocktyp "${input.blockType}".`,
      );
    }
    const block = getBlock(input.blockType);
    const siblings = await this.sectionModel
      .find({ siteId, ownerType, ownerId, deletedAt: null })
      .select("position")
      .exec();
    const position =
      input.position ?? nextPosition(siblings.map((s) => s.position));

    return this.sectionModel.create({
      siteId: new Types.ObjectId(siteId),
      ownerType,
      ownerId: new Types.ObjectId(ownerId),
      blockType: input.blockType,
      schemaVersion: block?.schemaVersion ?? 1,
      internalLabel: input.internalLabel ?? block?.label ?? null,
      position,
      // Standardwert liegt zunaechst unter der Default-Locale.
      data: { de: defaultBlockData(input.blockType) },
      settings: {},
    });
  }

  private async getOwned(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
    sectionId: string,
  ): Promise<ContentSectionDocument> {
    if (
      !Types.ObjectId.isValid(ownerId) ||
      !Types.ObjectId.isValid(sectionId)
    ) {
      throw new NotFoundException("Sektion nicht gefunden.");
    }
    const section = await this.sectionModel
      .findOne({
        _id: sectionId,
        siteId,
        ownerType,
        ownerId,
        deletedAt: null,
      })
      .exec();
    if (!section) {
      throw new NotFoundException("Sektion nicht gefunden.");
    }
    return section;
  }

  async update(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
    sectionId: string,
    input: UpdateSectionInput,
  ): Promise<ContentSectionDocument> {
    const section = await this.getOwned(
      siteId,
      ownerType,
      ownerId,
      sectionId,
    );

    if (input.internalLabel !== undefined) {
      section.internalLabel = input.internalLabel;
    }
    if (input.isEnabled !== undefined) {
      section.isEnabled = input.isEnabled;
    }
    if (input.settings !== undefined) {
      section.settings = input.settings;
      section.markModified("settings");
    }
    if (input.data !== undefined) {
      const locale = input.locale ?? "de";
      const validation = validateBlockData(section.blockType, input.data);
      if (!validation.success) {
        throw new BadRequestException({
          message: "Blockdaten sind ungueltig.",
          issues: validation.issues,
        });
      }
      const clean = sanitizeBlockData(validation.data) as Record<
        string,
        unknown
      >;
      section.data = { ...section.data, [locale]: clean };
      section.markModified("data");
    }

    await section.save();
    return section;
  }

  async duplicate(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
    sectionId: string,
  ): Promise<ContentSectionDocument> {
    const section = await this.getOwned(
      siteId,
      ownerType,
      ownerId,
      sectionId,
    );
    const siblings = await this.sectionModel
      .find({
        siteId,
        ownerType: section.ownerType,
        ownerId: section.ownerId,
        deletedAt: null,
      })
      .select("position")
      .exec();
    return this.sectionModel.create({
      siteId: section.siteId,
      ownerType: section.ownerType,
      ownerId: section.ownerId,
      blockType: section.blockType,
      schemaVersion: section.schemaVersion,
      internalLabel: section.internalLabel
        ? `${section.internalLabel} (Kopie)`
        : null,
      position: nextPosition(siblings.map((s) => s.position)),
      data: structuredClone(section.data),
      settings: structuredClone(section.settings),
      isEnabled: section.isEnabled,
    });
  }

  async remove(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
    sectionId: string,
  ): Promise<void> {
    const section = await this.getOwned(
      siteId,
      ownerType,
      ownerId,
      sectionId,
    );
    section.deletedAt = new Date();
    await section.save();
  }

  /** Umordnung per bulkWrite (atomar je Dokument; transaktionsfreier Ersatz). */
  async reorder(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
    orderedIds: readonly string[],
  ): Promise<void> {
    const operations = orderedIds.map((id, index) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(id),
          siteId: new Types.ObjectId(siteId),
          ownerType,
          ownerId: new Types.ObjectId(ownerId),
        },
        update: { $set: { position: (index + 1) * POSITION_GAP } },
      },
    }));
    if (operations.length > 0) {
      await this.sectionModel.bulkWrite(operations);
    }
  }

  async deleteAllForOwner(
    siteId: string,
    ownerType: SectionOwnerType,
    ownerId: string,
  ): Promise<void> {
    await this.sectionModel.updateMany(
      { siteId, ownerType, ownerId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
    );
  }
}

/**
 * Loest gespeicherte Sektionen fuer die oeffentliche Ausgabe auf:
 * nur aktive, bekannte Bloecke; Inhaltsdaten in der gewuenschten Locale mit
 * Fallback auf die Default-Locale. Unbekannte Bloecke werden uebersprungen —
 * sie duerfen die Seite nicht zum Absturz bringen.
 */
export function resolvePublicSections(
  sections: ReadonlyArray<{
    id: string;
    blockType: string;
    schemaVersion: number;
    data: Record<string, unknown>;
    settings: Record<string, unknown>;
    isEnabled: boolean;
  }>,
  locale: string,
  defaultLocale: string,
): PublicSection[] {
  const result: PublicSection[] = [];
  for (const section of sections) {
    if (!section.isEnabled || !isKnownBlock(section.blockType)) {
      continue;
    }
    // Eine Sektion ohne jede gepflegte Sprache hat gar kein data-Objekt (etwa
    // ein frisch angelegter Block ohne Eingaben). Ohne Optional Chaining
    // reisst dieser Zugriff die komplette Seitenantwort mit.
    const data =
      (section.data?.[locale] as Record<string, unknown> | undefined) ??
      (section.data?.[defaultLocale] as Record<string, unknown> | undefined) ??
      {};
    result.push({
      id: section.id,
      type: section.blockType,
      schemaVersion: section.schemaVersion,
      data,
      settings: section.settings ?? {},
    });
  }
  return result;
}
