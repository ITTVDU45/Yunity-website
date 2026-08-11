import { Injectable } from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { Model, Types } from "mongoose";
import { Setting, type SettingsGroup } from "./setting.schema";
import { isSensitiveKey } from "./settings.config";

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,
  ) {}

  /** Alle Werte einer Gruppe als flaches Objekt. */
  async getGroup(
    siteId: string,
    group: SettingsGroup,
  ): Promise<Record<string, unknown>> {
    const docs = await this.settingModel.find({ siteId, group }).exec();
    return Object.fromEntries(docs.map((doc) => [doc.key, doc.value]));
  }

  /** Upsert je Schluessel; Sensibel-Flag aus der zentralen Konfiguration. */
  async putGroup(
    siteId: string,
    group: SettingsGroup,
    values: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const operations = Object.entries(values).map(([key, value]) => ({
      updateOne: {
        filter: { siteId: new Types.ObjectId(siteId), group, key },
        update: {
          $set: { value, isSensitive: isSensitiveKey(group, key) },
        },
        upsert: true,
      },
    }));
    if (operations.length > 0) {
      await this.settingModel.bulkWrite(operations);
    }
    return this.getGroup(siteId, group);
  }

  /** Nicht-sensible Werte aller Gruppen (fuer die oeffentliche API). */
  async getPublicSettings(
    siteId: string,
  ): Promise<Record<string, Record<string, unknown>>> {
    const docs = await this.settingModel
      .find({ siteId, isSensitive: false })
      .exec();
    const result: Record<string, Record<string, unknown>> = {};
    for (const doc of docs) {
      const group = (result[doc.group] ??= {});
      group[doc.key] = doc.value;
    }
    return result;
  }
}
