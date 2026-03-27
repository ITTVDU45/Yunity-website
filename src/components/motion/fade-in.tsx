"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  )
}
