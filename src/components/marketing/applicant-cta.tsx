import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button-variants"
import { FadeIn } from "@/components/motion/fade-in"
import { cn } from "@/lib/utils"

/** Gleiches Muster wie Hero (`unoptimized`) – zuverlässiges Laden; Motiv: Team / Zusammenarbeit. */
const heroImage =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2000&q=85&auto=format&fit=crop"

export function ApplicantCta() {
  return (
    <section className="py-20 md:py-28">
      <FadeIn>
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-lg md:min-h-[460px] lg:min-h-[480px]">
            <div className="absolute inset-0 z-0">
              <Image
                src={heroImage}
                alt="Team bei der Zusammenarbeit – passende Rollen und Einsätze"
                fill
                unoptimized
                className="object-cover object-[center_35%]"
                sizes="(max-width: 1200px) 100vw, 1152px"
                priority={false}
              />
            </div>
            <div
              className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/50 to-black/35"
              aria-hidden
            />

            <div className="relative z-[2] flex min-h-[420px] flex-col md:min-h-[460px] lg:min-h-[480px]">
              <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-10 md:px-12 md:pb-8 md:pt-14">
                <Badge
                  variant="secondary"
                  className={cn(
                    "mb-6 border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm",
                    "shadow-sm hover:bg-white/20"
                  )}
                >
                  Für Bewerber:innen
                </Badge>
                <h2 className="max-w-4xl text-center text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                  Dein nächster Job ist näher als du denkst.
                </h2>
              </div>

              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:gap-10 md:p-10 md:pt-4">
                <p className="max-w-xl text-pretty text-sm leading-relaxed text-white/95 md:text-base">
                  Flexible Einsätze, faire Abstimmung und echte Teams vor Ort – nicht nur
                  „irgendein Job“, sondern passende Rollen.
                </p>

                <Link
                  href="/fuer-bewerber"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "group inline-flex h-auto shrink-0 items-center gap-0 overflow-hidden rounded-full border-0 bg-white py-2 pl-8 pr-2 text-base font-semibold text-slate-900 shadow-md transition hover:bg-white/95 dark:bg-white dark:text-slate-900"
                  )}
                >
                  <span className="pr-2">Jetzt bewerben</span>
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:bg-slate-800"
                    aria-hidden
                  >
                    <ArrowRight className="size-5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
