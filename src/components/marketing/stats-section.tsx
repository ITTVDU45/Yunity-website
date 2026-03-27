"use client"

import { useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import CountUp from "react-countup"

import { FadeIn } from "@/components/motion/fade-in"
import { SectionHeading } from "@/components/marketing/section-heading"
import type { StatItem } from "@/lib/content/stats"

interface StatsSectionProps {
  items: StatItem[]
}

export function StatsSection({ items }: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const reduce = useReducedMotion()

  return (
    <section ref={ref} className="py-20 md:py-28">
      <SectionHeading
        eyebrow="Zahlen"
        title="Kapazität, die sich anfühlt wie ein festes Team"
        description="Transparente Kennzähler – angepasst an typische Anfragen aus der Praxis."
      />
      <div className="mx-auto mt-14 grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
        {items.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.08}>
            <div className="rounded-3xl border border-border/80 bg-card p-8 text-center shadow-sm">
              <div className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {reduce ? (
                  <>
                    {item.prefix}
                    {item.value}
                    {item.suffix}
                  </>
                ) : isInView ? (
                  <CountUp
                    duration={2.2}
                    end={item.value}
                    prefix={item.prefix ?? ""}
                    suffix={item.suffix ?? ""}
                    separator="."
                  />
                ) : (
                  <span className="tabular-nums">0</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.label}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
