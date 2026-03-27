import type { LucideIcon } from "lucide-react"
import {
  Building2,
  Clock,
  Factory,
  LineChart,
  Megaphone,
  PartyPopper,
  Pizza,
  Tent,
  Truck,
  Users,
} from "lucide-react"

export const industryIconMap = {
  party: PartyPopper,
  tent: Tent,
  building: Building2,
  megaphone: Megaphone,
  chart: LineChart,
  pizza: Pizza,
  users: Users,
  truck: Truck,
  factory: Factory,
  clock: Clock,
} as const satisfies Record<string, LucideIcon>

export type IndustryIconKey = keyof typeof industryIconMap
