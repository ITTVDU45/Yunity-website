import { PageHero } from "@/components/marketing/page-hero"

export const metadata = {
  title: "Datenschutz",
  description: "Informationen zur Verarbeitung personenbezogener Daten.",
}

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        title="Datenschutz"
        description="Platzhalter – bitte durch eine vollständige Datenschutzerklärung ersetzen."
      />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-6 text-muted-foreground">
        <p>
          Diese Seite enthält noch keinen vollständigen Datenschutztext. Für den Live-Betrieb
          benötigen Sie eine rechtskonforme Erklärung inkl. Verantwortlicher, Zwecke,
          Rechtsgrundlagen, Speicherdauer, Betroffenenrechte und Kontakt der
          Datenschutzaufsicht.
        </p>
        <p>
          Formulare auf dieser Website sind Demo-Implementierungen ohne automatisierten Versand.
        </p>
      </div>
    </>
  )
}
