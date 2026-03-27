"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

import BlurText from "@/components/BlurText"
import { buttonVariants } from "@/components/ui/button-variants"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [heroMotionReady, setHeroMotionReady] = useState(false)

  useEffect(() => {
    setHeroMotionReady(true)
  }, [])

  return (
    <section
      className={cn(
        "relative border-b border-primary/[0.08]",
        "bg-gradient-to-b from-sky-50/60 via-background to-background",
        "dark:from-slate-950 dark:via-background dark:to-background"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:py-16">
        {/* Eine Fläche wie im Referenz-Beispiel: starke Rundung, helles Panel, Text + Bild */}
        <div
          className={cn(
            "overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.15)] ring-1 ring-black/[0.06]",
            "bg-[oklch(0.985_0.012_95)]",
            "dark:bg-[oklch(0.2_0.02_260)] dark:shadow-black/40 dark:ring-white/[0.08]",
            "md:rounded-[2.75rem] lg:rounded-[3rem]",
            heroMotionReady && "hero-panel-enter"
          )}
        >
          <div className="grid min-h-0 md:min-h-[26rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] md:items-stretch lg:min-h-[28rem]">
            {/* Text */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:px-12 lg:py-16">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/10 bg-background/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-foreground dark:border-white/10 dark:bg-white/5">
                <Sparkles className="size-3.5 text-accent" aria-hidden />
                <span className="text-primary dark:text-accent">{siteConfig.tagline}</span>
              </div>

              <h1 className="mt-6 text-balance text-[1.75rem] font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.35rem] md:leading-[1.12] lg:text-[2.65rem]">
                <BlurText
                  as="span"
                  text="Flexibles Personal für Events, Promotion, Logistik und mehr."
                  delay={120}
                  animateBy="words"
                  direction="top"
                  underlineLastWordCount={2}
                  className="!mb-0 inline-flex max-w-full flex-wrap font-bold leading-[1.15] tracking-tight text-inherit sm:leading-[1.12] md:leading-[1.12]"
                />
              </h1>

              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-[1.05rem]">
                Kurzfristige Personalbereitstellung mit klarer Abstimmung: Wir verbinden
                Unternehmen mit zuverlässigen Teams – und Bewerber:innen mit echten
                Einsätzen vor Ort.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/kontakt"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-7 shadow-lg shadow-primary/20"
                  )}
                >
                  Personal anfragen
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/fuer-bewerber"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-full border-primary/20 bg-background/50 px-7 dark:bg-white/5"
                  )}
                >
                  Jetzt bewerben
                </Link>
              </div>

              <p className="mt-8 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                DSGVO-bewusste Prozesse · Feste Ansprechpartner:innen · Operative
                Erfahrung in Live-Settings
              </p>
            </div>

            {/* Bild + Overlay (innerhalb der Rundung) */}
            <div className="relative min-h-[240px] w-full md:h-full md:min-h-0">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80&auto=format&fit=crop"
                alt="Team bei der Zusammenarbeit in einem modernen Büro"
                fill
                unoptimized
                className="object-cover object-[center_30%]"
                sizes="(max-width: 768px) 100vw, 52vw"
                priority
              />
              {/* Overlay: Übergang zur linken Spalte + leichte Farbtönung */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-[oklch(0.985_0.012_95)]/90 via-[oklch(0.985_0.012_95)]/15 to-transparent md:from-[oklch(0.985_0.012_95)]/65 md:via-transparent md:to-transparent dark:from-[oklch(0.2_0.02_260)]/85 dark:via-[oklch(0.2_0.02_260)]/15"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-accent/20 opacity-90 dark:from-primary/25 dark:to-accent/15"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent dark:from-black/35"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
