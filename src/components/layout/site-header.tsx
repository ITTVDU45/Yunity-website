"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { navItems, siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  /**
   * Navigation und Markenname aus dem CMS. Ohne Werte bleibt alles wie bisher —
   * der Header ist eine Client-Komponente und bekommt beides vom Server-Layout
   * hereingereicht, statt selbst zu laden.
   */
  items?: readonly { href: string; label: string }[]
  siteName?: string
}

export function SiteHeader({ items, siteName }: SiteHeaderProps = {}) {
  const links = items?.length ? items : navItems
  const brand = siteName || siteConfig.name
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b pt-[env(safe-area-inset-top,0px)] transition-[background,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-border/70 bg-background/85 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/70"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.25rem]">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${brand} – Startseite`}
        >
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-accent shadow-sm ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5l7 9 7-9M12 14v6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {brand}
          </span>
          <span className="hidden rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground sm:inline">
            Personal
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hauptnavigation"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/kontakt"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Personal anfragen
          </Link>
          <Link href="/fuer-bewerber" className={cn(buttonVariants({ size: "sm" }))}>
            Jetzt bewerben
          </Link>
        </div>

        <div className="flex items-center lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="shrink-0"
              aria-label="Menü öffnen"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <SheetContent side="right" className="w-[min(100%,20rem)] gap-0 p-0">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="font-heading text-lg">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 p-3"
                aria-label="Mobile Navigation"
              >
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  <Link
                    href="/kontakt"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    Personal anfragen
                  </Link>
                  <Link
                    href="/fuer-bewerber"
                    className={cn(buttonVariants(), "w-full")}
                    onClick={() => setOpen(false)}
                  >
                    Jetzt bewerben
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
