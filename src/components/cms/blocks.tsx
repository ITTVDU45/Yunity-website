import Image from "next/image"
import Link from "next/link"
import { createElement } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Gauge,
  Handshake,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { ApplicantCta } from "@/components/marketing/applicant-cta"
import { CtaSection } from "@/components/marketing/cta-section"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { HeroSection } from "@/components/marketing/hero-section"
import { IndustriesTeaser } from "@/components/marketing/industries-teaser"
import { IndustryCard } from "@/components/marketing/industry-card"
import { PageHero } from "@/components/marketing/page-hero"
import { ProcessSteps } from "@/components/marketing/process-steps"
import { SectionHeading } from "@/components/marketing/section-heading"
import { ServiceCard } from "@/components/marketing/service-card"
import { ServicesOverview } from "@/components/marketing/services-overview"
import { StatsSection } from "@/components/marketing/stats-section"
import { TestimonialSlider } from "@/components/marketing/testimonial-slider"
import TechnologyStackContent from "@/components/marketing/technology-stack-content"
import { FadeIn } from "@/components/motion/fade-in"
import { buttonVariants } from "@/components/ui/button-variants"
import type { CollectionCard } from "@/lib/cms/types"
import {
  industryIconMap,
  type IndustryIconKey,
} from "@/lib/content/industry-icons"
import type { IndustryItem } from "@/lib/content/industries"
import {
  serviceIconMap,
  type ServiceIconKey,
} from "@/lib/content/service-icons"
import type { ServiceItem } from "@/lib/content/services"
import type { StatItem } from "@/lib/content/stats"
import type { Testimonial } from "@/lib/content/testimonials"
import { cn } from "@/lib/utils"

type BlockData = Record<string, unknown>

interface ActionValue {
  label: string
  href: string
}

/* -------------------------------------------------------------- Hilfsgroessen */

function str(data: BlockData, key: string): string {
  const value = data[key]
  return typeof value === "string" ? value : ""
}

function action(data: BlockData, key: string): ActionValue | undefined {
  const value = data[key]
  if (value && typeof value === "object") {
    const candidate = value as Partial<ActionValue>
    if (typeof candidate.href === "string" && candidate.href) {
      return { label: candidate.label ?? "", href: candidate.href }
    }
  }
  return undefined
}

function list(data: BlockData, key: string): Record<string, unknown>[] {
  return Array.isArray(data[key])
    ? (data[key] as unknown[]).filter(
        (entry): entry is Record<string, unknown> =>
          typeof entry === "object" && entry !== null,
      )
    : []
}

function text(entry: Record<string, unknown>, key: string): string {
  const value = entry[key]
  return typeof value === "string" ? value : ""
}

function strings(data: BlockData, key: string): string[] {
  return Array.isArray(data[key])
    ? (data[key] as unknown[]).filter(
        (entry): entry is string => typeof entry === "string",
      )
    : []
}

/**
 * Der Icon-Schluessel ist im Backend ein freier String. Alle Maps hier sind
 * geschlossen — ein unbekannter Wert liefert das Ersatz-Icon, statt beim
 * Rendern zu werfen.
 */
function pickIcon<T extends Record<string, LucideIcon>>(
  map: T,
  key: string,
  fallback: LucideIcon,
): LucideIcon {
  return map[key as keyof T] ?? fallback
}

const CARD_ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  sparkles: Sparkles,
  gauge: Gauge,
  handshake: Handshake,
  clock: Clock3,
  wallet: Wallet,
  heart: Heart,
  alert: AlertTriangle,
  trending: TrendingUp,
  check: CheckCircle2,
}

const CONTACT_ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  clock: Clock3,
  pin: MapPin,
}

/** Wiederkehrende Pastelltoene der bestehenden Karten-Raster. */
const CARD_THEMES = ["bg-sky-50", "bg-violet-50", "bg-emerald-50", "bg-orange-50"]

