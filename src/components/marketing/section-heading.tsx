"use client"

import { motion, useReducedMotion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { fadeItem, staggerContainer } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div
        className={cn(
          "mx-auto max-w-3xl space-y-4",
          align === "center" && "text-center",
          className,
        )}
      >
        {eyebrow ? (
          <Badge
            variant="secondary"
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
              align === "center" && "mx-auto",
            )}
          >
            {eyebrow}
          </Badge>
        ) : null}
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      className={cn(
        "mx-auto max-w-3xl space-y-4",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow ? (
        <motion.div variants={fadeItem} className={align === "center" ? "flex justify-center" : ""}>
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider"
          >
            {eyebrow}
          </Badge>
        </motion.div>
      ) : null}
      <motion.h2
        variants={fadeItem}
        className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          variants={fadeItem}
          className="text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  )
}
