import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { AlertTriangle, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react"

import { CompanyInquiryForm } from "@/components/forms/company-inquiry-form"
import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { IndustryCard } from "@/components/marketing/industry-card"
import { PageHero } from "@/components/marketing/page-hero"
import { ProcessSteps } from "@/components/marketing/process-steps"
import { SectionHeading } from "@/components/marketing/section-heading"
import { FadeIn } from "@/components/motion/fade-in"
import { industries } from "@/lib/content/industries"

export const metadata: Metadata = {
  title: "Für Unternehmen – Personal kurzfristig anfragen",
  description:
    "Kurzfristig Personal für Events, Messen, Logistik und Gastronomie – schnelle Abstimmung, klare Prozesse, planbare Teams. Jetzt unverbindlich anfragen.",
  alternates: { canonical: "/fuer-unternehmen" },
  openGraph: {
    url: "/fuer-unternehmen",
    title: "Personal anfragen – Yunity für Unternehmen",
    description:
      "Skalierbare Teams für kurzfristige Einsätze. In drei Schritten zur Personalvermittlung – mit festen Ansprechpartner:innen.",
  },
}

const pains = [
  { title: "Kurzfristige Ausfälle", text: "Krankheit, Peaks oder spontane Großprojekte – ohne dass interne Teams ausbrechen.", icon: AlertTriangle, theme: "bg-orange-50" },
  { title: "Personalengpässe", text: "Saison, Kampagnen oder Messe-Wochen: Bedarf steigt schneller als die Planung.", icon: TrendingUp, theme: "bg-sky-50" },
  { title: "Hoher Projektbedarf", text: "Großformate brauchen skalierbare Teams und klare Ansprechpartner:innen.", icon: CheckCircle2, theme: "bg-emerald-50" },
]

const wins = [
  "Schneller Zugriff auf qualifizierte Profile aus dem Pool",
  "Flexibel buchbar – von Tageseinsätzen bis zu Serien",
  "Planbare Abläufe mit Briefing und Feedback",
  "Professionelles Auftreten vor Ort",
  "Entlastung für Führung und operative Leads",
]

export default function FuerUnternehmenPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Für Unternehmen", href: "/fuer-unternehmen" }]} />
      <PageHero
        eyebrow="Für Unternehmen"
        title="Schnelles Personal für Ihre nächste Projektphase"
        description="Wenn Zeit knapp ist und Qualität nicht verhandelbar: Wir liefern strukturierte Teams – abgestimmt auf Ort, Zeitraum und Rollenprofil."
        imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85&auto=format&fit=crop"
        imageAlt="Professionelles Team bei der gemeinsamen Projektplanung"
        primaryAction={{ label: "Personal anfragen", href: "#personalanfrage" }}
        secondaryAction={{ label: "Leistungen ansehen", href: "/leistungen" }}
        highlights={["Kurzfristig skalierbar", "Klare Prozesse", "Feste Ansprechpartner"]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="Wenn Planung auf Realität trifft"
          title="Für typische Engpässe gemacht"
          description="Wir verstärken dort, wo operative Belastung entsteht – ohne langwierigen Vorlauf."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pains.map((pain, index) => (
            <FadeIn key={pain.title} delay={index * 0.05}>
              <div className={`h-full rounded-[2rem] p-7 ${pain.theme}`}>
                <pain.icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-8 text-xl font-semibold text-primary">{pain.title}</h3>
                <p className="mt-3 text-sm leading-6 text-primary/65">{pain.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
        <div className="overflow-hidden rounded-[2.5rem] bg-primary text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[340px]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=85&auto=format&fit=crop"
                alt="Unternehmensteam in einer strukturierten Projektbesprechung"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-8 sm:p-10 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Ihre Vorteile</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Mehr Kapazität. Weniger Reibung.</h2>
              <div className="mt-8 space-y-4">
                {wins.map((win) => (
                  <div key={win} className="flex gap-3 border-b border-white/10 pb-4 text-sm leading-6 text-white/75">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                    {win}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProcessSteps />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Erfahrung im Einsatz"
            title="Branchen, die wir häufig unterstützen"
            description="Teams für dynamische Umfelder, in denen Timing und Verlässlichkeit zählen."
            align="left"
            className="mx-0"
          />
          <Link href="/branchen" className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">
            Alle Branchen
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industries.slice(0, 3).map((industry) => (
            <IndustryCard key={industry.id} item={industry} />
          ))}
        </div>
      </section>
      <section id="personalanfrage" className="scroll-mt-24 bg-sky-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <SectionHeading
            eyebrow="Unverbindlich starten"
            title="Was wird wann und wo gebraucht?"
            description="Beschreiben Sie kurz Bedarf und Zeitraum. Wir strukturieren die Anfrage und melden uns mit den nächsten sinnvollen Schritten."
            align="left"
            className="mx-0 lg:sticky lg:top-28"
          />
          <div className="rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_-40px_oklch(0.28_0.08_245/0.45)] sm:p-9">
            <CompanyInquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}
