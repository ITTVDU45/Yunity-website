import { Fragment } from "react"

import { cms } from "@/lib/cms/client"
import type { CollectionCard, PublicSection } from "@/lib/cms/types"
import { CmsForm } from "./cms-form"
import {
  AccordionBlock,
  ApplicantCtaBlock,
  BlogGridBlock,
  ChecklistPanelBlock,
  ContactCardsBlock,
  CtaBlock,
  HeroBlock,
  IconCardGridBlock,
  IndustryGridBlock,
  JobExamplesBlock,
  LogoLoopBlock,
  NumberedStepsBlock,
  PageHeroBlock,
  ProcessStepsBlock,
  QuoteBlock,
  RichTextBlock,
  ServiceGridBlock,
  StatisticsBlock,
  TeamCardsBlock,
  TestimonialSliderBlock,
  TextImageBlock,
} from "./blocks"

/**
 * Collection-Blöcke liefert die API bereits aufgelöst mit — die Einträge
 * stehen unter `data.items`. Der Renderer stellt hier nur sicher, dass ein
 * fehlendes oder falsch geformtes Feld zu einer leeren Liste wird.
 */
function cards(data: Record<string, unknown>): CollectionCard[] {
  return Array.isArray(data.items) ? (data.items as CollectionCard[]) : []
}

async function renderSection(
  section: PublicSection,
): Promise<React.ReactNode> {
  const { data } = section
  switch (section.type) {
    case "hero":
      return <HeroBlock data={data} />
    case "page-hero":
      return <PageHeroBlock data={data} />
    case "logo-loop":
      return <LogoLoopBlock data={data} />
    case "rich-text":
      return <RichTextBlock data={data} />
    case "text-image":
      return <TextImageBlock data={data} />
    case "icon-card-grid":
      return <IconCardGridBlock data={data} />
    case "numbered-steps":
      return <NumberedStepsBlock data={data} />
    case "process-steps":
      return <ProcessStepsBlock data={data} />
    case "checklist-panel":
      return <ChecklistPanelBlock data={data} />
    case "statistics":
      return <StatisticsBlock data={data} />
    case "accordion":
      return <AccordionBlock data={data} />
    case "job-examples":
      return <JobExamplesBlock data={data} />
    case "team-cards":
      return <TeamCardsBlock data={data} />
    case "contact-cards":
      return <ContactCardsBlock data={data} />
    case "quote":
      return <QuoteBlock data={data} />
    case "cta":
      return <CtaBlock data={data} />
    case "applicant-cta":
      return <ApplicantCtaBlock data={data} />
    case "service-grid":
      return <ServiceGridBlock data={data} cards={cards(data)} />
    case "industry-grid":
      return <IndustryGridBlock data={data} cards={cards(data)} />
    case "testimonial-slider":
      return <TestimonialSliderBlock data={data} cards={cards(data)} />
    case "blog-grid":
      return <BlogGridBlock data={data} cards={cards(data)} />
    case "form-embed": {
      const key = typeof data.formKey === "string" ? data.formKey : ""
      const definition = key ? await cms.form(key) : null
      if (!definition) {
        return null
      }
      return <CmsForm data={data} definition={definition} />
    }
    default:
      // Ein unbekannter Block darf die Seite nicht zum Absturz bringen.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[CMS] Unbekannter Blocktyp übersprungen: "${section.type}"`)
      }
      return null
  }
}

/** Rendert eine Liste veröffentlichter CMS-Sektionen in ihrer Reihenfolge. */
export async function CmsSections({ sections }: { sections: PublicSection[] }) {
  const rendered = await Promise.all(sections.map(renderSection))
  return (
    <>
      {rendered.map((node, index) => (
        <Fragment key={sections[index].id}>{node}</Fragment>
      ))}
    </>
  )
}
