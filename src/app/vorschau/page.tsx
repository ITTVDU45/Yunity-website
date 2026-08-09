import { notFound } from "next/navigation"

import { CmsSections } from "@/components/cms/section-renderer"
import { cms } from "@/lib/cms/client"

export const dynamic = "force-dynamic"

/**
 * Vorschau nicht veröffentlichter Inhalte über ein signiertes CMS-Token.
 * Rendert den Live-Entwurf mit demselben Renderer wie die Website.
 */
export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  if (!token) {
    notFound()
  }

  const page = await cms.preview(token)
  if (!page) {
    notFound()
  }

  return (
    <>
      <div className="bg-accent/20 px-6 py-2 text-center text-xs font-semibold uppercase tracking-widest text-primary">
        Vorschau — nicht veröffentlichter Entwurf
      </div>
      <CmsSections sections={page.sections} />
    </>
  )
}
