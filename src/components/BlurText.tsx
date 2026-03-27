"use client"

import { motion, type Easing, type Transition } from "motion/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type BlurTextProps = {
  text?: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
  direction?: "top" | "bottom"
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  easing?: Easing | Easing[]
  onAnimationComplete?: () => void
  stepDuration?: number
  as?: "p" | "h1" | "h2" | "span"
  /**
   * Nur bei `animateBy="words"`: die letzten N Wörter in einem gemeinsamen Bereich
   * mit Akzent-Unterstrich; jede Einheit behält den Blur-Effekt.
   */
  underlineLastWordCount?: number
}

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ])

  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  as: Tag = "p",
  underlineLastWordCount = 0,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("")
  const [clientReady, setClientReady] = useState(false)
  const [inView, setInView] = useState(false)
  const [underlineVisible, setUnderlineVisible] = useState(false)
  const ref = useRef<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement | null>(
    null
  )

  useEffect(() => {
    setClientReady(true)
  }, [])

  const trailingCount =
    animateBy === "words" &&
    underlineLastWordCount > 0 &&
    elements.length >= underlineLastWordCount
      ? underlineLastWordCount
      : 0

  const mainElements = trailingCount > 0 ? elements.slice(0, -trailingCount) : elements
  const trailingElements = trailingCount > 0 ? elements.slice(-trailingCount) : []

  useEffect(() => {
    setUnderlineVisible(false)
  }, [text, underlineLastWordCount])

  useEffect(() => {
    if (!clientReady) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, clientReady])

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  )

  const animateKeyframes = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [fromSnapshot, toSnapshots]
  )

  const handleLastWordAnimationComplete = useCallback(() => {
    if (trailingCount > 0) {
      requestAnimationFrame(() => setUnderlineVisible(true))
    }
    onAnimationComplete?.()
  }, [trailingCount, onAnimationComplete])

  if (!clientReady) {
    return (
      <Tag className={cn("blur-text blur-text--ssr", className, "flex flex-wrap")}>{text}</Tag>
    )
  }

  const renderMotionWord = (segment: string, globalIndex: number, addSpaceAfter: boolean) => {
    const spanTransition: Transition = {
      duration: totalDuration,
      times,
      delay: (globalIndex * delay) / 1000,
      ease: easing,
    }

    const isLastWordOverall = globalIndex === elements.length - 1

    return (
      <motion.span
        key={globalIndex}
        initial={fromSnapshot}
        animate={inView ? animateKeyframes : fromSnapshot}
        transition={spanTransition}
        onAnimationComplete={
          isLastWordOverall ? handleLastWordAnimationComplete : undefined
        }
        style={{
          display: "inline-block",
          willChange: "transform, filter, opacity",
        }}
      >
        {segment === " " ? "\u00A0" : segment}
        {animateBy === "words" && addSpaceAfter && "\u00A0"}
      </motion.span>
    )
  }

  return (
    <Tag
      ref={ref as React.Ref<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement> as never}
      className={`blur-text ${className} flex flex-wrap`}
    >
      {mainElements.map((segment, i) => {
        const globalIndex = i
        const addSpaceAfter = globalIndex < elements.length - 1
        return renderMotionWord(segment, globalIndex, addSpaceAfter)
      })}
      {trailingElements.length > 0 ? (
        <span className="relative inline-block pb-1">
          {trailingElements.map((segment, i) => {
            const globalIndex = mainElements.length + i
            const addSpaceAfter = globalIndex < elements.length - 1
            return renderMotionWord(segment, globalIndex, addSpaceAfter)
          })}
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 right-0 h-[0.35rem] origin-left rounded-full bg-accent/50 dark:bg-accent/40",
              "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none",
              underlineVisible ? "scale-x-100" : "scale-x-0"
            )}
          />
        </span>
      ) : null}
    </Tag>
  )
}
