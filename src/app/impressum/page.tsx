import { PageHero } from "@/components/marketing/page-hero"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Angaben zu Yunity.",
}

export default function ImpressumPage() {
  return (
    <>
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
