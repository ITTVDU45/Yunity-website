import Link from "next/link"

import { IndustriesSlider } from "@/components/marketing/industries-slider"
import { SectionHeading } from "@/components/marketing/section-heading"
import { buttonVariants } from "@/components/ui/button-variants"
import { industries } from "@/lib/content/industries"
import { cn } from "@/lib/utils"

export function IndustriesTeaser() {
  return (
    <section className="border-y border-border/60 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={cn(
            "overflow-hidden rounded-[2rem] border border-sky-200/80",
            "bg-gradient-to-br from-sky-50 via-cyan-50/90 to-sky-100/70",
            "px-5 py-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:px-8 md:py-9 lg:px-10 lg:py-10",
            "dark:border-sky-800/45 dark:from-slate-900 dark:via-sky-950/50 dark:to-slate-900",
            "dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
          )}
        >
          <SectionHeading
            eyebrow="Branchen"
            title="Für wen wir arbeiten"
            description="Von Agenturen bis Industrie: Wir unterstützen dort, wo kurzfristig Personal die entscheidende Hebelwirkung hat."
            className="max-w-3xl"
          />
          <div className="mt-8 md:mt-10">
            <IndustriesSlider items={industries} embedded />
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/branchen"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full border-sky-300/90 bg-white/85 px-8 shadow-sm backdrop-blur-[2px] hover:bg-white dark:border-sky-700/60 dark:bg-slate-950/50 dark:hover:bg-slate-950/70"
              )}
            >
              Alle Branchen
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
