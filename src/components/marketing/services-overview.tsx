import Link from "next/link"

import { SectionHeading } from "@/components/marketing/section-heading"
import { ServiceCard } from "@/components/marketing/service-card"
import { buttonVariants } from "@/components/ui/button-variants"
import { services, type ServiceItem } from "@/lib/content/services"
import { cn } from "@/lib/utils"

interface ServicesOverviewProps {
  /** Optionale CMS-Daten; ohne Werte greifen die bisherigen Inhalte. */
  items?: ServiceItem[]
  eyebrow?: string
  title?: string
  description?: string
  action?: { label: string; href: string }
}

const DEFAULT_SERVICES_HEADER = {
  eyebrow: "Leistungen",
  title: "Acht Bereiche – ein klarer Fokus: operative Stärke",
  description:
    "Von Event bis Logistik: Wir besetzen Rollen dort, wo es auf Zuverlässigkeit, Tempo und Auftreten ankommt.",
  action: { label: "Alle Leistungen ansehen", href: "/leistungen" },
} as const

export function ServicesOverview({
  items,
  eyebrow,
  title,
  description,
  action,
}: ServicesOverviewProps = {}) {
  const entries = items?.length ? items : services
  const cta = action?.href ? action : DEFAULT_SERVICES_HEADER.action
  return (
    <section className="relative border-y border-slate-200/60 bg-gradient-to-b from-slate-50/80 via-white to-background py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-100/30 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={eyebrow || DEFAULT_SERVICES_HEADER.eyebrow}
          title={title || DEFAULT_SERVICES_HEADER.title}
          description={description || DEFAULT_SERVICES_HEADER.description}
          className="max-w-4xl"
        />
        <div className="mx-auto mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {entries.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-full w-full",
                i === entries.length - 1 && "md:col-start-2"
              )}
            >
              <ServiceCard
                variant="soft"
                index={i}
                badge={s.badge}
                themeIndex={i}
                title={s.title}
                short={s.short}
                iconKey={s.iconKey}
                imageSrc={s.imageSrc}
                imageAlt={s.imageAlt}
                href={`/leistungen#${s.id}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <Link
            href={cta.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-slate-200 bg-white px-8 text-slate-900 shadow-sm hover:bg-slate-50"
            )}
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
