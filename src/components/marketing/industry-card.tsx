"use client"

import { createElement } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { IndustryItem } from "@/lib/content/industries"
import { industryIconMap } from "@/lib/content/industry-icons"
import { cn } from "@/lib/utils"

interface IndustryCardProps {
  item: IndustryItem
  className?: string
}

export function IndustryCard({ item, className }: IndustryCardProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={cn("h-full", className)}
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-3xl border-border/80 bg-card/90 p-0 shadow-sm backdrop-blur-sm">
        {/* Bild bündig oben/seitlich: Card-Default py-4/gap-4 würde sonst Weißraum erzeugen */}
        <div className="relative z-[1] h-40 w-full shrink-0 bg-muted/40 sm:h-44">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px"
            unoptimized
            className="object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
            aria-hidden
          />
        </div>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 px-4 pb-2 pt-5 sm:px-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
            {createElement(industryIconMap[item.iconKey], {
              className: "size-5",
              "aria-hidden": true,
            })}
          </div>
          <h3 className="text-base font-semibold leading-snug">{item.title}</h3>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col space-y-3 px-4 pb-6 text-sm leading-relaxed text-muted-foreground sm:px-5">
          <p>{item.description}</p>
          <p className="mt-auto rounded-2xl border border-dashed border-border/80 bg-muted/40 p-3 text-foreground/90">
            <span className="font-medium text-foreground">Unterstützung: </span>
            {item.support}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
