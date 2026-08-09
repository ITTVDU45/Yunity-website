import type { Metadata } from "next"
import { Clock3, Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/components/forms/contact-form"
import { Breadcrumb } from "@/components/marketing/breadcrumb"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { PageHero } from "@/components/marketing/page-hero"
import { SectionHeading } from "@/components/marketing/section-heading"
import { JsonLd } from "@/components/seo/json-ld"
import { contactFaqs } from "@/lib/content/faqs"
import { faqSchema } from "@/lib/seo"
import { siteConfig } from "@/lib/site-config"
import { CmsSections } from "@/components/cms/section-renderer"
import { CMS_ENABLED, cms } from "@/lib/cms/client"

export const metadata: Metadata = {
  title: "Kontakt – Personalanfrage oder Bewerbung starten",
  description:
    "Yunity per Telefon, E-Mail oder Formular kontaktieren. Wir antworten typischerweise innerhalb von 1–2 Werktagen – bei dringenden Einsätzen schneller.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    url: "/kontakt",
    title: "Yunity kontaktieren",
    description: "Telefon, E-Mail oder Formular – drei Wege, die zu uns führen.",
  },
}

export default async function KontaktPage() {
  // Liegt die Seite veroeffentlicht im CMS, rendert sie aus dem Backend.
  // Sonst bleibt der bestehende statische Aufbau unveraendert bestehen.
  if (CMS_ENABLED) {
    const page = await cms.pageBySlug("kontakt")
    if (page && page.sections.length > 0) {
      return <CmsSections sections={page.sections} />
    }
  }

  const contactCards = [
    {
      label: "Telefon",
      value: siteConfig.phoneDisplay,
      href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
      icon: Phone,
      theme: "bg-sky-50",
    },
    {
      label: "E-Mail",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      icon: Mail,
      theme: "bg-violet-50",
    },
    {
      label: "Antwortzeit",
      value: "Meist innerhalb von 1–2 Werktagen",
      icon: Clock3,
      theme: "bg-emerald-50",
    },
  ]

  return (
    <>
      <Breadcrumb items={[{ label: "Kontakt", href: "/kontakt" }]} />
      <PageHero
        eyebrow="Direkter Kontakt"
        title="Lassen Sie uns kurz sprechen"
        description="Ob Personalanfrage oder Bewerbung: Wir melden uns zeitnah mit den nächsten sinnvollen Schritten."
        imageSrc="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=85&auto=format&fit=crop"
        imageAlt="Persönliches Beratungsgespräch in einem modernen Büro"
        primaryAction={{ label: "Nachricht senden", href: "#kontaktformular" }}
        secondaryAction={{ label: "Direkt anrufen", href: `tel:${siteConfig.phone.replace(/\s/g, "")}` }}
        highlights={["Persönlich erreichbar", "Schnelle Rückmeldung", "Unverbindlicher Erstkontakt"]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map((card) => {
            const content = (
              <>
                <card.icon className="size-7 text-primary" aria-hidden />
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-primary/45">{card.label}</p>
                <p className="mt-2 font-semibold text-primary">{card.value}</p>
              </>
            )
            return card.href ? (
              <a key={card.label} href={card.href} className={`rounded-[2rem] p-7 transition hover:-translate-y-1 ${card.theme}`}>
                {content}
              </a>
            ) : (
              <div key={card.label} className={`rounded-[2rem] p-7 ${card.theme}`}>{content}</div>
            )
          })}
        </div>
      </section>
      <section id="kontaktformular" className="scroll-mt-24 pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid overflow-hidden rounded-[2.5rem] bg-[oklch(0.985_0.012_95)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-14">
              <SectionHeading
                eyebrow="Ihre Nachricht"
                title="Worum geht es?"
                description="Ein paar Eckdaten reichen für den Start. Wir ordnen Ihre Anfrage direkt dem richtigen Ansprechpartner zu."
                align="left"
                className="mx-0"
              />
              <div className="mt-12 rounded-2xl bg-white/80 p-5 text-sm text-primary/65">
                <p className="flex items-start gap-3 font-semibold text-primary">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.zip} {siteConfig.address.city}
                </p>
              </div>
            </div>
            <div className="bg-white p-8 sm:p-10 lg:p-14">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-sky-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow="Kurz vorab"
            title="Häufige Fragen zum Kontakt"
            description="Die wichtigsten Antworten, bevor wir persönlich ins Gespräch gehen."
          />
          <div className="mt-10 rounded-[2rem] bg-white p-6 sm:p-8">
            <FaqAccordion items={contactFaqs} />
          </div>
        </div>
      </section>
      <JsonLd
        id="ld-kontakt-faq"
        data={faqSchema(contactFaqs.map((faq) => ({ q: faq.question, a: faq.answer })))}
      />
    </>
  )
}
