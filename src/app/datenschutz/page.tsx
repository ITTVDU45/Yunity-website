import type { Metadata } from "next"

import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { PageHero } from "@/components/marketing/page-hero"
import { CmsSections } from "@/components/cms/section-renderer"
import { CMS_ENABLED, cms } from "@/lib/cms/client"

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Informationen zur Verarbeitung personenbezogener Daten.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
}

export default async function DatenschutzPage() {
  // Liegt die Seite veroeffentlicht im CMS, rendert sie aus dem Backend.
  // Sonst bleibt der bestehende statische Aufbau unveraendert bestehen.
  if (CMS_ENABLED) {
    const page = await cms.pageBySlug("datenschutz")
    if (page && page.sections.length > 0) {
      return <CmsSections sections={page.sections} />
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Datenschutz", href: "/datenschutz" }]} />
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
