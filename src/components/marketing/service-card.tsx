"use client"

import { createElement } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ServiceCardDecoration } from "@/components/marketing/service-card-decoration"
import type { ServiceIconKey } from "@/lib/content/service-icons"
import { serviceIconMap } from "@/lib/content/service-icons"
import { cn } from "@/lib/utils"

const softThemes = [
  {
    bg: "bg-orange-50",
    decoColor: "text-orange-500",
    link: "text-orange-900 hover:text-orange-950",
  },
  {
    bg: "bg-sky-50",
    decoColor: "text-sky-500",
    link: "text-sky-900 hover:text-sky-950",
  },
  {
    bg: "bg-violet-50",
    decoColor: "text-violet-500",
    link: "text-violet-900 hover:text-violet-950",
  },
  {
    bg: "bg-emerald-50",
    decoColor: "text-emerald-500",
    link: "text-emerald-900 hover:text-emerald-950",
  },
] as const

const easeOut = [0.22, 1, 0.36, 1] as const

interface ServiceCardProps {
  title: string
  short: string
  iconKey: ServiceIconKey
  href?: string
  className?: string
  variant?: "default" | "soft"
  badge?: string
  themeIndex?: number
  imageSrc?: string
  imageAlt?: string
  /** Reihenfolge für gestaffelte Eintritts-Animation */
  index?: number
}

export function ServiceCard({
  title,
  short,
  iconKey,
  href = "/leistungen",
  className,
  variant = "default",
  badge,
  themeIndex = 0,
  imageSrc,
  imageAlt,
  index = 0,
}: ServiceCardProps) {
  const reduce = useReducedMotion()
  const isSoft = variant === "soft"
  const t = themeIndex % 4
  const theme = softThemes[t] ?? softThemes[0]
  if (isSoft) {
    return (
      <motion.div
        className={cn("h-full", className)}
        initial={reduce ? false : { y: 28 }}
        whileInView={reduce ? undefined : { y: 0 }}
        viewport={{ once: true, margin: "-80px", amount: 0.05 }}
        transition={{
          duration: 0.5,
          delay: reduce ? 0 : index * 0.07,
          ease: easeOut,
        }}
        whileHover={
          reduce
            ? undefined
            : {
                y: -10,
                transition: { type: "spring", stiffness: 380, damping: 26 },
              }
        }
      >
        <div
          className={cn(
            "group/card relative flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] shadow-md transition-shadow duration-300",
            "hover:shadow-xl hover:shadow-black/10",
            theme.bg
          )}
        >
          <div className={cn("absolute inset-0", theme.decoColor)} aria-hidden>
            <ServiceCardDecoration theme={t as 0 | 1 | 2 | 3} />
          </div>

          {imageSrc && imageAlt ? (
            <div className="relative z-[2] shrink-0 px-5 pt-4 md:px-7 md:pt-5">
              {/* Feste Höhe + fill: vermeidet 0px-Höhe bei aspect-ratio/Flex; unoptimized: direkter Unsplash-Request ohne /_next/image */}
              <div className="relative h-44 w-full min-w-0 overflow-hidden rounded-xl bg-slate-200/60 ring-1 ring-black/5 sm:h-48">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  unoptimized
                  className={cn(
                    "object-cover transition-transform duration-500 ease-out motion-reduce:transition-none",
                    !reduce && "group-hover/card:scale-[1.06]"
                  )}
                  priority={index < 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70"
                  aria-hidden
                />
              </div>
            </div>
          ) : null}

          <div className="relative z-[1] flex flex-1 flex-col px-6 pb-7 pt-5 md:px-8 md:pb-8 md:pt-6">
            {badge ? (
              <motion.span
                initial={reduce ? false : { opacity: 0, x: -8 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduce ? 0 : index * 0.07 + 0.12, duration: 0.35 }}
                className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-800 shadow-sm ring-1 ring-black/5"
              >
                {badge}
              </motion.span>
            ) : null}
            <h3 className="mt-4 text-balance text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-[1.65rem] md:leading-snug">
              {title}
            </h3>
            <p className="mt-3 flex-1 text-pretty text-base leading-relaxed text-slate-600">
              {short}
            </p>
            <motion.div
              whileHover={reduce ? undefined : { x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="mt-6"
            >
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4",
                  theme.link
                )}
              >
                Mehr erfahren
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn("h-full", className)}
    >
      <Card className="group h-full rounded-3xl border-border/80 shadow-sm hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
            {createElement(serviceIconMap[iconKey], {
              className: "size-5",
              "aria-hidden": true,
            })}
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{short}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Mehr erfahren
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
