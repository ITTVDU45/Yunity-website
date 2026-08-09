"use client"

import {
  Building2,
  Megaphone,
  Music2,
  PackageOpen,
  Sparkles,
  Trophy,
  Utensils,
} from "lucide-react"

import { LogoLoop, type LogoItem } from "@/components/LogoLoop"
import { SectionHeading } from "@/components/marketing/section-heading"
import { cn } from "@/lib/utils"

const iconClass =
  "size-[0.82em] stroke-[1.7] text-primary/75 transition-colors group-hover/item:text-primary"

const deploymentAreas: LogoItem[] = [
  {
    node: <Music2 className={iconClass} aria-hidden />,
    title: "Festivals",
    ariaLabel: "Festivals",
  },
  {
    node: <Building2 className={iconClass} aria-hidden />,
    title: "Messen & Kongresse",
    ariaLabel: "Messen und Kongresse",
  },
  {
    node: <Trophy className={iconClass} aria-hidden />,
    title: "Sportveranstaltungen",
    ariaLabel: "Sportveranstaltungen",
  },
  {
    node: <Megaphone className={iconClass} aria-hidden />,
    title: "Promotion & Roadshows",
    ariaLabel: "Promotion und Roadshows",
  },
  {
    node: <Utensils className={iconClass} aria-hidden />,
    title: "Gastronomie & Catering",
    ariaLabel: "Gastronomie und Catering",
  },
  {
    node: <PackageOpen className={iconClass} aria-hidden />,
    title: "Logistik & Aufbau",
    ariaLabel: "Logistik und Aufbau",
  },
]

/**
 * Icon-Schluessel aus dem Backend werden gegen diese geschlossene Map
 * aufgeloest. Ein unbekannter Schluessel faellt auf das Sternchen zurueck,
 * damit ein Tippfehler im CMS die Sektion nicht leert.
 */
const LOOP_ICONS = {
  music: Music2,
  building: Building2,
  trophy: Trophy,
  megaphone: Megaphone,
  utensils: Utensils,
  package: PackageOpen,
} as const

const DEFAULT_LOOP_HEADER = {
  eyebrow: "Erfahrung im Einsatz",
  title: "Dort im Einsatz, wo starke Teams den Unterschied machen",
  description:
    "Von Festivals und Messen bis zu Sportveranstaltungen, Promotion und Gastronomie: Unsere Teams unterstützen dynamische Formate zuverlässig und flexibel.",
} as const

interface TechnologyStackContentProps {
  /** Optionale CMS-Eintraege; ohne Werte bleiben die bisherigen Bereiche. */
  items?: { icon?: string; label: string }[]
  eyebrow?: string
  title?: string
  description?: string
}

export default function TechnologyStackContent({
  items,
  eyebrow,
  title,
  description,
}: TechnologyStackContentProps = {}) {
  const logos: LogoItem[] = items?.length
    ? items.map((item) => {
        const Icon =
          LOOP_ICONS[item.icon as keyof typeof LOOP_ICONS] ?? Sparkles
        return {
          node: <Icon className={iconClass} aria-hidden />,
          title: item.label,
          ariaLabel: item.label,
        }
      })
    : deploymentAreas

  return (
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading
        eyebrow={eyebrow || DEFAULT_LOOP_HEADER.eyebrow}
        title={title || DEFAULT_LOOP_HEADER.title}
        description={description || DEFAULT_LOOP_HEADER.description}
        className="max-w-3xl"
      />
      <div className="relative mt-10 min-h-[5.5rem] w-full overflow-hidden md:mt-14 md:min-h-[6.5rem]">
        <LogoLoop
          logos={logos}
          speed={80}
          direction="left"
          logoHeight={48}
          gap={64}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Einsatzbereiche: Festivals, Messen, Sportveranstaltungen, Promotion, Gastronomie und Logistik"
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
