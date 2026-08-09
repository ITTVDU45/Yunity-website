import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  ContentRevision,
  type ContentRevisionDocument,
} from "./schemas/content-revision.schema";

export interface CreateRevisionInput {
  siteId: string;
  entityType: string;
  entityId: string;
  snapshot: Record<string, unknown>;
  changeSummary?: string | null;
  isPublishedSnapshot?: boolean;
  createdBy?: string | null;
}

@Injectable()
export class RevisionsService {
  constructor(
    @InjectModel(ContentRevision.name)
    private readonly revisionModel: Model<ContentRevision>,
  ) {}

  /** Fortlaufende Versionsnummer je Entitaet (beginnt bei 1). */
  private async nextVersion(
    entityType: string,
    entityId: string,
  ): Promise<number> {
    const latest = await this.revisionModel
      .findOne({ entityType, entityId })
      .sort({ version: -1 })
      .select("version")
      .exec();
    return (latest?.version ?? 0) + 1;
  }

  async create(input: CreateRevisionInput): Promise<ContentRevisionDocument> {
    const version = await this.nextVersion(input.entityType, input.entityId);
    return this.revisionModel.create({
      siteId: new Types.ObjectId(input.siteId),
      entityType: input.entityType,
      entityId: new Types.ObjectId(input.entityId),
      version,
      snapshot: input.snapshot,
      changeSummary: input.changeSummary ?? null,
      isPublishedSnapshot: input.isPublishedSnapshot ?? false,
      createdBy: input.createdBy ? new Types.ObjectId(input.createdBy) : null,
    }) as Promise<ContentRevisionDocument>;
  }

  async list(
    entityType: string,
    entityId: string,
  ): Promise<ContentRevisionDocument[]> {
    return this.revisionModel
      .find({ entityType, entityId })
      .sort({ version: -1 })
      .exec() as Promise<ContentRevisionDocument[]>;
  }

  async get(
    siteId: string,
    revisionId: string,
  ): Promise<ContentRevisionDocument | null> {
    if (!Types.ObjectId.isValid(revisionId)) {
      return null;
    }
    return this.revisionModel
      .findOne({ _id: revisionId, siteId })
      .exec() as Promise<ContentRevisionDocument | null>;
  }
}
