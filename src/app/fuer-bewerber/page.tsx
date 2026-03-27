import Link from "next/link"
import { Clock, Heart, Sparkles, Wallet } from "lucide-react"

import { PageHero } from "@/components/marketing/page-hero"
import { FadeIn } from "@/components/motion/fade-in"
import { buttonVariants } from "@/components/ui/button-variants"
import { services } from "@/lib/content/services"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Für Bewerber",
  description:
    "Flexible Jobs in Event, Promotion, Gastro und Logistik – fair abgestimmt, transparent geplant.",
}

const benefits = [
  {
    title: "Flexible Einsätze",
    text: "Schichten und Projekte, die zu deinem Rhythmus passen – klar kommuniziert.",
    icon: Clock,
  },
  {
    title: "Abwechslung",
    text: "Verschiedene Settings: von Promotion bis Logistik – du entscheidest mit.",
    icon: Sparkles,
  },
  {
    title: "Faire Bezahlung",
    text: "Transparente Modelle und verlässliche Abstimmung vor dem Start.",
    icon: Wallet,
  },
  {
    title: "Menschlich",
    text: "Ansprechpartner:innen, die operative Realität kennen – kein anonymes Portal.",
    icon: Heart,
  },
]

const steps = [
  {
    n: "1",
    title: "Kurzprofil",
    text: "Du sagst uns Verfügbarkeit, Erfahrung und Präferenzen.",
  },
  {
    n: "2",
    title: "Match",
    text: "Wir schlagen passende Einsätze vor – du entscheidest.",
  },
  {
    n: "3",
    title: "Start",
    text: "Briefing, Teamkontakt, erster Tag – und Feedback danach.",
  },
]

const exampleJobs = [
  { title: "Servicekraft (Messe)", loc: "Berlin", tag: "3 Tage" },
  { title: "Promoter:in (Aktivierung)", loc: "München", tag: "Sa + So" },
  { title: "Logistikhelfer:in", loc: "Hamburg", tag: "Peak-Woche" },
]

export default function FuerBewerberPage() {
  return (
    <>
      <PageHero
        title="Finde flexible Jobs in Event, Promotion, Gastro und Logistik"
        description="Wenn du zuverlässig bist und vor Ort liefern willst: Wir verbinden dich mit Einsätzen, die zu deinem Profil passen."
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Deine Vorteile
          </h2>
          <Link
            href="/kontakt"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
          >
            Jetzt bewerben
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                <b.icon className="size-8 text-accent" aria-hidden />
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <section className="border-y border-border/60 bg-muted/25 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold md:text-3xl">
            Einsatzbereiche
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/leistungen#${s.id}`}
                className="rounded-2xl border border-border/80 bg-card px-4 py-4 text-sm font-medium transition hover:border-accent/40 hover:bg-accent/5"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold md:text-3xl">
            So läuft die Bewerbung
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Schritt {s.n}
                </span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-border/60 bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-xl font-semibold">Beispiel-Einsätze (Demo)</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {exampleJobs.map((j) => (
              <div
                key={j.title}
                className="rounded-2xl border border-border/80 bg-card p-5"
              >
                <p className="font-medium">{j.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{j.loc}</p>
                <span className="mt-3 inline-block rounded-full bg-muted px-2 py-0.5 text-xs">
                  {j.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">Profil starten</h2>
          <p className="mt-3 text-muted-foreground">
            Schreib uns kurz – wir melden uns mit passenden Optionen.
          </p>
          <Link
            href="/kontakt"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex rounded-full px-10"
            )}
          >
            Zur Bewerbung
          </Link>
        </div>
      </section>
    </>
  )
}
