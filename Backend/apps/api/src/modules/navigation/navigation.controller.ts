import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import type {
  NavigationItemResponse,
  NavigationResponse,
} from "@yunity/contracts";
import { ActiveSiteId } from "../../common/site-context";
import { RequirePermission } from "../../common/decorators";
import {
  CreateNavigationDto,
  CreateNavigationItemDto,
  ReorderNavigationDto,
  UpdateNavigationItemDto,
} from "./dto";
import type { NavigationItemDocument } from "./navigation-item.schema";
import { NavigationService } from "./navigation.service";

function itemToResponse(
  item: NavigationItemDocument,
): Omit<NavigationItemResponse, "children"> {
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

@Controller("v1/admin/navigations")
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @RequirePermission("navigation.read")
  async list(@ActiveSiteId() siteId: string) {
    const navs = await this.navigationService.listNavigations(siteId);
    return navs.map((nav) => ({
      id: nav._id.toString(),
      key: nav.key,
      name: nav.name,
    }));
  }

  @Post()
  @RequirePermission("navigation.manage")
  async create(
    @ActiveSiteId() siteId: string,
    @Body() dto: CreateNavigationDto,
  ) {
    const nav = await this.navigationService.createNavigation(siteId, dto);
    return { id: nav._id.toString(), key: nav.key, name: nav.name };
  }

  @Get(":id/tree")
  @RequirePermission("navigation.read")
  async tree(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
  ): Promise<NavigationResponse> {
    const { navigation, tree } = await this.navigationService.getTree(
      siteId,
      id,
    );
    return {
      id: navigation._id.toString(),
      key: navigation.key,
      name: navigation.name,
      items: tree,
    };
  }

  @Post(":id/items")
  @RequirePermission("navigation.manage")
  async addItem(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: CreateNavigationItemDto,
  ) {
    const item = await this.navigationService.addItem(siteId, id, dto);
    return itemToResponse(item);
  }

  @Patch(":id/items/:itemId")
  @RequirePermission("navigation.manage")
  async updateItem(
    @ActiveSiteId() siteId: string,
    @Param("itemId") itemId: string,
    @Body() dto: UpdateNavigationItemDto,
  ) {
    const item = await this.navigationService.updateItem(siteId, itemId, dto);
    return itemToResponse(item);
  }

  @Delete(":id/items/:itemId")
  @RequirePermission("navigation.manage")
  async removeItem(
    @ActiveSiteId() siteId: string,
    @Param("itemId") itemId: string,
  ) {
    await this.navigationService.removeItem(siteId, itemId);
    return { deleted: true };
  }

  @Post(":id/reorder")
  @RequirePermission("navigation.manage")
  async reorder(
    @ActiveSiteId() siteId: string,
    @Param("id") id: string,
    @Body() dto: ReorderNavigationDto,
  ) {
    await this.navigationService.reorder(siteId, id, dto.order);
    return { reordered: true };
  }
}
