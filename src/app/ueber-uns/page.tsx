import { PageHero } from "@/components/marketing/page-hero"
import { FadeIn } from "@/components/motion/fade-in"

export const metadata = {
  title: "Über uns",
  description:
    "Yunity verbindet operative Zuverlässigkeit mit moderner Personalvermittlung – menschlich, schnell, professionell.",
}

const values = [
  {
    title: "Zuverlässigkeit",
    text: "Wenn Termine stehen, zählen Minuten – wir planen realistisch und liefern nachvollziehbar.",
  },
  {
    title: "Qualität",
    text: "Profile, die passen – nicht nur „Köpfe zählen“, sondern Rollen, die im Einsatz funktionieren.",
  },
  {
    title: "Flexibilität",
    text: "Kurzfristige Bedarfe sind unser Kern – skalierbar, ohne starre Modelle.",
  },
  {
    title: "Partnerschaft",
    text: "Wir denken mit – von Briefing bis Feedback, damit Teams besser werden.",
  },
]

const team = [
  {
    id: "team-founder",
    name: "Vorname Nachname",
    role: "Gründung & Operations",
    note: "Foto folgt",
  },
  {
    id: "team-recruiting",
    name: "Vorname Nachname",
    role: "Recruiting & Pool",
    note: "Foto folgt",
  },
]

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        title="Menschen, die operative Realität mögen"
        description="Yunity ist auf kurzfristige Personalbereitstellung spezialisiert – mit einem Pool, der im Alltag gewachsen ist, und einem klaren Anspruch: professionell arbeiten, menschlich bleiben."
      />
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Wer wir sind</h2>
        <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
          Wir glauben, dass starke Events, reibungslose Messen und stabile Logistik nicht zufällig
          entstehen – sie entstehen durch Teams, die wissen, was vor Ort zählt. Yunity bündelt
          dieses Know-how in einer schlanken Organisation: schnelle Abstimmung, klare
          Verantwortlichkeiten, ehrliche Kommunikation.
        </p>
      </section>
      <section className="border-y border-border/60 bg-muted/25 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold md:text-3xl">
            Unsere Haltung
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.05}>
                <div className="rounded-3xl border border-border/80 bg-card p-6">
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h2 className="text-2xl font-semibold">Warum wir</h2>
        <ul className="mt-8 space-y-4 text-muted-foreground">
          <li>• Bestehender, aktiver Mitarbeiterpool – kein leeres Versprechen</li>
          <li>• Schnelle Erstreaktion und klare nächste Schritte</li>
          <li>• Fokus auf operative Rollen: dort, wo es zählt</li>
          <li>• Verständnis für kurzfristige Peaks und echte Projektrealität</li>
        </ul>
      </section>
      <section className="border-t border-border/60 bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold md:text-3xl">
            Team
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Platzhalter für Fotos und Kurzprofile – ersetzen Sie diese durch echte Inhalte, sobald
            Bildmaterial vorliegt.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {team.map((m) => (
              <div
                key={m.id}
                className="flex flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-sm"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-muted text-sm text-muted-foreground">
                  {m.note}
                </div>
                <div className="p-6">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
