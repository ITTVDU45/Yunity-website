import { Controller, Get } from "@nestjs/common";
import { listBlockMeta } from "@yunity/block-schemas";
import type { BlockMetaResponse } from "@yunity/contracts";
import { RequirePermission } from "../../common/decorators";

/** Metadaten der registrierten Bloecke fuer den Seiteneditor. */
@Controller("v1/admin/block-types")
export class BlockTypesController {
  @Get()
  @RequirePermission("pages.read")
  list(): BlockMetaResponse[] {
    return listBlockMeta().map((meta) => ({
      key: meta.key,
      label: meta.label,
      category: meta.category,
      schemaVersion: meta.schemaVersion,
      editorComponent: meta.editorComponent,
      defaultValue: meta.defaultValue,
    }));
  }
}
