import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Heart, MapPin, Sparkles, Wallet } from "lucide-react"

import { ApplicantCta } from "@/components/marketing/applicant-cta"
import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { PageHero } from "@/components/marketing/page-hero"
import { SectionHeading } from "@/components/marketing/section-heading"
import { FadeIn } from "@/components/motion/fade-in"
import { services } from "@/lib/content/services"

export const metadata: Metadata = {
  title: "Für Bewerber – Flexible Jobs in Event, Gastro & Logistik",
  description:
    "Flexible Einsätze in Event, Promotion, Gastronomie und Logistik – fair abgestimmt, transparent geplant. Bewirb dich in wenigen Schritten bei Yunity.",
  alternates: { canonical: "/fuer-bewerber" },
  openGraph: {
    url: "/fuer-bewerber",
    title: "Bewerben bei Yunity",
    description:
      "Verdiene flexibel in spannenden Settings. Du sagst uns dein Profil – wir matchen die passenden Einsätze.",
  },
}

const benefits = [
  { title: "Flexible Einsätze", text: "Schichten und Projekte, die zu deinem Rhythmus passen.", icon: Clock, theme: "bg-sky-50" },
  { title: "Abwechslung", text: "Von Promotion bis Logistik – du entscheidest mit.", icon: Sparkles, theme: "bg-violet-50" },
  { title: "Faire Bezahlung", text: "Transparente Modelle und verlässliche Abstimmung.", icon: Wallet, theme: "bg-emerald-50" },
  { title: "Menschlich", text: "Direkte Ansprechpartner:innen statt anonymem Portal.", icon: Heart, theme: "bg-orange-50" },
]

const steps = [
  { n: "01", title: "Kurzprofil", text: "Du sagst uns Verfügbarkeit, Erfahrung und Präferenzen." },
  { n: "02", title: "Match", text: "Wir schlagen passende Einsätze vor – du entscheidest." },
  { n: "03", title: "Start", text: "Briefing, Teamkontakt, erster Tag und Feedback danach." },
]

const exampleJobs = [
  { title: "Servicekraft (Messe)", loc: "Berlin", tag: "3 Tage" },
  { title: "Promoter:in (Aktivierung)", loc: "München", tag: "Sa + So" },
  { title: "Logistikhelfer:in", loc: "Hamburg", tag: "Peak-Woche" },
]

export default function FuerBewerberPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Für Bewerber", href: "/fuer-bewerber" }]} />
      <PageHero
        eyebrow="Dein nächster Einsatz"
        title="Flexible Jobs, die in dein Leben passen"
        description="Wenn du zuverlässig bist und vor Ort liefern willst: Wir verbinden dich mit Einsätzen, die zu deinem Profil und deinem Kalender passen."
        imageSrc="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=85&auto=format&fit=crop"
        imageAlt="Junges Team im Austausch vor einem gemeinsamen Einsatz"
        primaryAction={{ label: "Profil starten", href: "/kontakt" }}
        secondaryAction={{ label: "Einsatzbereiche ansehen", href: "/leistungen" }}
        highlights={["Flexible Schichten", "Transparente Planung", "Persönlicher Kontakt"]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="Deine Vorteile"
          title="Arbeiten mit mehr Freiheit und Klarheit"
          description="Du bestimmst, was zu dir passt. Wir kümmern uns um ein klares Matching und einen strukturierten Start."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <FadeIn key={benefit.title} delay={index * 0.05}>
              <div className={`h-full rounded-[2rem] p-6 ${benefit.theme}`}>
                <benefit.icon className="size-8 text-primary" aria-hidden />
                <h3 className="mt-8 text-lg font-semibold text-primary">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-primary/65">{benefit.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <SectionHeading
              eyebrow="Aktuelle Beispiele"
              title="So vielfältig kann dein nächster Job sein"
              description="Die Beispiele zeigen typische Einsätze. Konkrete Verfügbarkeiten stimmen wir direkt mit dir ab."
              className="[&_h2]:text-white [&_p]:text-white/60"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {exampleJobs.map((job) => (
                <div key={job.title} className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                    {job.tag}
                  </span>
                  <p className="mt-6 font-semibold">{job.title}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                    <MapPin className="size-4" aria-hidden />
                    {job.loc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="In drei Schritten"
          title="So läuft deine Bewerbung"
          description="Unkompliziert starten, passende Optionen prüfen und gut vorbereitet in den Einsatz gehen."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="rounded-[2rem] bg-[oklch(0.985_0.012_95)] p-7 ring-1 ring-primary/[0.06]">
              <span className="text-4xl font-semibold tracking-tight text-accent">{step.n}</span>
              <h3 className="mt-8 text-xl font-semibold text-primary">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-primary/65">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-[2.5rem] bg-sky-50 p-7 md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Einsatzbereiche</p>
              <h2 className="mt-3 text-2xl font-semibold text-primary">Wo möchtest du mitwirken?</h2>
            </div>
            <Link href="/leistungen" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Alle Bereiche
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map((service) => (
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
      <ApplicantCta />
    </>
  )
}
