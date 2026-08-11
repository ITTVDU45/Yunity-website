import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { Model, Types, type HydratedDocument } from "mongoose";
import { slugify } from "@yunity/utilities";
import {
  Competency,
  type CompetencyDocument,
  TeamCategory,
  type TeamCategoryDocument,
} from "./taxonomy.schema";

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectModel(Competency.name)
    private readonly competencyModel: Model<Competency>,
    @InjectModel(TeamCategory.name)
    private readonly categoryModel: Model<TeamCategory>,
  ) {}

  // --- Kompetenzen ---

  async listCompetencies(siteId: string): Promise<CompetencyDocument[]> {
    return this.competencyModel
      .find({ siteId, deletedAt: null })
      .sort({ position: 1 })
      .exec();
  }

  async createCompetency(
    siteId: string,
    locale: string,
    title: string,
  ): Promise<CompetencyDocument> {
    const position = await this.nextPosition(this.competencyModel, siteId);
    return this.competencyModel.create({
      siteId: new Types.ObjectId(siteId),
      position,
      translations: { [locale]: { title, slug: slugify(title) } },
    });
  }

  async updateCompetency(
    siteId: string,
    id: string,
    locale: string,
    title: string,
  ): Promise<CompetencyDocument> {
    const doc = await this.getOwned(this.competencyModel, siteId, id);
    doc.translations = {
      ...doc.translations,
      [locale]: { title, slug: slugify(title) },
    };
    doc.markModified("translations");
    await doc.save();
    return doc;
  }

  async removeCompetency(siteId: string, id: string): Promise<void> {
    const doc = await this.getOwned(this.competencyModel, siteId, id);
    doc.deletedAt = new Date();
    await doc.save();
  }

  // --- Team-Kategorien ---

  async listCategories(siteId: string): Promise<TeamCategoryDocument[]> {
    return this.categoryModel
      .find({ siteId, deletedAt: null })
      .sort({ position: 1 })
      .exec();
  }

  async createCategory(
    siteId: string,
    locale: string,
    title: string,
    description?: string,
  ): Promise<TeamCategoryDocument> {
    const position = await this.nextPosition(this.categoryModel, siteId);
    return this.categoryModel.create({
      siteId: new Types.ObjectId(siteId),
      position,
      translations: { [locale]: { title, description } },
    });
  }

  async updateCategory(
    siteId: string,
    id: string,
    locale: string,
    title: string,
    description?: string,
  ): Promise<TeamCategoryDocument> {
    const doc = await this.getOwned(this.categoryModel, siteId, id);
    doc.translations = {
      ...doc.translations,
      [locale]: { title, description },
    };
    doc.markModified("translations");
    await doc.save();
    return doc;
  }

  async removeCategory(siteId: string, id: string): Promise<void> {
    const doc = await this.getOwned(this.categoryModel, siteId, id);
    doc.deletedAt = new Date();
    await doc.save();
  }

  // --- Hilfen ---

  private async nextPosition<T>(
    model: Model<T>,
    siteId: string,
  ): Promise<number> {
    const docs = await model
      .find({ siteId, deletedAt: null } as Record<string, unknown>)
      .select("position")
      .exec();
    const positions = docs.map(
      (doc) => (doc as unknown as { position: number }).position,
    );
    return (positions.length ? Math.max(...positions) : 0) + 1000;
  }

  private async getOwned<T>(
    model: Model<T>,
    siteId: string,
    id: string,
  ): Promise<HydratedDocument<T>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Eintrag nicht gefunden.");
    }
    const doc = await model.findOne({
      _id: id,
      siteId,
      deletedAt: null,
    } as Record<string, unknown>);
    if (!doc) {
      throw new NotFoundException("Eintrag nicht gefunden.");
    }
    return doc as HydratedDocument<T>;
  }
}
