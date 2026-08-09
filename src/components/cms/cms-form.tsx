"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionHeading } from "@/components/marketing/section-heading"
import {
  INITIAL_FORM_STATE,
  submitCmsForm,
  type FormState,
} from "@/lib/cms/actions"
import type { PublicFormDefinition, PublicFormField } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

/** Feldtypen ohne Eingabewert. */
const LAYOUT_TYPES = new Set(["heading", "paragraph", "divider"])

/** Optik der bestehenden Formulare — bewusst identische Klassen. */
const TEXTAREA_CLASS =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-32 w-full rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"

function widthClass(width: PublicFormField["width"]): string {
  return width === "FULL" ? "sm:col-span-2" : ""
}

function FieldControl({ field }: { field: PublicFormField }) {
  const id = `cms-${field.name}`
  const common = {
    id,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder || undefined,
    defaultValue: field.defaultValue ?? undefined,
  }

  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={5} className={TEXTAREA_CLASS} />
    case "select":
      return (
        <select
          {...common}
          className="border-input bg-background flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="">Bitte wählen</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case "checkbox":
    case "consent":
      return (
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            id={id}
            name={field.name}
            type="checkbox"
            required={field.required}
            className="mt-1 size-4 accent-primary"
          />
          <span>{field.label}</span>
        </label>
      )
    case "email":
      return <Input {...common} type="email" />
    case "phone":
      return <Input {...common} type="tel" />
    case "number":
      return <Input {...common} type="number" />
    case "date":
      return <Input {...common} type="date" />
    case "time":
      return <Input {...common} type="time" />
    default:
      return <Input {...common} type="text" />
  }
}

/**
 * Rendert ein im Backend gepflegtes Formular in der Optik der bestehenden
 * Yunity-Formulare. Die Übermittlung läuft über eine Server Action.
 */
export function CmsForm({
  definition,
  data,
}: {
  definition: PublicFormDefinition
  data?: Record<string, unknown>
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitCmsForm,
    INITIAL_FORM_STATE,
  )

  if (state.status === "success") {
    return (
      <p className="rounded-2xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
        {state.message || definition.successMessage}
      </p>
    )
  }

  const eyebrow = typeof data?.eyebrow === "string" ? data.eyebrow : ""
  const title = typeof data?.title === "string" ? data.title : ""
  const description =
    typeof data?.description === "string" ? data.description : ""

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {eyebrow || title || description ? (
        <SectionHeading
          eyebrow={eyebrow || undefined}
          title={title || definition.title}
          description={description || undefined}
        />
      ) : null}
      <form action={formAction} className="mt-10 space-y-5">
        <input type="hidden" name="__formKey" value={definition.key} />
        {/* Honeypot: fuer Menschen unsichtbar, fuer Bots verlockend. */}
        <input
          type="text"
          name="__honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {definition.fields.map((field) => {
            if (field.type === "divider") {
              return (
                <hr
                  key={field.id}
                  className="border-border/70 sm:col-span-2"
                  aria-hidden
                />
              )
            }
            if (LAYOUT_TYPES.has(field.type)) {
              return (
                <p
                  key={field.id}
                  className="text-sm text-muted-foreground sm:col-span-2"
                >
                  {field.label}
                </p>
              )
            }
            const isCheckbox =
              field.type === "checkbox" || field.type === "consent"
            return (
              <div
                key={field.id}
                className={cn("space-y-2", widthClass(field.width))}
              >
                {isCheckbox ? null : (
                  <Label htmlFor={`cms-${field.name}`}>
                    {field.label}
                    {field.required ? "" : " (optional)"}
                  </Label>
                )}
                <FieldControl field={field} />
                {field.helpText ? (
                  <p className="text-xs text-muted-foreground">{field.helpText}</p>
                ) : null}
              </div>
            )
          })}
        </div>

        {definition.privacyText ? (
          <p className="text-xs leading-5 text-muted-foreground">
            {definition.privacyText}
          </p>
        ) : null}

        {state.status === "error" ? (
          <p
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {state.message}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full rounded-full sm:w-auto sm:px-10"
        >
          {pending ? "Wird gesendet …" : "Nachricht senden"}
        </Button>
      </form>
    </section>
  )
}
