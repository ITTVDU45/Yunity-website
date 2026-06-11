import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

interface PageHeroAction {
  label: string
  href: string
}

interface PageHeroProps {
  title: string
  description?: string
  eyebrow?: string
  imageSrc?: string
  imageAlt?: string
  primaryAction?: PageHeroAction
  secondaryAction?: PageHeroAction
  highlights?: readonly string[]
  className?: string
}

export function PageHero({
  title,
  description,
  eyebrow,
  imageSrc,
  imageAlt = "",
  primaryAction,
  secondaryAction,
  highlights,
  className,
}: PageHeroProps) {
  const hasImage = Boolean(imageSrc)

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-primary/[0.06] bg-gradient-to-b from-sky-50/70 via-background to-background py-8 md:py-12",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_right,oklch(0.82_0.14_190/0.22),transparent_52%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "relative overflow-hidden rounded-[2rem] bg-[oklch(0.985_0.012_95)] shadow-[0_24px_70px_-42px_oklch(0.28_0.08_245/0.45)] ring-1 ring-primary/[0.07] md:rounded-[3rem]",
            hasImage ? "grid lg:grid-cols-[1.04fr_0.96fr]" : "text-center"
          )}
        >
          <div
            className={cn(
              "relative z-10 flex flex-col justify-center px-7 py-12 sm:px-10 md:px-14 md:py-16 lg:px-16",
              !hasImage && "mx-auto max-w-4xl"
            )}
          >
            {eyebrow ? (
              <div
                className={cn(
                  "mb-6 flex",
                  !hasImage && "justify-center"
                )}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm ring-1 ring-primary/10">
                  <Sparkles className="size-3.5 text-accent" aria-hidden />
                  {eyebrow}
                </span>
              </div>
            ) : null}
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] text-primary sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description ? (
              <p
                className={cn(
                  "mt-6 max-w-2xl text-pretty text-base leading-7 text-primary/70 sm:text-lg",
                  !hasImage && "mx-auto"
                )}
              >
                {description}
              </p>
            ) : null}
            {primaryAction || secondaryAction ? (
              <div
                className={cn(
                  "mt-8 flex flex-wrap gap-3",
                  !hasImage && "justify-center"
                )}
              >
                {primaryAction ? (
                  <Link
                    href={primaryAction.href}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group rounded-full px-7"
                    )}
                  >
                    {primaryAction.label}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                ) : null}
                {secondaryAction ? (
                  <Link
                    href={secondaryAction.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "rounded-full border-primary/15 bg-white/60 px-7 hover:bg-white"
                    )}
                  >
                    {secondaryAction.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
            {highlights?.length ? (
              <div
                className={cn(
                  "mt-9 flex flex-wrap gap-2",
                  !hasImage && "justify-center"
                )}
              >
                {highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-primary/[0.06] px-3 py-1.5 text-xs font-medium text-primary/70"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {imageSrc ? (
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[560px]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[oklch(0.985_0.012_95)]/15 lg:to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/85 p-4 text-sm font-medium text-primary shadow-lg backdrop-blur-md sm:left-auto sm:max-w-xs">
                Personal, das vorbereitet ankommt und im Einsatz überzeugt.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
