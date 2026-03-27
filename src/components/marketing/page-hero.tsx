import { cn } from "@/lib/utils"

interface PageHeroProps {
  title: string
  description?: string
  className?: string
}

export function PageHero({ title, description, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/40 to-background pb-16 pt-28 md:pb-20 md:pt-32",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.72_0.14_195/0.15),transparent)]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
