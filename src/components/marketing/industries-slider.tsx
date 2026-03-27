"use client"

import { useState } from "react"
import { Autoplay, Pagination } from "swiper/modules"
import type { Swiper as SwiperClass } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useReducedMotion } from "framer-motion"

import { IndustryCard } from "@/components/marketing/industry-card"
import { buttonVariants } from "@/components/ui/button-variants"
import type { IndustryItem } from "@/lib/content/industries"
import { cn } from "@/lib/utils"

import "swiper/css"
import "swiper/css/pagination"

interface IndustriesSliderProps {
  items: IndustryItem[]
  /** Volle Breite ohne horizontales Padding – z. B. innerhalb einer Karte (einheitlich SSR/Client). */
  embedded?: boolean
}

export function IndustriesSlider({ items, embedded = false }: IndustriesSliderProps) {
  const reduce = useReducedMotion()
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)

  const rootClass = embedded
    ? "industries-swiper mx-auto w-full max-w-none px-0"
    : "industries-swiper mx-auto max-w-6xl px-4 sm:px-6"

  return (
    <div className={rootClass}>
      {/* Pfeile klar im Weißraum über dem Kartenblock (Abstand verhindert „Zusammenhang“ mit den Karten) */}
      <div
        className="mb-10 flex justify-end gap-2 md:mb-12"
        role="toolbar"
        aria-label="Branchen-Slider steuern"
      >
        <button
          type="button"
          aria-label="Vorherige Branchen"
          onClick={() => swiper?.slidePrev()}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "size-10 rounded-full border-border/80 bg-background shadow-sm"
          )}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Nächste Branchen"
          onClick={() => swiper?.slideNext()}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "size-10 rounded-full border-border/80 bg-background shadow-sm"
          )}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="pt-2 md:pt-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={setSwiper}
          spaceBetween={20}
          slidesPerView={1.08}
          centeredSlides={false}
          breakpoints={{
            480: { slidesPerView: 1.2, spaceBetween: 20 },
            640: { slidesPerView: 1.45, spaceBetween: 22 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 2.35, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={
            reduce
              ? false
              : {
                  delay: 4800,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }
          }
          loop={items.length > 3}
          watchOverflow
          className="!pb-10"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto">
              <IndustryCard item={item} className="h-full" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
