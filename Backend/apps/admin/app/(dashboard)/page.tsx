import { cookies } from "next/headers";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  FormInput,
  Inbox,
  Newspaper,
  Quote,
} from "lucide-react";
import type {
  AuthUser,
  CollectionListItem,
  DashboardContentStats,
  DashboardContentKind,
  DashboardRecentContent,
  DashboardResponse,
  FormListItem,
  PageListItem,
  SubmissionListItem,
} from "@yunity/contracts";
import { StatusBadge } from "@/components/page-editor/status-badge";
import { apiFetch } from "@/lib/api";
import {
  ADMIN_LOCALE_COOKIE,
  isAdminLocale,
} from "@/lib/admin-locales";
import { SITE_COOKIE } from "@/lib/site-cookie";
import { cn } from "@/lib/utils";

const LOCALE_TAGS = {
  de: "de-DE",
  en: "en-GB",
  tr: "tr-TR",
} as const;

interface DashboardCopy {
  title: string;
  description: string;
  loadError: string;
  pages: string;
  services: string;
  industries: string;
  testimonials: string;
  blogArticles: string;
  newSubmissions: string;
  noEntries: string;
  publishedSuffix: string;
  unread: string;
  recentTitle: string;
  recentDescription: string;
  noContent: string;
  publicationTitle: string;
  publicationDescription: string;
  totalContent: string;
  publishedContent: string;
  pendingContent: string;
  activeForms: string;
  of: string;
  kinds: Record<DashboardContentKind, string>;
}

const DASHBOARD_COPY: Record<keyof typeof LOCALE_TAGS, DashboardCopy> = {
  de: {
    title: "Dashboard",
    description: "Alle Website-Inhalte und Anfragen auf einen Blick.",
    loadError:
      "Die Dashboard-Daten konnten nicht geladen werden. Bitte laden Sie die Seite erneut.",
    pages: "Seiten",
    services: "Leistungen",
    industries: "Branchen",
    testimonials: "Stimmen",
    blogArticles: "Blogartikel",
    newSubmissions: "Neue Anfragen",
    noEntries: "Noch keine Einträge",
    publishedSuffix: "veröffentlicht",
    unread: "Noch nicht gelesen",
    recentTitle: "Zuletzt bearbeitet",
    recentDescription: "Die neuesten Änderungen an Seiten und Inhalten.",
    noContent: "Noch keine Inhalte vorhanden.",
    publicationTitle: "Veröffentlichungsstatus",
    publicationDescription: "Aktive Website-Inhalte",
    totalContent: "Inhalte gesamt",
    publishedContent: "Veröffentlicht",
    pendingContent: "In Bearbeitung",
    activeForms: "Aktive Formulare",
    of: "von",
    kinds: {
      PAGE: "Seite",
      SERVICE: "Leistung",
      INDUSTRY: "Branche",
      TESTIMONIAL: "Stimme",
      BLOG_ARTICLE: "Blogartikel",
    },
  },
  en: {
    title: "Dashboard",
    description: "All website content and enquiries at a glance.",
    loadError: "Dashboard data could not be loaded. Please reload the page.",
    pages: "Pages",
    services: "Services",
    industries: "Industries",
    testimonials: "Testimonials",
    blogArticles: "Blog articles",
    newSubmissions: "New submissions",
    noEntries: "No entries yet",
    publishedSuffix: "published",
    unread: "Not read yet",
    recentTitle: "Recently edited",
    recentDescription: "The latest changes to pages and content.",
    noContent: "No content available yet.",
    publicationTitle: "Publication status",
    publicationDescription: "Active website content",
    totalContent: "Content total",
    publishedContent: "Published",
    pendingContent: "In progress",
    activeForms: "Active forms",
    of: "of",
    kinds: {
      PAGE: "Page",
      SERVICE: "Service",
      INDUSTRY: "Industry",
      TESTIMONIAL: "Testimonial",
      BLOG_ARTICLE: "Blog article",
    },
  },
  tr: {
    title: "Kontrol paneli",
    description: "Tüm web sitesi içerikleri ve başvurular tek bakışta.",
    loadError: "Kontrol paneli verileri yüklenemedi. Lütfen sayfayı yenileyin.",
    pages: "Sayfalar",
    services: "Hizmetler",
    industries: "Sektörler",
    testimonials: "Referanslar",
    blogArticles: "Blog yazıları",
    newSubmissions: "Yeni başvurular",
    noEntries: "Henüz kayıt yok",
    publishedSuffix: "yayında",
    unread: "Henüz okunmadı",
    recentTitle: "Son düzenlenenler",
    recentDescription: "Sayfa ve içeriklerdeki en son değişiklikler.",
    noContent: "Henüz içerik bulunmuyor.",
    publicationTitle: "Yayın durumu",
    publicationDescription: "Aktif web sitesi içerikleri",
    totalContent: "Toplam içerik",
    publishedContent: "Yayında",
    pendingContent: "İşlemde",
    activeForms: "Aktif formlar",
    of: "/",
    kinds: {
      PAGE: "Sayfa",
      SERVICE: "Hizmet",
      INDUSTRY: "Sektör",
      TESTIMONIAL: "Referans",
      BLOG_ARTICLE: "Blog yazısı",
    },
  },
};

