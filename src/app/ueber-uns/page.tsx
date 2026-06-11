import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2, Gauge, Handshake, ShieldCheck, Sparkles } from "lucide-react"

import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { CtaSection } from "@/components/marketing/cta-section"
import { PageHero } from "@/components/marketing/page-hero"
import { SectionHeading } from "@/components/marketing/section-heading"
import { FadeIn } from "@/components/motion/fade-in"

export const metadata: Metadata = {
  title: "Über uns – Operative Personalvermittlung mit Haltung",
  description:
    "Yunity verbindet operative Zuverlässigkeit mit moderner Personalvermittlung – menschlich, schnell, professionell. Lerne das Team und unsere Werte kennen.",
  alternates: { canonical: "/ueber-uns" },
  openGraph: {
    url: "/ueber-uns",
    title: "Über Yunity",
    description:
      "Wer wir sind, wofür wir stehen – und warum Zuverlässigkeit, Qualität und Flexibilität unsere Kernwerte sind.",
  },
}

const values = [
  { title: "Zuverlässigkeit", text: "Wir planen realistisch und liefern nachvollziehbar.", icon: ShieldCheck, theme: "bg-sky-50" },
  { title: "Qualität", text: "Profile, die zur Rolle und zum Einsatz passen.", icon: Sparkles, theme: "bg-violet-50" },
  { title: "Flexibilität", text: "Skalierbare Lösungen für kurzfristige Bedarfe.", icon: Gauge, theme: "bg-emerald-50" },
  { title: "Partnerschaft", text: "Wir denken vom Briefing bis zum Feedback mit.", icon: Handshake, theme: "bg-orange-50" },
]

const reasons = [
  "Bestehender, aktiver Mitarbeiterpool",
  "Schnelle Erstreaktion und klare nächste Schritte",
  "Fokus auf operative Rollen",
  "Verständnis für kurzfristige Peaks und Projektrealität",
]

const team = [
  { id: "team-founder", name: "Vorname Nachname", role: "Gründung & Operations" },
  { id: "team-recruiting", name: "Vorname Nachname", role: "Recruiting & Pool" },
]

export default function UeberUnsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Über uns", href: "/ueber-uns" }]} />
      <PageHero
        eyebrow="Über Yunity"
        title="Menschen, die operative Realität mögen"
        description="Wir verbinden kurzfristige Personalbereitstellung mit einem klaren Anspruch: professionell arbeiten, verlässlich kommunizieren und menschlich bleiben."
        imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85&auto=format&fit=crop"
        imageAlt="Yunity Team bei der gemeinsamen Zusammenarbeit"
        primaryAction={{ label: "Mit uns sprechen", href: "/kontakt" }}
        secondaryAction={{ label: "Unsere Leistungen", href: "/leistungen" }}
        highlights={["Menschlich", "Schnell", "Professionell"]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-[oklch(0.985_0.012_95)] lg:grid-cols-2">
          <div className="relative min-h-[340px]">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=85&auto=format&fit=crop"
              alt="Team im persönlichen Austausch"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Wer wir sind</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary">Aus Erfahrung für den Einsatz gebaut</h2>
            <p className="mt-5 leading-7 text-primary/65">
              Starke Events, reibungslose Messen und stabile Logistik entstehen durch Teams,
              die wissen, was vor Ort zählt. Yunity bündelt dieses Know-how in einer schlanken
              Organisation mit klaren Verantwortlichkeiten und ehrlicher Kommunikation.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-sky-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Unsere Haltung"
            title="Werte, die im Alltag sichtbar werden"
            description="Nicht als Schlagworte, sondern in Planung, Kommunikation und jedem einzelnen Einsatz."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.05}>
                <div className={`h-full rounded-[2rem] p-6 ${value.theme}`}>
                  <value.icon className="size-8 text-primary" aria-hidden />
                  <h3 className="mt-8 text-lg font-semibold text-primary">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-primary/65">{value.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="rounded-[2.5rem] bg-primary p-8 text-white sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Warum Yunity</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Nähe zum Einsatz statt Distanz zum Alltag</h2>
            </div>
            <div className="grid gap-3">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/75">
                  <CheckCircle2 className="size-5 shrink-0 text-accent" aria-hidden />
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            eyebrow="Das Team"
            title="Direkte Ansprechpartner"
            description="Die Profile werden mit den finalen Teamfotos und persönlichen Kurzbeschreibungen ergänzt."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {team.map((member, index) => (
              <div key={member.id} className="overflow-hidden rounded-[2rem] bg-[oklch(0.985_0.012_95)]">
                <div className={`flex aspect-[4/3] items-center justify-center ${index === 0 ? "bg-sky-100" : "bg-violet-100"}`}>
                  <span className="rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-primary/60">Foto folgt</span>
                </div>
                <div className="p-6">
                  <p className="font-semibold text-primary">{member.name}</p>
                  <p className="mt-1 text-sm text-primary/55">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaSection variant="muted" />
    </>
  )
}
