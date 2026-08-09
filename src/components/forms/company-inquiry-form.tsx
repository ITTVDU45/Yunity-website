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

export function CompanyInquiryForm() {
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
        {state.message || "Danke für Ihre Anfrage – wir melden uns mit den nächsten Schritten."}
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="__formKey" value="company-inquiry" />
      {/* Honeypot: fuer Menschen unsichtbar, fuer Bots verlockend. */}
      <input type="text" name="__honeypot" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Unternehmen</Label>
          <Input id="company" name="company" required placeholder="Firmenname" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Ansprechperson</Label>
          <Input id="contact" name="contact" required placeholder="Name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="mail@firma.de"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+49 …" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="industry">Branche / Kontext</Label>
          <Input
            id="industry"
            name="industry"
            placeholder="z. B. Messe, Festival, Logistik-Peak"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="period">Zeitraum</Label>
          <Input id="period" name="period" placeholder="z. B. KW 12–14 / einzelner Termin" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="need">Personalbedarf</Label>
          <textarea
            id="need"
            name="need"
            required
            rows={4}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-28 w-full rounded-lg border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Rollen, Anzahl, Skills, Besonderheiten …"
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
        className="rounded-full px-8"
      >
        {pending ? "Wird gesendet …" : "Anfrage senden"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Mit Absenden stimmen Sie der Verarbeitung zu Informationszwecken zu – Details in
        der Datenschutzerklärung.
      </p>
    </form>
  )
}
