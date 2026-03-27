import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  Construction,
  Megaphone,
  PartyPopper,
  Trophy,
  Truck,
  UtensilsCrossed,
} from "lucide-react"

export const serviceIconMap = {
  party: PartyPopper,
  megaphone: Megaphone,
  construction: Construction,
  trophy: Trophy,
  utensils: UtensilsCrossed,
  truck: Truck,
  briefcase: Briefcase,
} as const satisfies Record<string, LucideIcon>

export type ServiceIconKey = keyof typeof serviceIconMap
