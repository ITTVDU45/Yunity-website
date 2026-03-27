import Link from "next/link"
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"

import { CompanyInquiryForm } from "@/components/forms/company-inquiry-form"
import { PageHero } from "@/components/marketing/page-hero"
import { ProcessSteps } from "@/components/marketing/process-steps"
import { FadeIn } from "@/components/motion/fade-in"
import { buttonVariants } from "@/components/ui/button-variants"
import { industries } from "@/lib/content/industries"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Für Unternehmen",
  description:
    "Kurzfristig Personal für Events, Messen, Logistik und mehr – schnelle Abstimmung, klare Prozesse.",
}

const pains = [
  {
    title: "Kurzfristige Ausfälle",
    text: "Krankheit, Peaks oder spontane Großprojekte – ohne dass interne Teams ausbrechen.",
    icon: AlertTriangle,
  },
  {
    title: "Personalengpässe",
    text: "Saison, Kampagnen oder Messe-Wochen: Bedarf steigt schneller als die Planung.",
    icon: TrendingUp,
  },
  {
    title: "Events mit hohem Bedarf",
    text: "Großformate brauchen skalierbare Teams – und klare Ansprechpartner:innen.",
    icon: CheckCircle2,
  },
]

const wins = [
  "Schneller Zugriff auf qualifizierte Profile aus dem Pool",
  "Flexibel buchbar – von Tageseinsätzen bis zu Serien",
  "Planbare Abläufe mit Briefing und Feedback",
  "Professionelles Auftreten vor Ort – marken- und gastorientiert",
  "Entlastung für Führung und operative Leads",
]

export default function FuerUnternehmenPage() {
  return (
    <>
      <PageHero
        title="Schnelles Personal für Ihre nächste Projektphase"
        description="Wenn Zeit knapp ist und Qualität nicht verhandelbar: Wir liefern strukturierte Teams – abgestimmt auf Ort, Zeitraum und Rollenprofil."
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          Typische Herausforderungen
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-border/80 bg-muted/30 p-6">
                <p.icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <section className="border-y border-border/60 bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
            Ihre Vorteile mit Yunity
          </h2>
          <ul className="mt-10 space-y-4">
            {wins.map((w) => (
              <li
                key={w}
                className="flex gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm leading-relaxed"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ProcessSteps />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
            Branchen, die wir häufig unterstützen
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {industries.slice(0, 8).map((ind) => (
              <span
                key={ind.id}
                className="rounded-full border border-border/80 bg-card px-4 py-2 text-sm text-muted-foreground"
              >
                {ind.title}
              </span>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/branchen"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
            >
              Alle Branchen
            </Link>
          </div>
        </div>
      </section>
      <section className="border-t border-border/60 bg-muted/25 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Personalanfrage – Demo-Formular
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Beschreiben Sie kurz Bedarf und Zeitraum. Technischer Versand und CRM-Anbindung
              können später ergänzt werden.
            </p>
          </div>
          <CompanyInquiryForm />
        </div>
      </section>
    </>
  )
}
