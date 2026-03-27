import { IndustryCard } from "@/components/marketing/industry-card"
import { PageHero } from "@/components/marketing/page-hero"
import { CtaSection } from "@/components/marketing/cta-section"
import { FadeIn } from "@/components/motion/fade-in"
import { industries } from "@/lib/content/industries"

export const metadata = {
  title: "Branchen & Einsatzbereiche",
  description:
    "Event, Festival, Messe, Promotion, Gastro, Logistik und mehr – wo Yunity Unternehmen unterstützt.",
}

export default function BranchenPage() {
  return (
    <>
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
