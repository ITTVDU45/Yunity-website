import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, type HydratedDocument } from "mongoose";

/** Verwaltbare Kompetenz (Datensatz statt freier Text). */
@Schema({ timestamps: true, collection: "competencies" })
export class Competency {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ default: 1000 })
  position: number;

  /** { de: { title, slug } }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, { title?: string; slug?: string }>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type CompetencyDocument = HydratedDocument<Competency>;
export const CompetencySchema = SchemaFactory.createForClass(Competency);

/** Team-Kategorie (Gruendungspartner, Partner …). */
@Schema({ timestamps: true, collection: "team_categories" })
export class TeamCategory {
  @Prop({ type: SchemaTypes.ObjectId, ref: "Site", required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ default: 1000 })
  position: number;

  /** { de: { title, description } }. */
  @Prop({ type: SchemaTypes.Mixed, default: {} })
  translations: Record<string, { title?: string; description?: string }>;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export type TeamCategoryDocument = HydratedDocument<TeamCategory>;
export const TeamCategorySchema = SchemaFactory.createForClass(TeamCategory);
