export interface StatItem {
  id: string
  value: number
  suffix?: string
  prefix?: string
  label: string
}

export const stats: StatItem[] = [
  {
    id: "pool",
    value: 850,
    suffix: "+",
    label: "Mitarbeitende im aktiven Pool",
  },
  {
    id: "time",
    value: 24,
    suffix: "h",
    label: "typische Erstreaktion auf Anfragen",
  },
  {
    id: "flex",
    value: 100,
    suffix: "%",
    label: "flexibel planbare Einsatzmodelle",
  },
]
