"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FaqItem } from "@/lib/content/faqs"

interface FaqAccordionProps {
  items: FaqItem[]
  className?: string
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  return (
    <Accordion
      className={className}
      defaultValue={items[0] ? [items[0].id] : undefined}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left text-base">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
