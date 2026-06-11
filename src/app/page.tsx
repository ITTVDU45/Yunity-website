import type { Metadata } from "next"

import { ApplicantCta } from "@/components/marketing/applicant-cta"
import { CtaSection } from "@/components/marketing/cta-section"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { HeroSection } from "@/components/marketing/hero-section"
import { IndustriesTeaser } from "@/components/marketing/industries-teaser"
import { ProcessSteps } from "@/components/marketing/process-steps"
import { SectionHeading } from "@/components/marketing/section-heading"
import { ServicesOverview } from "@/components/marketing/services-overview"
import { StatsSection } from "@/components/marketing/stats-section"
import { TestimonialSlider } from "@/components/marketing/testimonial-slider"
import TechnologyStackContent from "@/components/marketing/technology-stack-content"
import { JsonLd } from "@/components/seo/json-ld"
import { homeFaqs } from "@/lib/content/faqs"
import { services } from "@/lib/content/services"
import { stats } from "@/lib/content/stats"
import { testimonials } from "@/lib/content/testimonials"
import { faqSchema, serviceSchema } from "@/lib/seo"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `Flexibles Personal für Events, Promotion & Logistik`,
  description:
    "Kurzfristig Personal anfragen oder als Bewerber:in flexible Einsätze finden. Yunity vermittelt zuverlässige Teams für Event, Promotion, Gastro, Logistik und Office – deutschlandweit.",
  alternates: { canonical: "/" },
  openGraph: {
    url: siteConfig.url,
    title: `${siteConfig.name} – Flexibles Personal für Events, Promotion & Logistik`,
    description:
      "Kurzfristig Personal anfragen oder flexible Einsätze finden. Zuverlässig, schnell, klar abgestimmt.",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} – ${siteConfig.tagline}`,
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="border-y border-border/50 bg-muted/20 py-14 md:py-20">
        <TechnologyStackContent />
      </section>
      <ServicesOverview />
      <IndustriesTeaser />
      <StatsSection items={stats} />
      <ProcessSteps />
      <ApplicantCta />
      <section className="py-20 md:py-28">
        <SectionHeading
          eyebrow="Stimmen"
          title="Was Partner:innen und Mitarbeitende sagen"
          description="Echte Einsätze, klare Erwartungen – und ein Team, das den Unterschied in der Produktion macht."
        />
        <div className="mt-12">
          <TestimonialSlider items={testimonials} />
        </div>
      </section>
      <section className="border-t border-border/60 bg-muted/20 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="FAQ"
            title="Häufige Fragen"
            description="Kurz beantwortet – für schnelle Klarheit in der Anfrage."
          />
          <div className="mt-10">
            <FaqAccordion items={homeFaqs} />
          </div>
        </div>
      </section>
      <CtaSection />

      <JsonLd
        id="ld-home-faq"
        data={faqSchema(homeFaqs.map((f) => ({ q: f.question, a: f.answer })))}
      />
      <JsonLd
        id="ld-home-services"
        data={services.map((s) =>
          serviceSchema({
            name: s.title,
            description: s.description,
            url: `/leistungen#${s.id}`,
          }),
        )}
      />
    </>
  )
}
