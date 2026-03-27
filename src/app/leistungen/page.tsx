import Link from "next/link"
import { createElement } from "react"

import { PageHero } from "@/components/marketing/page-hero"
import { CtaSection } from "@/components/marketing/cta-section"
import { FadeIn } from "@/components/motion/fade-in"
import { buttonVariants } from "@/components/ui/button-variants"
import { serviceIconMap } from "@/lib/content/service-icons"
import { services } from "@/lib/content/services"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Leistungen",
  description:
    "Eventpersonal, Promotion, Auf- und Abbau, Stadion, Gastro, Logistik, Büro – kurzfristige Personalbereitstellung mit Yunity.",
}

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        title="Leistungen, die sich an Ihren Bedarf koppeln"
        description="Kurzfristige Verfügbarkeit, klare Profile und Teams, die in Live-Settings performen – von der ersten Schicht bis zur langen Serie."
      />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-8 text-center text-muted-foreground">
        <p className="text-pretty leading-relaxed">
          Unser Pool ist auf operative Rollen ausgerichtet. So können wir schnell
          skalieren – ohne Ihre internen Teams zu überlasten.
        </p>
      </div>
      <div className="mx-auto max-w-5xl space-y-20 px-6 pb-24">
        {services.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.03}>
              <article
                id={s.id}
                className="scroll-mt-28 rounded-[2rem] border border-border/80 bg-card p-8 shadow-sm md:p-12"
              >
                <div className="flex flex-col gap-8 md:flex-row md:items-start">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
                    {createElement(serviceIconMap[s.iconKey], {
                      className: "size-7",
                      "aria-hidden": true,
                    })}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {s.title}
                      </h2>
                      <p className="mt-3 text-muted-foreground">{s.description}</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
                        <h3 className="text-sm font-semibold text-foreground">
                          Für Unternehmen
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {s.benefitEmployer}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
                        <h3 className="text-sm font-semibold text-foreground">
                          Für Bewerber:innen
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {s.benefitWorker}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/kontakt"
                        className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
                      >
                        Personal anfragen
                      </Link>
                      <Link
                        href="/fuer-bewerber"
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "rounded-full"
                        )}
                      >
                        Jetzt bewerben
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
        ))}
      </div>
      <CtaSection variant="muted" />
    </>
  )
}
