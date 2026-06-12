"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { Quote } from "lucide-react"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import type { Testimonial } from "@/lib/content/testimonials"

import "swiper/css"
import "swiper/css/pagination"

interface TestimonialSliderProps {
  items: Testimonial[]
}

export function TestimonialSlider({ items }: TestimonialSliderProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-6"
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={
          reduce
            ? false
            : { delay: 5200, disableOnInteraction: true, pauseOnMouseEnter: true }
        }
        className="!pb-12"
      >
        {items.map((t) => (
          <SwiperSlide key={t.id} className="!h-auto">
            <figure className="grid h-full overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm md:min-h-[360px] md:grid-cols-[minmax(240px,0.9fr)_minmax(0,1.45fr)]">
              <div className="relative min-h-[260px] overflow-hidden bg-muted md:min-h-full">
                <Image
                  src={t.imageSrc}
                  alt={t.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"
                  aria-hidden
                />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-9 md:p-11">
                <Quote className="size-9 text-accent/80" aria-hidden />
                <blockquote className="mt-6 text-lg leading-relaxed text-foreground md:text-xl">
                  „{t.quote}“
                </blockquote>
                <figcaption className="mt-8 border-t border-border/70 pt-5">
                  <span className="block font-semibold text-foreground">{t.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {t.role} · {t.company}
                  </span>
                </figcaption>
              </div>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}
