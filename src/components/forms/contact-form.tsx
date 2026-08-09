"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  INITIAL_FORM_STATE,
  submitCmsForm,
  type FormState,
} from "@/lib/cms/actions"

export function ContactForm() {
  // Uebermittlung laeuft ueber die Server Action an die CMS-Inbox.
  // Die Feldstruktur wird im Backend gepflegt; das Markup hier bleibt
  // unveraendert, damit sich am Erscheinungsbild nichts aendert.
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitCmsForm,
    INITIAL_FORM_STATE,
  )

  if (state.status === "success") {
    return (
      <p className="rounded-2xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
        {state.message || "Vielen Dank für Ihre Nachricht – wir melden uns zeitnah."}
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="__formKey" value="contact" />
      {/* Honeypot: fuer Menschen unsichtbar, fuer Bots verlockend. */}
      <input type="text" name="__honeypot" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" name="name" required placeholder="Vor- und Nachname" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">E-Mail</Label>
          <Input
            id="c-email"
            name="email"
            type="email"
            required
            placeholder="mail@beispiel.de"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="c-phone">Telefon (optional)</Label>
          <Input id="c-phone" name="phone" type="tel" placeholder="+49 …" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="c-topic">Thema</Label>
          <Input
            id="c-topic"
            name="topic"
            placeholder="Personalanfrage, Bewerbung, Sonstiges"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="c-msg">Nachricht</Label>
          <textarea
            id="c-msg"
            name="message"
            required
            rows={5}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-32 w-full rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Wie können wir helfen?"
          />
        </div>
      </div>
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
  )
}
