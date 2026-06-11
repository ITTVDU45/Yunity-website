import type { Metadata } from "next"

import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { IndustryCard } from "@/components/marketing/industry-card"
import { PageHero } from "@/components/marketing/page-hero"
import { CtaSection } from "@/components/marketing/cta-section"
import { FadeIn } from "@/components/motion/fade-in"
import { industries } from "@/lib/content/industries"

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

export default function BranchenPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Branchen", href: "/branchen" }]} />
      <PageHero
        title="Branchen & Einsatzbereiche"
        description="Wo kurzfristiges Personal den Unterschied macht – und wie wir Sie entlang Ihrer Prozesse entlasten."
      />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.03}>
              <IndustryCard item={item} />
            </FadeIn>
          ))}
        </div>
      </div>
      <CtaSection variant="muted" />
    </>
  )
}
