import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: ReadonlyArray<BreadcrumbItem>
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const trail: BreadcrumbItem[] = [{ label: "Start", href: "/" }, ...items]

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-muted-foreground",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 text-muted-foreground/60"
                  aria-hidden
                />
              ) : null}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-md px-1 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      <JsonLd
        id={`ld-breadcrumb-${trail.map((t) => t.href).join("-")}`}
        data={breadcrumbSchema(trail)}
      />
    </nav>
  )
}
