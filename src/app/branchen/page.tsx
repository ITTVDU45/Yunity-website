import type { Metadata } from "next"

import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { CtaSection } from "@/components/marketing/cta-section"
import { IndustryCard } from "@/components/marketing/industry-card"
import { PageHero } from "@/components/marketing/page-hero"
import { SectionHeading } from "@/components/marketing/section-heading"
import { FadeIn } from "@/components/motion/fade-in"
import { industries } from "@/lib/content/industries"
import { CmsSections } from "@/components/cms/section-renderer"
import { CMS_ENABLED, cms } from "@/lib/cms/client"

export const metadata: Metadata = {
  title: "Branchen & Einsatzbereiche – wo Yunity unterstützt",
  description:
    "Event, Festival, Messe, Promotion, Gastronomie, Sport, Logistik und mehr: Yunity vermittelt Personal für die Branchen mit hoher operativer Dynamik.",
  alternates: { canonical: "/branchen" },
  openGraph: {
    url: "/branchen",
    title: "Branchen & Einsatzbereiche – Yunity",
    description:
      "Acht Branchen, in denen kurzfristiges Personal den Unterschied macht – mit konkreten Einsatzbeispielen.",
  },
}

export default async function BranchenPage() {
  // Liegt die Seite veroeffentlicht im CMS, rendert sie aus dem Backend.
  // Sonst bleibt der bestehende statische Aufbau unveraendert bestehen.
  if (CMS_ENABLED) {
    const page = await cms.pageBySlug("branchen")
    if (page && page.sections.length > 0) {
      return <CmsSections sections={page.sections} />
    }
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Branchen", href: "/branchen" }]} />
      <PageHero
        eyebrow="Branchenkompetenz"
        title="Wo flexible Teams den Unterschied machen"
        description="Wir kennen die Dynamik von Live-Formaten, saisonalen Peaks und operativen Projektphasen – und besetzen genau die Rollen, die vor Ort zählen."
        imageSrc={industries[1].imageSrc}
        imageAlt={industries[1].imageAlt}
        primaryAction={{ label: "Bedarf besprechen", href: "/kontakt" }}
        secondaryAction={{ label: "Leistungen ansehen", href: "/leistungen" }}
        highlights={["Events & Messen", "Gastro & Logistik", "Promotion & Projekte"]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="Einsatzfelder"
          title="Erfahrung in dynamischen Umfeldern"
          description="Jede Branche hat ihre eigenen Abläufe. Unsere Teams werden passend zum Setting, zur Rolle und zum Zeitplan zusammengestellt."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {industries.map((industry, index) => (
            <FadeIn key={industry.id} delay={index * 0.03}>
              <IndustryCard item={industry} />
            </FadeIn>
          ))}
        </div>
      </section>
      <CtaSection variant="muted" />
    </>
  )
}
