import type { Metadata } from "next"

import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { PageHero } from "@/components/marketing/page-hero"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Angaben zu Yunity.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
}

export default function ImpressumPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Impressum", href: "/impressum" }]} />
      <PageHero
        title="Impressum"
        description="Platzhalter – bitte durch Ihre rechtskonformen Angaben ersetzen."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-muted-foreground">
        <p>
          <strong>{siteConfig.name}</strong>
          <br />
          {siteConfig.address.street}
          <br />
          {siteConfig.address.zip} {siteConfig.address.city}
        </p>
        <p>
          Telefon: {siteConfig.phoneDisplay}
          <br />
          E-Mail: {siteConfig.email}
        </p>
        <p>
          Vertretungsberechtigt: [Name der vertretungsberechtigten Person]
          <br />
          Registergericht: [falls zutreffend]
          <br />
          USt-IdNr.: [falls vorhanden]
        </p>
        <p className="text-sm text-muted-foreground">
          Haftungshinweise, Streitschlichtung und weitere Pflichtangaben nach Ihrer
          Rechtsberatung ergänzen.
        </p>
      </div>
    </>
  )
}
