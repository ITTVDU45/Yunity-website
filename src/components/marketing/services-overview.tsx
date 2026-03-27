import Link from "next/link"

import { SectionHeading } from "@/components/marketing/section-heading"
import { ServiceCard } from "@/components/marketing/service-card"
import { buttonVariants } from "@/components/ui/button-variants"
import { services } from "@/lib/content/services"
import { cn } from "@/lib/utils"

export function ServicesOverview() {
  return (
    <section className="relative border-y border-slate-200/60 bg-gradient-to-b from-slate-50/80 via-white to-background py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-100/30 to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Leistungen"
          title="Sieben Bereiche – ein klarer Fokus: operative Stärke"
          description="Von Event bis Logistik: Wir besetzen Rollen dort, wo es auf Zuverlässigkeit, Tempo und Auftreten ankommt."
          className="max-w-4xl"
        />
        <div className="mx-auto mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {services.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-full w-full",
                i === services.length - 1 && "md:col-start-2"
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
            href="/leistungen"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-slate-200 bg-white px-8 text-slate-900 shadow-sm hover:bg-slate-50"
            )}
          >
            Alle Leistungen ansehen
          </Link>
        </div>
      </div>
    </section>
  )
}
