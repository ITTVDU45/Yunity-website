import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createElement } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { CtaSection } from "@/components/marketing/cta-section"
import { PageHero } from "@/components/marketing/page-hero"
import { SectionHeading } from "@/components/marketing/section-heading"
import { FadeIn } from "@/components/motion/fade-in"
import { JsonLd } from "@/components/seo/json-ld"
import { buttonVariants } from "@/components/ui/button-variants"
import { serviceIconMap } from "@/lib/content/service-icons"
import { services } from "@/lib/content/services"
import { serviceSchema } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Leistungen – Personalvermittlung für Event, Promotion & Logistik",
  description:
    "Eventpersonal, Promotion, Auf- und Abbau, Stadion, Gastro, Logistik, Büro – kurzfristige Personalbereitstellung mit klar definierten Rollen und Profilen.",
  alternates: { canonical: "/leistungen" },
  openGraph: {
    url: "/leistungen",
    title: "Leistungen – Yunity",
    description:
      "Sieben Personal-Kategorien für kurzfristige Einsätze – mit echten Vorteilen für Unternehmen und Bewerber:innen.",
  },
}

const cardThemes = [
  "bg-orange-50",
  "bg-sky-50",
  "bg-violet-50",
  "bg-emerald-50",
]

export default function LeistungenPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Leistungen", href: "/leistungen" }]} />
      <PageHero
        eyebrow="Unsere Leistungen"
        title="Personal, das sich an Ihren Bedarf koppelt"
        description="Kurzfristige Verfügbarkeit, klare Profile und Teams, die in Live-Settings performen – von der ersten Schicht bis zur langen Serie."
        imageSrc={services[0].imageSrc}
        imageAlt={services[0].imageAlt}
        primaryAction={{ label: "Personal anfragen", href: "/kontakt" }}
        secondaryAction={{ label: "Als Talent bewerben", href: "/fuer-bewerber" }}
        highlights={["7 Einsatzbereiche", "Flexible Teamgrößen", "Feste Ansprechpartner"]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="Passgenau statt pauschal"
          title="Ein Pool, viele operative Rollen"
          description="Wir besetzen genau die Funktionen, die Ihr Projekt vor Ort stabil machen – schnell skalierbar und klar gebrieft."
        />
        <div className="mt-14 space-y-8">
          {services.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.03}>
              <article
                id={service.id}
                className={cn(
                  "scroll-mt-28 overflow-hidden rounded-[2rem] md:rounded-[2.5rem]",
                  cardThemes[index % cardThemes.length]
                )}
              >
                <div className="grid lg:grid-cols-2 lg:items-stretch">
                  <div
                    className={cn(
                      "relative min-h-[280px] overflow-hidden lg:min-h-[470px]",
                      index % 2 === 1 && "lg:order-2"
                    )}
                  >
                    <Image
                      src={service.imageSrc}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-[1.03]"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                      {service.badge}
                    </span>
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
                      {[
                        ["Für Unternehmen", service.benefitEmployer],
                        ["Für Bewerber:innen", service.benefitWorker],
                      ].map(([label, text]) => (
                        <div
                          key={label}
                          className="rounded-2xl bg-white/70 p-4 ring-1 ring-primary/[0.06]"
                        >
                          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <CheckCircle2 className="size-4 text-accent" aria-hidden />
                            {label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-primary/65">{text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/kontakt"
                        className={cn(buttonVariants({ size: "sm" }), "group rounded-full")}
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
                          "rounded-full border-primary/15 bg-white/60"
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
      <CtaSection variant="muted" />
      <JsonLd
        id="ld-leistungen-services"
        data={services.map((service) =>
          serviceSchema({
            name: service.title,
            description: service.description,
            url: `/leistungen#${service.id}`,
          }),
        )}
      />
    </>
  )
}
