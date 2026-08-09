import { Controller, Get, Logger, Query } from "@nestjs/common";
import type {
  DashboardContentKind,
  DashboardContentStats,
  DashboardRecentContent,
  DashboardResponse,
} from "@yunity/contracts";
import { resolveContentLocale } from "../../common/locales";
import { ActiveSiteId } from "../../common/site-context";
import type {
  CollectionItemDocument,
  CollectionKind,
} from "../collections/collection-item.schema";
import { CollectionsService } from "../collections/collections.service";
import { FormsService } from "../forms/forms.service";
import { SubmissionsService } from "../forms/submissions.service";
import { PagesService } from "../pages/pages.service";
import type { PageDocument } from "../pages/schemas/page.schema";

const COLLECTION_META: Record<
  CollectionKind,
  { kind: DashboardContentKind; href: string }
> = {
  service: { kind: "SERVICE", href: "/collections/service" },
  industry: { kind: "INDUSTRY", href: "/collections/industry" },
  testimonial: { kind: "TESTIMONIAL", href: "/collections/testimonial" },
  blog: { kind: "BLOG_ARTICLE", href: "/collections/blog" },
};

function sumCounts(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

function toContentStats(
  counts: Record<string, number>,
): DashboardContentStats {
  return {
    total: sumCounts(counts),
    published: counts.PUBLISHED ?? 0,
    pending:
      (counts.DRAFT ?? 0) +
      (counts.IN_REVIEW ?? 0) +
      (counts.APPROVED ?? 0) +
      (counts.SCHEDULED ?? 0),
  };
}

function translatedTitle(
  translations: Record<string, { title?: string }>,
  locale: string,
  fallback: string,
): string {
  return (
    translations[locale]?.title ??
    translations.de?.title ??
    Object.values(translations)[0]?.title ??
    fallback
  );
}

const logger = new Logger("DashboardController");

function pageToRecent(page: PageDocument, locale: string): DashboardRecentContent {
  return {
    id: page._id.toString(),
    kind: "PAGE",
    title: translatedTitle(page.translations, locale, page.internalName),
    status: page.status,
    href: `/pages/${page._id.toString()}`,
    updatedAt: page.updatedAt.toISOString(),
  };
}

/**
 * Ein Datensatz mit unbekannter Art (Altbestand aus einem frueheren Modell oder
 * eine erst spaeter registrierte Art) darf das Dashboard nicht zum Absturz
 * bringen — dieselbe Regel gilt im Renderer fuer unbekannte Blocktypen.
 * Der Eintrag wird uebersprungen und einmal geloggt.
 */
function collectionToRecent(
  item: CollectionItemDocument,
  locale: string,
): DashboardRecentContent | null {
  const meta = COLLECTION_META[item.kind];
  if (!meta) {
    logger.warn(
      `Eintrag ${item._id.toString()} hat die unbekannte Art "${item.kind}" und wird im Dashboard uebersprungen.`,
    );
    return null;
  }
  return {
    id: item._id.toString(),
    kind: meta.kind,
    title: translatedTitle(item.translations, locale, "(ohne Titel)"),
    status: item.status,
    href: `${meta.href}/${item._id.toString()}`,
    updatedAt: item.updatedAt.toISOString(),
  };
}

@Controller("v1/admin/dashboard")
export class DashboardController {
  constructor(
    private readonly pages: PagesService,
    private readonly collections: CollectionsService,
    private readonly forms: FormsService,
    private readonly submissions: SubmissionsService,
  ) {}

  /** Sitebezogene Inhaltskennzahlen fuer die Dashboard-Startseite. */
  @Get()
  async overview(
    @ActiveSiteId() siteId: string,
    @Query("locale") localeRaw?: string,
  ): Promise<DashboardResponse> {
    const locale = resolveContentLocale(localeRaw);
    const [
      pageCounts,
      serviceCounts,
      industryCounts,
      testimonialCounts,
      blogCounts,
      formCounts,
      newSubmissions,
      recentPages,
      recentCollections,
    ] = await Promise.all([
      this.pages.countByStatus(siteId),
      this.collections.countByStatus(siteId, "service"),
      this.collections.countByStatus(siteId, "industry"),
      this.collections.countByStatus(siteId, "testimonial"),
      this.collections.countByStatus(siteId, "blog"),
      this.forms.countByStatus(siteId),
      this.submissions.countNew(siteId),
      this.pages.findRecent(siteId),
      this.collections.findRecent(siteId),
    ]);

    const recentContent = [
      ...recentPages.map((page) => pageToRecent(page, locale)),
      ...recentCollections
        .map((item) => collectionToRecent(item, locale))
        .filter((entry): entry is DashboardRecentContent => entry !== null),
    ]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 8);

    return {
      stats: {
        pages: toContentStats(pageCounts),
        services: toContentStats(serviceCounts),
        industries: toContentStats(industryCounts),
        testimonials: toContentStats(testimonialCounts),
        blogArticles: toContentStats(blogCounts),
        forms: {
          total: sumCounts(formCounts),
          active: formCounts.ACTIVE ?? 0,
        },
        newSubmissions,
      },
      recentContent,
    };
  }
}
