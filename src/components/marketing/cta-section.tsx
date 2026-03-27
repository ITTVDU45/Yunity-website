import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button-variants"
import { FadeIn } from "@/components/motion/fade-in"
import { cn } from "@/lib/utils"

interface CtaSectionProps {
  variant?: "default" | "muted"
}

export function CtaSection({ variant = "default" }: CtaSectionProps) {
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
              Bereit für den nächsten Einsatz?
            </h2>
            <p className="mt-4 text-pretty text-primary-foreground/85">
              Zwei Wege – ein klarer Prozess: Personal anfragen oder direkt für
              flexible Jobs bewerben.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/kontakt"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "rounded-full px-8"
                )}
              >
                Personal anfragen
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/fuer-bewerber"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                Jetzt bewerben
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