function isContentDashboard(value: unknown): value is DashboardResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Partial<DashboardResponse>;
  return Boolean(
    candidate.stats &&
      typeof candidate.stats.pages === "object" &&
      typeof candidate.stats.blogArticles === "object" &&
      Array.isArray(candidate.recentContent),
  );
}

interface PagedResponse<T> {
  data: T[];
  meta: {
    total: number;
  };
}

function contentStats<T extends { status: string }>(
  response: PagedResponse<T>,
): DashboardContentStats {
  const published = response.data.filter(
    (entry) => entry.status === "PUBLISHED",
  ).length;
  return {
    total: response.meta.total,
    published,
    pending: Math.max(0, response.meta.total - published),
  };
}

async function loadLegacyDashboard(
  locale: keyof typeof LOCALE_TAGS,
  siteId?: string,
): Promise<DashboardResponse | null> {
  const collectionPath = (kind: string) =>
    `/api/v1/admin/collections/${kind}?locale=${locale}&limit=100`;
  const [
    pages,
    services,
    industries,
    testimonials,
    blogArticles,
    forms,
    newSubmissions,
  ] = await Promise.all([
    apiFetch<PagedResponse<PageListItem>>(
      `/api/v1/admin/pages?locale=${locale}&limit=100`,
      { siteId },
    ),
    apiFetch<PagedResponse<CollectionListItem>>(collectionPath("service"), {
      siteId,
    }),
    apiFetch<PagedResponse<CollectionListItem>>(collectionPath("industry"), {
      siteId,
    }),
    apiFetch<PagedResponse<CollectionListItem>>(
      collectionPath("testimonial"),
      { siteId },
    ),
    apiFetch<PagedResponse<CollectionListItem>>(collectionPath("blog"), {
      siteId,
    }),
    apiFetch<FormListItem[]>("/api/v1/admin/forms", { siteId }),
    apiFetch<PagedResponse<SubmissionListItem>>(
      "/api/v1/admin/submissions?status=NEW&limit=1",
      { siteId },
    ),
  ]);

  if (
    !pages ||
    !services ||
    !industries ||
    !testimonials ||
    !blogArticles
  ) {
    return null;
  }

  const pageEntries: DashboardRecentContent[] = pages.data.map((page) => ({
    id: page.id,
    kind: "PAGE",
    title: page.title,
    status: page.status,
    href: `/pages/${page.id}`,
    updatedAt: page.updatedAt,
  }));
  const collectionEntries = (
    [
      [services, "SERVICE", "service"],
      [industries, "INDUSTRY", "industry"],
      [testimonials, "TESTIMONIAL", "testimonial"],
      [blogArticles, "BLOG_ARTICLE", "blog"],
    ] as const
  ).flatMap(([response, kind, path]) =>
    response.data.map((entry): DashboardRecentContent => ({
      id: entry.id,
      kind,
      title: entry.title,
      status: entry.status,
      href: `/collections/${path}/${entry.id}`,
      updatedAt: entry.updatedAt,
    })),
  );

  return {
    stats: {
      pages: contentStats(pages),
      services: contentStats(services),
      industries: contentStats(industries),
      testimonials: contentStats(testimonials),
      blogArticles: contentStats(blogArticles),
      forms: {
        total: forms?.length ?? 0,
        active: forms?.filter((form) => form.status === "ACTIVE").length ?? 0,
      },
      newSubmissions: newSubmissions?.meta.total ?? 0,
    },
    recentContent: [...pageEntries, ...collectionEntries]
      .sort(
        (left, right) =>
          new Date(right.updatedAt).getTime() -
          new Date(left.updatedAt).getTime(),
      )
      .slice(0, 8),
  };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(ADMIN_LOCALE_COOKIE)?.value;
  const locale = isAdminLocale(storedLocale) ? storedLocale : "de";
  const localeTag = LOCALE_TAGS[locale];
  const copy = DASHBOARD_COPY[locale];
  const siteId =
    cookieStore.get(SITE_COOKIE)?.value ??
    (await apiFetch<AuthUser>("/api/v1/auth/me"))?.sites[0]?.id;
  const dashboardResponse = await apiFetch<unknown>(
    `/api/v1/admin/dashboard?locale=${locale}`,
    { siteId },
  );
  const dashboard = isContentDashboard(dashboardResponse)
    ? dashboardResponse
    : await loadLegacyDashboard(locale, siteId);
  const date = new Intl.DateTimeFormat(localeTag, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date());

  if (!dashboard) {
    return (
      <div className="space-y-8 p-6 lg:p-10">
        <DashboardHeader copy={copy} date={date} />
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-300">
          {copy.loadError}
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: copy.pages,
      stats: dashboard.stats.pages,
      icon: FileText,
      href: "/pages",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: copy.services,
      stats: dashboard.stats.services,
      icon: Briefcase,
      href: "/collections/service",
      color: "text-amber-700 dark:text-amber-300",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: copy.industries,
      stats: dashboard.stats.industries,
      icon: Building2,
      href: "/collections/industry",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: copy.testimonials,
      stats: dashboard.stats.testimonials,
      icon: Quote,
      href: "/collections/testimonial",
      color: "text-violet-600 dark:text-violet-300",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      title: copy.blogArticles,
      stats: dashboard.stats.blogArticles,
      icon: Newspaper,
      href: "/collections/blog",
      color: "text-indigo-600 dark:text-indigo-300",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
    },
  ];
  const contentStats = modules.map((module) => module.stats);
  const totalContent = contentStats.reduce(
    (sum, stats) => sum + stats.total,
    0,
  );
  const publishedContent = contentStats.reduce(
    (sum, stats) => sum + stats.published,
    0,
  );
  const pendingContent = contentStats.reduce(
    (sum, stats) => sum + stats.pending,
    0,
  );
  const publicationRate =
    totalContent === 0
      ? 0
      : Math.round((publishedContent / totalContent) * 100);

  return (
    <div className="space-y-8 p-6 lg:space-y-10 lg:p-10">
      <DashboardHeader copy={copy} date={date} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:gap-6">
        {modules.map((module) => (
          <Link
            key={module.title}
            className="group rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 lg:p-6"
            href={module.href}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                  module.bg,
                )}
              >
                <module.icon className={cn("h-5 w-5", module.color)} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-brand dark:group-hover:text-accent" />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-widest text-zinc-400">
              {module.title}
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-3xl font-black text-zinc-900 dark:text-white">
                {module.stats.total}
              </p>
              <p className="pb-1 text-xs text-zinc-500">
                {module.stats.total === 0
                  ? copy.noEntries
                  : `${module.stats.published} ${copy.publishedSuffix}`}
              </p>
            </div>
          </Link>
        ))}

        <Link
          className="group rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 lg:p-6"
          href="/forms/submissions"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
              <Inbox className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-brand dark:group-hover:text-accent" />
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-widest text-zinc-400">
            {copy.newSubmissions}
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-3xl font-black text-zinc-900 dark:text-white">
              {dashboard.stats.newSubmissions}
            </p>
            <p className="pb-1 text-xs text-zinc-500">{copy.unread}</p>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <section className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                {copy.recentTitle}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {copy.recentDescription}
              </p>
            </div>
            <Clock3 className="h-5 w-5 text-zinc-300" />
          </div>

          {dashboard.recentContent.length > 0 ? (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {dashboard.recentContent.map((entry) => (
                <li key={`${entry.kind}-${entry.id}`}>
                  <Link
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    href={entry.href}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {copy.kinds[entry.kind]}
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-zinc-900 dark:text-white">
                        {entry.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={entry.status} />
                      <time className="hidden text-xs text-zinc-400 sm:block">
                        {new Intl.DateTimeFormat(localeTag, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          timeZone: "Europe/Berlin",
                        }).format(new Date(entry.updatedAt))}
                      </time>
                      <ArrowUpRight className="h-4 w-4 text-zinc-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-sm text-zinc-500">
              {copy.noContent}
            </p>
          )}
        </section>

        <section className="h-fit rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-black text-zinc-900 dark:text-white">
                {copy.publicationTitle}
              </h2>
              <p className="text-xs text-zinc-500">
                {copy.publicationDescription}
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-end justify-between">
            <p className="text-4xl font-black text-zinc-900 dark:text-white">
              {publicationRate}%
            </p>
            <p className="pb-1 text-xs text-zinc-500">
              {publishedContent} {copy.of} {totalContent}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width]"
              style={{ width: `${publicationRate}%` }}
            />
          </div>

          <dl className="mt-7 divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
            <div className="flex items-center justify-between py-3">
              <dt className="text-zinc-500">{copy.totalContent}</dt>
              <dd className="font-bold text-zinc-900 dark:text-white">
                {totalContent}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-zinc-500">{copy.publishedContent}</dt>
              <dd className="font-bold text-emerald-600">{publishedContent}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-zinc-500">{copy.pendingContent}</dt>
              <dd className="font-bold text-amber-600">{pendingContent}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="flex items-center gap-2 text-zinc-500">
                <FormInput className="h-4 w-4" /> {copy.activeForms}
              </dt>
              <dd className="font-bold text-zinc-900 dark:text-white">
                {dashboard.stats.forms.active} / {dashboard.stats.forms.total}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function DashboardHeader({
  copy,
  date,
}: {
  copy: DashboardCopy;
  date: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
      <div>
        <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white lg:text-4xl">
          {copy.title}
        </h1>
        <p className="font-medium text-zinc-500">
          {copy.description}
        </p>
      </div>
      <div className="w-fit rounded-lg border border-zinc-100 bg-white px-4 py-2 text-xs font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {date}
      </div>
    </div>
  );
}
