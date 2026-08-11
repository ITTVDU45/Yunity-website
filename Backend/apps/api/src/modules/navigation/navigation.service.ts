import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "../../common/nest-mongoose";
import { Model, Types } from "mongoose";
import { POSITION_GAP, nextPosition } from "@yunity/utilities";
import { Navigation, type NavigationDocument } from "./navigation.schema";
import {
  NavigationItem,
  type NavigationItemDocument,
} from "./navigation-item.schema";
import {
  buildNavigationTree,
  type FlatNavigationItem,
} from "./navigation-tree";
import type {
  CreateNavigationDto,
  CreateNavigationItemDto,
  ReorderEntryDto,
  UpdateNavigationItemDto,
} from "./dto";

function toFlat(item: NavigationItemDocument): FlatNavigationItem {
  return {
    id: item._id.toString(),
    parentId: item.parentId ? item.parentId.toString() : null,
    type: item.type,
    label: item.label,
    translations: item.translations,
    pageId: item.pageId ? item.pageId.toString() : null,
    url: item.url,
    anchor: item.anchor,
    target: item.target,
    icon: item.icon,
    cssClass: item.cssClass,
    position: item.position,
    isVisible: item.isVisible,
  };
}

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name)
    private readonly navModel: Model<Navigation>,
    @InjectModel(NavigationItem.name)
    private readonly itemModel: Model<NavigationItem>,
  ) {}

  async listNavigations(siteId: string): Promise<NavigationDocument[]> {
    return this.navModel
      .find({ siteId, deletedAt: null })
      .sort({ key: 1 })
      .exec();
  }

  async createNavigation(
    siteId: string,
    dto: CreateNavigationDto,
  ): Promise<NavigationDocument> {
    const existing = await this.navModel.findOne({
      siteId,
      key: dto.key,
      deletedAt: null,
    });
    if (existing) {
      throw new ConflictException(
        `Navigation mit Schluessel "${dto.key}" existiert bereits.`,
      );
    }
    return this.navModel.create({
      siteId: new Types.ObjectId(siteId),
      key: dto.key,
      name: dto.name,
    });
  }

  private async getNavigation(
    siteId: string,
    navigationId: string,
  ): Promise<NavigationDocument> {
    if (!Types.ObjectId.isValid(navigationId)) {
      throw new NotFoundException("Navigation nicht gefunden.");
    }
    const nav = await this.navModel.findOne({
      _id: navigationId,
      siteId,
      deletedAt: null,
    });
    if (!nav) {
      throw new NotFoundException("Navigation nicht gefunden.");
    }
    return nav;
  }

  async getItems(
    siteId: string,
    navigationId: string,
  ): Promise<NavigationItemDocument[]> {
    return this.itemModel
      .find({ navigationId, siteId, deletedAt: null })
      .sort({ position: 1 })
      .exec();
  }

  async getTree(siteId: string, navigationId: string) {
    const nav = await this.getNavigation(siteId, navigationId);
    const items = await this.getItems(siteId, navigationId);
    return {
      navigation: nav,
      tree: buildNavigationTree(items.map(toFlat)),
    };
  }

  async addItem(
    siteId: string,
    navigationId: string,
    dto: CreateNavigationItemDto,
  ): Promise<NavigationItemDocument> {
    await this.getNavigation(siteId, navigationId);
    const parentId = dto.parentId ?? null;
    const siblings = await this.itemModel
      .find({ navigationId, parentId, deletedAt: null })
      .select("position")
      .exec();
    const position = nextPosition(siblings.map((sibling) => sibling.position));

    return this.itemModel.create({
      siteId: new Types.ObjectId(siteId),
      navigationId: new Types.ObjectId(navigationId),
      parentId: parentId ? new Types.ObjectId(parentId) : null,
      type: dto.type,
      label: dto.label,
      translations: { [dto.locale ?? "de"]: dto.label },
      pageId: dto.pageId ? new Types.ObjectId(dto.pageId) : null,
      url: dto.url ?? null,
      anchor: dto.anchor ?? null,
      target: dto.target ?? "SELF",
      icon: dto.icon ?? null,
      position,
    });
  }

  async updateItem(
    siteId: string,
    itemId: string,
    dto: UpdateNavigationItemDto,
  ): Promise<NavigationItemDocument> {
    const item = await this.getItem(siteId, itemId);
    if (dto.label !== undefined) item.label = dto.label;
    if (dto.translations !== undefined) {
      item.translations = dto.translations;
      item.markModified("translations");
    }
    if (dto.type !== undefined) item.type = dto.type;
    if (dto.pageId !== undefined) {
      item.pageId = dto.pageId ? new Types.ObjectId(dto.pageId) : null;
    }
    if (dto.url !== undefined) item.url = dto.url;
    if (dto.anchor !== undefined) item.anchor = dto.anchor;
    if (dto.target !== undefined) item.target = dto.target;
    if (dto.icon !== undefined) item.icon = dto.icon;
    if (dto.cssClass !== undefined) item.cssClass = dto.cssClass;
    if (dto.isVisible !== undefined) item.isVisible = dto.isVisible;
    await item.save();
    return item;
  }

  private async getItem(
    siteId: string,
    itemId: string,
  ): Promise<NavigationItemDocument> {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new NotFoundException("Navigationspunkt nicht gefunden.");
    }
    const item = await this.itemModel.findOne({
      _id: itemId,
      siteId,
      deletedAt: null,
    });
    if (!item) {
      throw new NotFoundException("Navigationspunkt nicht gefunden.");
    }
    return item;
  }

  /** Loescht ein Item samt aller Nachkommen (rekursiv, soft delete). */
  async removeItem(siteId: string, itemId: string): Promise<void> {
    const item = await this.getItem(siteId, itemId);
    const toDelete = await this.collectDescendants(
      item.navigationId.toString(),
      itemId,
    );
    toDelete.push(itemId);
    await this.itemModel.updateMany(
      { _id: { $in: toDelete }, siteId },
      { $set: { deletedAt: new Date() } },
    );
  }

  private async collectDescendants(
    navigationId: string,
    rootId: string,
  ): Promise<string[]> {
    const all = await this.itemModel
      .find({ navigationId, deletedAt: null })
      .select("parentId")
      .exec();
    const childrenByParent = new Map<string, string[]>();
    for (const item of all) {
      const parent = item.parentId ? item.parentId.toString() : "";
      const bucket = childrenByParent.get(parent) ?? [];
      bucket.push(item._id.toString());
      childrenByParent.set(parent, bucket);
    }
    const result: string[] = [];
    const walk = (id: string): void => {
      for (const child of childrenByParent.get(id) ?? []) {
        result.push(child);
        walk(child);
      }
    };
    walk(rootId);
    return result;
  }

  /**
   * Umordnung: setzt parentId und Position aller genannten Items in einem
   * bulkWrite. MongoDB fuehrt jede Operation atomar aus; auf Standalone-Mongo
   * (ohne Replica-Set) ist das der transaktionsfreie Ersatz.
   */
  async reorder(
    siteId: string,
    navigationId: string,
    order: readonly ReorderEntryDto[],
  ): Promise<void> {
    await this.getNavigation(siteId, navigationId);
    const positionByParent = new Map<string, number>();

    const operations = order.map((entry) => {
      const parentKey = entry.parentId ?? "root";
      const next = (positionByParent.get(parentKey) ?? 0) + POSITION_GAP;
      positionByParent.set(parentKey, next);
      return {
        updateOne: {
          filter: {
            _id: new Types.ObjectId(entry.id),
            siteId: new Types.ObjectId(siteId),
            navigationId: new Types.ObjectId(navigationId),
          },
          update: {
            $set: {
              position: next,
              parentId: entry.parentId
                ? new Types.ObjectId(entry.parentId)
                : null,
            },
          },
        },
      };
    });

    if (operations.length > 0) {
      await this.itemModel.bulkWrite(operations);
    }
  }

  /** Oeffentliche Ausgabe: Baum nach Navigations-Key, nur sichtbare Items. */
  async getPublicTree(siteId: string, key: string, locale?: string) {
    const nav = await this.navModel.findOne({ siteId, key, deletedAt: null });
    if (!nav) {
      throw new NotFoundException("Navigation nicht gefunden.");
    }
    const items = await this.getItems(siteId, nav._id.toString());
    return {
      navigation: nav,
      tree: buildNavigationTree(items.map(toFlat), {
        onlyVisible: true,
        locale,
      }),
    };
  }

  async countItems(siteId: string): Promise<number> {
    return this.itemModel.countDocuments({ siteId, deletedAt: null });
  }
}
