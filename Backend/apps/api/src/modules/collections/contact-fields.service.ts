import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { Model, Types } from "mongoose";
import {
  ContactField,
  type ContactFieldDocument,
  type ContactOwnerType,
} from "./contact-field.schema";
import type { CreateContactFieldDto, UpdateContactFieldDto } from "./dto";

@Injectable()
export class ContactFieldsService {
  constructor(
    @InjectModel(ContactField.name)
    private readonly model: Model<ContactField>,
  ) {}

  async list(
    siteId: string,
    ownerType: ContactOwnerType,
    ownerId: string,
    onlyPublic = false,
  ): Promise<ContactFieldDocument[]> {
    const filter: Record<string, unknown> = {
      siteId,
      ownerType,
      ownerId,
      deletedAt: null,
    };
    if (onlyPublic) {
      filter.isPublic = true;
    }
    return this.model.find(filter).sort({ position: 1 }).exec();
  }

  async create(
    siteId: string,
    ownerType: ContactOwnerType,
    ownerId: string,
    dto: CreateContactFieldDto,
  ): Promise<ContactFieldDocument> {
    const siblings = await this.model
      .find({ siteId, ownerType, ownerId, deletedAt: null })
      .select("position")
      .exec();
    const position =
      (siblings.reduce((max, s) => Math.max(max, s.position), 0) || 0) + 1000;
    return this.model.create({
      siteId: new Types.ObjectId(siteId),
      ownerType,
      ownerId: new Types.ObjectId(ownerId),
      fieldType: dto.fieldType,
      label: dto.label,
      translations: { [dto.locale ?? "de"]: { label: dto.label } },
      value: dto.value,
      link: dto.link ?? null,
      icon: dto.icon ?? null,
      isPublic: dto.isPublic ?? true,
      position,
    });
  }

  async update(
    siteId: string,
    id: string,
    dto: UpdateContactFieldDto,
  ): Promise<ContactFieldDocument> {
    const field = await this.getOwned(siteId, id);
    if (dto.fieldType !== undefined) field.fieldType = dto.fieldType;
    if (dto.label !== undefined) {
      const locale = dto.locale ?? "de";
      field.translations = {
        ...(field.translations ?? {}),
        [locale]: {
          ...(field.translations?.[locale] ?? {}),
          label: dto.label,
        },
      };
      field.markModified("translations");
      if (locale === "de") field.label = dto.label;
    }
    if (dto.value !== undefined) field.value = dto.value;
    if (dto.link !== undefined) field.link = dto.link;
    if (dto.icon !== undefined) field.icon = dto.icon;
    if (dto.isPublic !== undefined) field.isPublic = dto.isPublic;
    await field.save();
    return field;
  }

  async remove(siteId: string, id: string): Promise<void> {
    const field = await this.getOwned(siteId, id);
    field.deletedAt = new Date();
    await field.save();
  }

  private async getOwned(
    siteId: string,
    id: string,
  ): Promise<ContactFieldDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Kontaktfeld nicht gefunden.");
    }
    const field = await this.model.findOne({ _id: id, siteId, deletedAt: null });
    if (!field) {
      throw new NotFoundException("Kontaktfeld nicht gefunden.");
    }
    return field;
  }
}
