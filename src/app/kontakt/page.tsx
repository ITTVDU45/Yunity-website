import { Mail, Phone } from "lucide-react"

import { ContactForm } from "@/components/forms/contact-form"
import { PageHero } from "@/components/marketing/page-hero"
import { FaqAccordion } from "@/components/marketing/faq-accordion"
import { contactFaqs } from "@/lib/content/faqs"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "Kontakt",
  description: "Yunity kontaktieren – Telefon, E-Mail oder Formular.",
}

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Lassen Sie uns kurz sprechen"
        description="Ob Personalanfrage oder Bewerbung: Wir melden uns zeitnah mit den nächsten sinnvollen Schritten."
      />
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold">Kontakt</h2>
              <div className="mt-6 space-y-4">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-muted-foreground transition hover:text-foreground"
                >
                  <Phone className="size-5 shrink-0 text-accent" aria-hidden />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="size-5 shrink-0 text-accent" aria-hidden />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Adresse (Beispiel)</p>
              <p className="mt-2">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.zip} {siteConfig.address.city}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Kurz vorab
              </h3>
              <div className="mt-4">
                <FaqAccordion items={contactFaqs} />
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-border/80 bg-card p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Nachricht senden</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Demo-Formular ohne Backend-Anbindung.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
