interface JsonLdProps {
  data: Record<string, unknown> | ReadonlyArray<Record<string, unknown>>
  id?: string
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
