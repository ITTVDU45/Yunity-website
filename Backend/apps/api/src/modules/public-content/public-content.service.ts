import { Injectable } from "@nestjs/common";
import { COLLECTION_BLOCK_KINDS } from "@yunity/block-schemas";
import type { PublicSection } from "@yunity/contracts";
import { resolvePublicSections } from "../pages/sections.service";
import { CollectionsService } from "../collections/collections.service";
import { isCollectionKind } from "../collections/kinds";
import { MediaService } from "../media/media.service";

interface RawSection {
  id: string;
  blockType: string;
  schemaVersion: number;
  data: Record<string, unknown>;
  settings: Record<string, unknown>;
  isEnabled: boolean;
}

/**
 * Setzt Snapshot-Sektionen fuer die oeffentliche Ausgabe zusammen und loest
 * Collection-Grid-Bloecke serverseitig auf (das Frontend muss keine
 * Zusatz-Requests je Sektion ausfuehren).
 */
@Injectable()
export class PublicContentService {
  constructor(
    private readonly collections: CollectionsService,
    private readonly media: MediaService,
  ) {}

  async resolveSections(
    siteId: string,
    sections: readonly RawSection[],
    locale: string,
    defaultLocale: string,
  ): Promise<PublicSection[]> {
    const base = resolvePublicSections(sections, locale, defaultLocale);

    return Promise.all(
      base.map(async (section) => {
        const collectionKind = COLLECTION_BLOCK_KINDS[section.type];
        let data = section.data;
        if (collectionKind && isCollectionKind(collectionKind)) {
          const query = data as {
            selectionMode?: string;
            selectedIds?: string[];
            filterId?: string;
            limit?: number;
          };
          const items = await this.collections.resolveForBlock(
            siteId,
            collectionKind,
            query,
            locale,
            defaultLocale,
          );
          data = { ...data, items };
        }

        const mediaId = typeof data.mediaId === "string" ? data.mediaId : "";
        if (mediaId) {
          const imageUrl = await this.media.resolveUrl(siteId, mediaId);
          data = { ...data, imageUrl };
        }

        return { ...section, data };
      }),
    );
  }
}