/**
 * Rich-Text wird im Backend serverseitig gegen eine Allowlist bereinigt
 * (kein <script>, sichere rel-Attribute). Deshalb ist dangerouslySetInnerHTML
 * hier an einer vertrauenswuerdigen, sanitisierten Quelle vertretbar.
 */
function RichHtml({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Kopfzeile eines Blocks — nur rendern, wenn wenigstens ein Wert gesetzt ist. */
function BlockHeading({
  data,
  className,
  align,
}: {
  data: BlockData
  className?: string
  align?: "left" | "center"
}) {
  const eyebrow = str(data, "eyebrow")
  const title = str(data, "title")
  const description = str(data, "description")
  if (!eyebrow && !title && !description) {
    return null
  }
  return (
    <SectionHeading
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      align={align}
      className={className}
    />
  )
}

/* ------------------------------------------------ Umwandlung Karte → Frontend */

/** CMS-Karte → `ServiceItem`, mit dem die bestehenden Karten arbeiten. */
export function cardToService(card: CollectionCard, index: number): ServiceItem {
  const attrs = card.attributes ?? {}
  const iconKey = typeof attrs.iconKey === "string" ? attrs.iconKey : ""
  return {
    id:
      (typeof attrs.anchorId === "string" && attrs.anchorId) || card.slug || card.id,
    badge: typeof attrs.badge === "string" ? attrs.badge : card.subtitle ?? "",
    imageSrc: card.imageUrl ?? "",
    imageAlt: typeof attrs.imageAlt === "string" ? attrs.imageAlt : card.title,
    title: card.title,
    short: card.excerpt ?? "",
    description: typeof attrs.body === "string" ? attrs.body : card.excerpt ?? "",
    benefitEmployer:
      typeof attrs.benefitEmployer === "string" ? attrs.benefitEmployer : "",
    benefitWorker:
      typeof attrs.benefitWorker === "string" ? attrs.benefitWorker : "",
    iconKey: (iconKey in serviceIconMap
      ? iconKey
      : (Object.keys(serviceIconMap)[
          index % Object.keys(serviceIconMap).length
        ] as ServiceIconKey)) as ServiceIconKey,
  }
}

/** CMS-Karte → `IndustryItem`. */
export function cardToIndustry(
  card: CollectionCard,
  index: number,
): IndustryItem {
  const attrs = card.attributes ?? {}
  const iconKey = typeof attrs.iconKey === "string" ? attrs.iconKey : ""
  return {
    id: card.slug || card.id,
    title: card.title,
    description: card.excerpt ?? "",
    support: typeof attrs.support === "string" ? attrs.support : "",
    iconKey: (iconKey in industryIconMap
      ? iconKey
      : (Object.keys(industryIconMap)[
          index % Object.keys(industryIconMap).length
        ] as IndustryIconKey)) as IndustryIconKey,
    imageSrc: card.imageUrl ?? "",
    imageAlt: typeof attrs.imageAlt === "string" ? attrs.imageAlt : card.title,
  }
}

/** CMS-Karte → `Testimonial`. */
export function cardToTestimonial(card: CollectionCard): Testimonial {
  const attrs = card.attributes ?? {}
  return {
    id: card.id,
    quote: card.excerpt ?? "",
    name: card.title,
    role: card.subtitle ?? "",
    company: typeof attrs.company === "string" ? attrs.company : "",
    imageSrc: card.imageUrl ?? "",
    imageAlt: typeof attrs.imageAlt === "string" ? attrs.imageAlt : card.title,
  }
}

/* ------------------------------------------------------------------- Bloecke */

export function HeroBlock({ data }: { data: BlockData }) {
  return (
    <HeroSection
      badge={str(data, "badge") || undefined}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
      primaryAction={action(data, "primaryAction")}
      secondaryAction={action(data, "secondaryAction")}
      footnote={str(data, "footnote") || undefined}
      imageUrl={str(data, "imageUrl") || undefined}
      imageAlt={str(data, "imageAlt") || undefined}
    />
  )
}

export function PageHeroBlock({ data }: { data: BlockData }) {
  const highlights = strings(data, "highlights")
  return (
    <PageHero
      eyebrow={str(data, "eyebrow") || undefined}
      title={str(data, "title")}
      description={str(data, "description") || undefined}
      imageSrc={str(data, "imageUrl") || undefined}
      imageAlt={str(data, "imageAlt") || undefined}
      primaryAction={action(data, "primaryAction")}
      secondaryAction={action(data, "secondaryAction")}
      highlights={highlights.length ? highlights : undefined}
    />
  )
}

export function LogoLoopBlock({ data }: { data: BlockData }) {
  const items = list(data, "items").map((entry) => ({
    icon: text(entry, "icon"),
    label: text(entry, "label"),
  }))
  return (
    <section className="border-y border-border/50 bg-muted/20 py-14 md:py-20">
      <TechnologyStackContent
        items={items.length ? items : undefined}
        eyebrow={str(data, "eyebrow") || undefined}
        title={str(data, "title") || undefined}
        description={str(data, "description") || undefined}
      />
    </section>
  )
}

export function RichTextBlock({ data }: { data: BlockData }) {
  const body = str(data, "body")
  if (!body) {
    return null
  }
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <BlockHeading data={data} align="left" className="mx-0" />
        <RichHtml
          html={body}
          className="mt-8 space-y-4 text-base leading-7 text-primary/70 [&_a]:text-accent-foreground [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-primary [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-primary"
        />
      </div>
    </section>
  )
}

export function TextImageBlock({ data }: { data: BlockData }) {
  const imageUrl = str(data, "imageUrl")
  const imageRight = str(data, "imageSide") === "right"
  const cta = action(data, "action")
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid overflow-hidden rounded-[2.5rem] bg-[oklch(0.985_0.012_95)] lg:grid-cols-2">
        {imageUrl ? (
          <div
            className={cn("relative min-h-[340px]", imageRight && "lg:order-2")}
          >
            <Image
              src={imageUrl}
              alt={str(data, "imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
          {str(data, "eyebrow") ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {str(data, "eyebrow")}
            </p>
          ) : null}
          {str(data, "title") ? (
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary">
              {str(data, "title")}
            </h2>
          ) : null}
          {str(data, "description") ? (
            <p className="mt-5 leading-7 text-primary/65">
              {str(data, "description")}
            </p>
          ) : null}
          {str(data, "body") ? (
            <RichHtml
              html={str(data, "body")}
              className="mt-5 space-y-4 leading-7 text-primary/65"
            />
          ) : null}
          {cta ? (
            <Link
              href={cta.href}
              className={cn(
                buttonVariants({ size: "sm" }),
                "mt-8 w-fit rounded-full",
              )}
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function IconCardGridBlock({ data }: { data: BlockData }) {
  const items = list(data, "items")
  if (!items.length) {
    return null
  }
  const columns = typeof data.columns === "number" ? data.columns : undefined
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <BlockHeading data={data} />
      <div
        className={cn(
          "mt-12 grid gap-5",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "md:grid-cols-3",
          columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
          !columns &&
            (items.length % 4 === 0
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "md:grid-cols-3"),
        )}
      >
        {items.map((item, index) => {
          const Icon = pickIcon(CARD_ICONS, text(item, "icon"), CheckCircle2)
          return (
            <FadeIn key={`${text(item, "title")}-${index}`} delay={index * 0.05}>
              <div
                className={cn(
                  "h-full rounded-[2rem] p-7",
                  CARD_THEMES[index % CARD_THEMES.length],
                )}
              >
                <Icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-8 text-xl font-semibold text-primary">
                  {text(item, "title")}
                </h3>
                <p className="mt-3 text-sm leading-6 text-primary/65">
                  {text(item, "text")}
                </p>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}

export function NumberedStepsBlock({ data }: { data: BlockData }) {
  const items = list(data, "items")
  if (!items.length) {
    return null
  }
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <BlockHeading data={data} />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={`${text(item, "title")}-${index}`}
            className="rounded-[2rem] bg-[oklch(0.985_0.012_95)] p-7 ring-1 ring-primary/[0.06]"
          >
            <span className="text-4xl font-semibold tracking-tight text-accent">
              {text(item, "number") || String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-8 text-xl font-semibold text-primary">
              {text(item, "title")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-primary/65">
              {text(item, "text")}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProcessStepsBlock({ data }: { data: BlockData }) {
  const items = list(data, "items").map((item, index) => ({
    step: text(item, "step") || String(index + 1).padStart(2, "0"),
    title: text(item, "title"),
    text: text(item, "text"),
  }))
  return (
    <ProcessSteps
      items={items.length ? items : undefined}
      eyebrow={str(data, "eyebrow") || undefined}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
      action={action(data, "action")}
    />
  )
}

export function ChecklistPanelBlock({ data }: { data: BlockData }) {
  const items = strings(data, "items")
  const imageUrl = str(data, "imageUrl")
  const dark = str(data, "tone") === "dark" || !imageUrl

  if (dark) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="rounded-[2.5rem] bg-primary p-8 text-white sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              {str(data, "eyebrow") ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {str(data, "eyebrow")}
                </p>
              ) : null}
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                {str(data, "title")}
              </h2>
              {str(data, "description") ? (
                <p className="mt-4 text-sm leading-6 text-white/70">
                  {str(data, "description")}
                </p>
              ) : null}
            </div>
            <div className="grid gap-3">
              {items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/75"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-accent" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
      <div className="overflow-hidden rounded-[2.5rem] bg-primary text-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[340px]">
            <Image
              src={imageUrl}
              alt={str(data, "imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-10 lg:p-14">
            {str(data, "eyebrow") ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {str(data, "eyebrow")}
              </p>
            ) : null}
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {str(data, "title")}
            </h2>
            <div className="mt-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 border-b border-white/10 pb-4 text-sm leading-6 text-white/75"
                >
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function StatisticsBlock({ data }: { data: BlockData }) {
  const items: StatItem[] = list(data, "items").map((item, index) => ({
    id: `${text(item, "label") || "stat"}-${index}`,
    value: typeof item.value === "number" ? item.value : 0,
    prefix: text(item, "prefix") || undefined,
    suffix: text(item, "suffix") || undefined,
    label: text(item, "label"),
  }))
  if (!items.length) {
    return null
  }
  return (
    <StatsSection
      items={items}
      eyebrow={str(data, "eyebrow") || undefined}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
    />
  )
}

export function AccordionBlock({ data }: { data: BlockData }) {
  const items = list(data, "items").map((item, index) => ({
    id: `faq-${index}`,
    question: text(item, "question"),
    answer: text(item, "answer"),
  }))
  if (!items.length) {
    return null
  }
  return (
    <section className="border-t border-border/60 bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <BlockHeading data={data} />
        <div className="mt-10">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  )
}

export function JobExamplesBlock({ data }: { data: BlockData }) {
  const items = list(data, "items")
  if (!items.length) {
    return null
  }
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeading
            eyebrow={str(data, "eyebrow") || undefined}
            title={str(data, "title")}
            description={str(data, "description") || undefined}
            className="[&_h2]:text-white [&_p]:text-white/60"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={`${text(item, "title")}-${index}`}
                className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10"
              >
                {text(item, "tag") ? (
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                    {text(item, "tag")}
                  </span>
                ) : null}
                <p className="mt-6 font-semibold">{text(item, "title")}</p>
                {text(item, "location") ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                    <MapPin className="size-4" aria-hidden />
                    {text(item, "location")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TeamCardsBlock({ data }: { data: BlockData }) {
  const items = list(data, "items")
  if (!items.length) {
    return null
  }
  return (
    <section className="pb-16 md:pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <BlockHeading data={data} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((item, index) => {
            const imageUrl = text(item, "imageUrl")
            return (
              <div
                key={`${text(item, "name")}-${index}`}
                className="overflow-hidden rounded-[2rem] bg-[oklch(0.985_0.012_95)]"
              >
                <div
                  className={cn(
                    "relative flex aspect-[4/3] items-center justify-center",
                    index === 0 ? "bg-sky-100" : "bg-violet-100",
                  )}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={text(item, "imageAlt") || text(item, "name")}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-primary/60">
                      Foto folgt
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="font-semibold text-primary">{text(item, "name")}</p>
                  <p className="mt-1 text-sm text-primary/55">{text(item, "role")}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ContactCardsBlock({ data }: { data: BlockData }) {
  const items = list(data, "items")
  if (!items.length) {
    return null
  }
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <BlockHeading data={data} />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = pickIcon(CONTACT_ICONS, text(item, "icon"), Phone)
          const href = text(item, "href")
          const content = (
            <>
              <Icon className="size-7 text-primary" aria-hidden />
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-primary/45">
                {text(item, "label")}
              </p>
              <p className="mt-2 font-semibold text-primary">{text(item, "value")}</p>
            </>
          )
          const theme = CARD_THEMES[index % CARD_THEMES.length]
          return href ? (
            <a
              key={`${text(item, "label")}-${index}`}
              href={href}
              className={cn("rounded-[2rem] p-7 transition hover:-translate-y-1", theme)}
            >
              {content}
            </a>
          ) : (
            <div
              key={`${text(item, "label")}-${index}`}
              className={cn("rounded-[2rem] p-7", theme)}
            >
              {content}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function QuoteBlock({ data }: { data: BlockData }) {
  if (!str(data, "text")) {
    return null
  }
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <figure className="rounded-[2rem] bg-[oklch(0.985_0.012_95)] p-8 sm:p-10">
        <blockquote className="text-xl leading-8 text-primary">
          „{str(data, "text")}“
        </blockquote>
        {str(data, "author") ? (
          <figcaption className="mt-6 text-sm text-primary/60">
            {str(data, "author")}
            {str(data, "role") ? ` · ${str(data, "role")}` : ""}
          </figcaption>
        ) : null}
      </figure>
    </section>
  )
}

export function CtaBlock({ data }: { data: BlockData }) {
  return (
    <CtaSection
      variant={str(data, "variant") === "muted" ? "muted" : "default"}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
      primaryAction={action(data, "primaryAction")}
      secondaryAction={action(data, "secondaryAction")}
    />
  )
}

export function ApplicantCtaBlock({ data }: { data: BlockData }) {
  return (
    <ApplicantCta
      badge={str(data, "badge") || undefined}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
      action={action(data, "action")}
      imageUrl={str(data, "imageUrl") || undefined}
      imageAlt={str(data, "imageAlt") || undefined}
    />
  )
}

/* --------------------------------------------------------- Collection-Bloecke */

export function ServiceGridBlock({
  data,
  cards,
}: {
  data: BlockData
  cards: CollectionCard[]
}) {
  if (!cards.length) {
    return null
  }
  const items = cards.map(cardToService)
  const layout = str(data, "layout") || "cards"

  // Kurzlink-Panel wie auf /fuer-bewerber: Kopfzeile, Verweis, Chips.
  if (layout === "chips") {
    const cta = action(data, "action")
    return (
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
        <div className="rounded-[2.5rem] bg-sky-50 p-7 md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              {str(data, "eyebrow") ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {str(data, "eyebrow")}
                </p>
              ) : null}
              {str(data, "title") ? (
                <h2 className="mt-3 text-2xl font-semibold text-primary">
                  {str(data, "title")}
                </h2>
              ) : null}
            </div>
            {cta ? (
              <Link
                href={cta.href}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                {cta.label}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {items.map((service) => (
              <Link
                key={service.id}
                href={`/leistungen#${service.id}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:-translate-y-0.5"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (layout === "detail") {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <BlockHeading data={data} />
        <div className="mt-14 space-y-8">
          {items.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.03}>
              <article
                id={service.id}
                className={cn(
                  "scroll-mt-28 overflow-hidden rounded-[2rem] md:rounded-[2.5rem]",
                  CARD_THEMES[index % CARD_THEMES.length],
                )}
              >
                <div className="grid lg:grid-cols-2 lg:items-stretch">
                  <div
                    className={cn(
                      "relative min-h-[280px] overflow-hidden lg:min-h-[470px]",
                      index % 2 === 1 && "lg:order-2",
                    )}
                  >
                    {service.imageSrc ? (
                      <Image
                        src={service.imageSrc}
                        alt={service.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition duration-700 hover:scale-[1.03]"
                      />
                    ) : null}
                    {service.badge ? (
                      <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                        {service.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                    <div className="flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
                        {createElement(serviceIconMap[service.iconKey], {
                          className: "size-6",
                          "aria-hidden": true,
                        })}
                      </span>
                      <span className="text-sm font-semibold tracking-[0.18em] text-primary/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-7 text-3xl font-semibold tracking-tight text-primary">
                      {service.title}
                    </h2>
                    <p className="mt-4 leading-7 text-primary/70">
                      {service.description}
                    </p>
                    <div className="mt-8 grid gap-3">
                      {(
                        [
                          ["Für Unternehmen", service.benefitEmployer],
                          ["Für Bewerber:innen", service.benefitWorker],
                        ] as const
                      )
                        .filter(([, value]) => Boolean(value))
                        .map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl bg-white/70 p-4 ring-1 ring-primary/[0.06]"
                          >
                            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                              <CheckCircle2
                                className="size-4 text-accent"
                                aria-hidden
                              />
                              {label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-primary/65">
                              {value}
                            </p>
                          </div>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/kontakt"
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "group rounded-full",
                        )}
                      >
                        Personal anfragen
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </Link>
                      <Link
                        href="/fuer-bewerber"
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "rounded-full border-primary/15 bg-white/60",
                        )}
                      >
                        Jetzt bewerben
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    )
  }

  return (
    <ServicesOverview
      items={items}
      eyebrow={str(data, "eyebrow") || undefined}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
      action={action(data, "action")}
    />
  )
}

export function IndustryGridBlock({
  data,
  cards,
}: {
  data: BlockData
  cards: CollectionCard[]
}) {
  if (!cards.length) {
    return null
  }
  const items = cards.map(cardToIndustry)

  if (str(data, "layout") === "grid") {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <BlockHeading data={data} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((industry, index) => (
            <FadeIn key={industry.id} delay={index * 0.03}>
              <IndustryCard item={industry} />
            </FadeIn>
          ))}
        </div>
      </section>
    )
  }

  return (
    <IndustriesTeaser
      items={items}
      eyebrow={str(data, "eyebrow") || undefined}
      title={str(data, "title") || undefined}
      description={str(data, "description") || undefined}
      action={action(data, "action")}
    />
  )
}

export function TestimonialSliderBlock({
  data,
  cards,
}: {
  data: BlockData
  cards: CollectionCard[]
}) {
  if (!cards.length) {
    return null
  }
  return (
    <section className="py-20 md:py-28">
      <BlockHeading data={data} />
      <div className="mt-12">
        <TestimonialSlider items={cards.map(cardToTestimonial)} />
      </div>
    </section>
  )
}

export function BlogGridBlock({
  data,
  cards,
}: {
  data: BlockData
  cards: CollectionCard[]
}) {
  if (!cards.length) {
    return null
  }
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <BlockHeading data={data} />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/blog/${card.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition hover:-translate-y-1"
          >
            {card.imageUrl ? (
              <div className="relative h-44 w-full">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-primary">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-primary/65">
                {card.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Weiterlesen
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export { ServiceCard }
