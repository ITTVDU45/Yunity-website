import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button-variants"
import { FadeIn } from "@/components/motion/fade-in"
import { cn } from "@/lib/utils"

interface CtaAction {
  label: string
  href: string
}

interface CtaSectionProps {
  variant?: "default" | "muted"
  /**
   * Optionale Inhalte aus dem CMS. Ohne Werte rendert die Sektion exakt die
   * bisherigen Texte — das Design bleibt in beiden Faellen identisch.
   */
  title?: string
  description?: string
  primaryAction?: CtaAction
  secondaryAction?: CtaAction
}

const DEFAULT_CTA = {
  title: "Bereit für den nächsten Einsatz?",
  description:
    "Zwei Wege – ein klarer Prozess: Personal anfragen oder direkt für flexible Jobs bewerben.",
  primaryAction: { label: "Personal anfragen", href: "/kontakt" },
  secondaryAction: { label: "Jetzt bewerben", href: "/fuer-bewerber" },
} as const

export function CtaSection({
  variant = "default",
  title,
  description,
  primaryAction,
  secondaryAction,
}: CtaSectionProps) {
  const heading = title || DEFAULT_CTA.title
  const text = description || DEFAULT_CTA.description
  const primary = primaryAction?.href ? primaryAction : DEFAULT_CTA.primaryAction
  const secondary = secondaryAction?.href
    ? secondaryAction
    : DEFAULT_CTA.secondaryAction
  return (
    <section
      className={cn(
        "py-20 md:py-28",
        variant === "muted" && "bg-muted/40"
      )}
    >
      <FadeIn>
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border/80 bg-gradient-to-br from-primary/90 via-primary to-primary/80 px-8 py-14 text-primary-foreground shadow-xl md:px-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              {heading}
            </h2>
            <p className="mt-4 text-pretty text-primary-foreground/85">{text}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href={primary.href}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "rounded-full px-8"
                )}
              >
                {primary.label}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={secondary.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                {secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
