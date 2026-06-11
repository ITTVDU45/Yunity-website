"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { easeOut } from "@/lib/motion"

type Direction = "up" | "down" | "left" | "right" | "none"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  direction?: Direction
  once?: boolean
  as?: "div" | "section" | "article" | "li" | "span"
}

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance }
    case "down":
      return { x: 0, y: -distance }
    case "left":
      return { x: distance, y: 0 }
    case "right":
      return { x: -distance, y: 0 }
    case "none":
      return { x: 0, y: 0 }
  }
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 22,
  direction = "up",
  once = true,
  as = "div",
}: FadeInProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  if (reduce) {
    const StaticTag = as as React.ElementType
    return <StaticTag className={className}>{children}</StaticTag>
  }

  const offset = offsetFor(direction, distance)

  return (
    <Tag
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-48px" }}
      transition={{ duration, ease: easeOut, delay }}
    >
      {children}
    </Tag>
  )
}
