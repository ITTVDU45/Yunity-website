"use client"

import GradualBlur from "@/components/GradualBlur"

export function SitePageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative w-full min-h-[60vh] overflow-x-hidden pb-28">
      <div className="relative z-0 min-h-full overflow-x-hidden overflow-y-auto px-0 py-0 [scrollbar-gutter:stable]">
        {children}
      </div>
      <GradualBlur
        target="parent"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />
    </section>
  )
}
