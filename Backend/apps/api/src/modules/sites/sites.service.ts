import { Injectable } from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { Model } from "mongoose";
import type { SiteSummary } from "@yunity/contracts";
import { Site, type SiteDocument } from "./site.schema";

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
  ) {}

  async findActive(): Promise<SiteDocument[]> {
    return this.siteModel
      .find({ status: "ACTIVE", deletedAt: null })
      .sort({ name: 1 })
      .exec();
  }

  async findByIds(ids: string[]): Promise<SiteDocument[]> {
    return this.siteModel
      .find({ _id: { $in: ids }, deletedAt: null })
      .sort({ name: 1 })
      .exec();
  }

  async countActive(): Promise<number> {
    return this.siteModel.countDocuments({ status: "ACTIVE", deletedAt: null });
  }

  async findByKey(key: string): Promise<SiteDocument | null> {
    return this.siteModel
      .findOne({ key, status: "ACTIVE", deletedAt: null })
      .exec();
  }

  async findByDomain(domain: string): Promise<SiteDocument | null> {
    return this.siteModel
      .findOne({ primaryDomain: domain, status: "ACTIVE", deletedAt: null })
      .exec();
  }

  toSummary(site: SiteDocument): SiteSummary {
    return {
      id: site._id.toString(),
      key: site.key,
      name: site.name,
      defaultLocale: site.defaultLocale,
      enabledLocales: site.enabledLocales,
      enabledModules: site.enabledModules,
    };
  }
}
