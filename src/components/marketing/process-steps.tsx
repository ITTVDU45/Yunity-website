"use client"

import { useEffect, useRef, useState } from "react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { cn } from "@/lib/utils"

const steps = [
  {
    step: "01",
    title: "Anfrage",
    text: "Bedarf, Zeitraum, Ort – wir strukturieren Ihre Anforderung in klare Profile.",
  },
  {
    step: "02",
    title: "Auswahl",
    text: "Wir schlagen passende Profile aus dem Pool vor – schnell und nachvollziehbar.",
  },
  {
    step: "03",
    title: "Planung",
    text: "Briefing, Schichten, Ansprechpartner:innen – alles vor dem ersten Tag geklärt.",
  },
  {
    step: "04",
    title: "Einsatz",
    text: "Start vor Ort mit Feedback-Schleifen – damit Teams sofort produktiv sind.",
  },
] as const

/** Pause zwischen Schritt 1 → 2 → 3 → 4 (ms). */
const STEP_GAP_MS = 720

export function ProcessSteps() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const sequenceStartedRef = useRef(false)
  const [sectionInView, setSectionInView] = useState(false)

  /** Erst nach Mount – identisch zu SSR (false). */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  /** -1 = noch kein Schritt; 0–3 = aktueller letzter freigeschalteter Schritt */
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    function sync() {
      setPrefersReducedMotion(mq.matches)
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || sequenceStartedRef.current) return
        sequenceStartedRef.current = true
        setSectionInView(true)
        io.disconnect()
      },
      { threshold: 0.38, rootMargin: "0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!sectionInView) return

    if (prefersReducedMotion) {
      setActiveIndex(3)
      return
    }

    setActiveIndex(-1)
    const timers = [0, 1, 2, 3].map((i) =>
      window.setTimeout(() => setActiveIndex(i), i * STEP_GAP_MS)
    )
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [sectionInView, prefersReducedMotion])

  const progress =
    activeIndex < 0 ? 0 : Math.min(1, (activeIndex + 1) / steps.length)
  const progressPercent = Math.round(progress * 100)

  return (
    <section className="py-20 md:py-28">
      <SectionHeading
        eyebrow="Ablauf"
        title="So funktioniert’s – transparent und planbar"
        description="Ein Prozess, der Vertrauen schafft: von der ersten Anfrage bis zum laufenden Einsatz."
      />

      <div ref={triggerRef} className="mx-auto mt-12 max-w-6xl px-6 md:mt-14">
        <div className="rounded-2xl border border-sky-200/30 bg-background/90 px-4 py-4 pb-5 shadow-sm backdrop-blur-sm dark:border-sky-800/30">
          <div className="relative pb-1 pt-4">
            <div
              className="relative z-0 h-2.5 w-full overflow-hidden rounded-full bg-sky-100/90 ring-1 ring-sky-200/50 dark:bg-sky-950/40 dark:ring-sky-800/40"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Fortschritt im Ablauf"
            >
              <div
                className={cn(
                  "h-full w-full rounded-full bg-gradient-to-r from-sky-200/95 via-cyan-200/85 to-sky-300/80 dark:from-sky-600/50 dark:via-cyan-700/45 dark:to-sky-600/55",
                  prefersReducedMotion
                    ? "transition-none"
                    : "transition-[transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                )}
                style={{
                  transform: `scaleX(${progress})`,
                  transformOrigin: "left center",
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2"
              aria-hidden
            >
              {steps.map((s, i) => (
                <div key={s.step} className="flex flex-1 justify-center">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border text-[10px] font-semibold shadow-sm transition-[transform,colors] duration-300 ease-out",
                      activeIndex >= i
                        ? "border-sky-300/70 bg-sky-200/90 text-sky-900 dark:border-sky-500/50 dark:bg-sky-700/60 dark:text-sky-50"
                        : "border-sky-200/60 bg-white/95 text-sky-500/70 dark:border-sky-800/60 dark:bg-slate-900/90 dark:text-sky-400/70",
                      i === activeIndex && "scale-105"
                    )}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground md:text-sm">
            Schritt für Schritt – automatisch, sobald der Bereich sichtbar wird.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
          {steps.map((s, i) => {
            const visible = prefersReducedMotion ? true : activeIndex >= i
            return (
              <div
                key={s.step}
                className={cn(
                  "relative min-h-[180px] rounded-3xl border border-sky-200/40 bg-card/90 p-6 shadow-sm backdrop-blur-sm dark:border-sky-800/35",
                  "before:absolute before:left-6 before:top-0 before:h-px before:w-12 before:bg-sky-300/50 md:before:hidden dark:before:bg-sky-600/40",
                  !visible && !prefersReducedMotion && "pointer-events-none",
                  prefersReducedMotion
                    ? "opacity-100"
                    : "transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  !prefersReducedMotion &&
                    (visible
                      ? "translate-y-0 opacity-100 blur-none"
                      : "translate-y-5 opacity-0 blur-[12px]")
                )}
                inert={!visible && !prefersReducedMotion ? true : undefined}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                  {s.step}
                </p>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
