"use client"

import { motion, useReducedMotion } from "framer-motion"
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
          <SwiperSlide key={t.id}>
            <figure className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm md:p-10">
              <Quote
                className="size-9 text-accent/80"
                aria-hidden
              />
              <blockquote className="mt-6 text-lg leading-relaxed text-foreground md:text-xl">
                „{t.quote}“
              </blockquote>
              <figcaption className="mt-8 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{t.name}</span>
                {" · "}
                {t.role}, {t.company}
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}
