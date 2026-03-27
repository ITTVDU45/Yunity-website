"use client"

import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si"

import { LogoLoop, type LogoItem } from "@/components/LogoLoop"
import { SectionHeading } from "@/components/marketing/section-heading"
import { cn } from "@/lib/utils"

const iconClass =
  "size-[1em] text-foreground/75 transition-colors group-hover/item:text-foreground dark:text-foreground/70"

const techLogos: LogoItem[] = [
  {
    node: <SiReact className={iconClass} aria-hidden />,
    title: "React",
    href: "https://react.dev",
    ariaLabel: "React",
  },
  {
    node: <SiNextdotjs className={iconClass} aria-hidden />,
    title: "Next.js",
    href: "https://nextjs.org",
    ariaLabel: "Next.js",
  },
  {
    node: <SiTypescript className={iconClass} aria-hidden />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
    ariaLabel: "TypeScript",
  },
  {
    node: <SiTailwindcss className={iconClass} aria-hidden />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
    ariaLabel: "Tailwind CSS",
  },
]

export default function TechnologyStackContent() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading
        eyebrow="Technologie"
        title="Gebaut mit einem Stack für Performance und Klarheit"
        description="Die Website nutzt aktuelle Tools für schnelle Ladezeiten, typsichere Entwicklung und ein konsistentes Design – transparent nachvollziehbar."
        className="max-w-3xl"
      />
      <div className="relative mt-10 min-h-[5.5rem] w-full overflow-hidden md:mt-14 md:min-h-[6.5rem]">
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={56}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Technologie-Stack: React, Next.js, TypeScript, Tailwind CSS"
          className={cn(
            "max-w-full py-2",
            "[--logoloop-fadeColor:oklch(0.97_0_0)]",
            "dark:[--logoloop-fadeColor:oklch(0.18_0.02_260)]"
          )}
        />
      </div>
    </div>
  )
}
