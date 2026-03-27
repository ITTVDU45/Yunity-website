"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CompanyInquiryForm() {
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDone(true)
  }

  if (done) {
    return (
      <p className="rounded-2xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
        Danke – das ist eine Demo-Ansicht. Anbindung an E-Mail oder CRM kann später
        ergänzt werden.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      <Button type="submit" size="lg" className="rounded-full px-8">
        Anfrage senden
      </Button>
      <p className="text-xs text-muted-foreground">
        Mit Absenden stimmen Sie der Verarbeitung zu Informationszwecken zu – Details in
        der Datenschutzerklärung.
      </p>
    </form>
  )
}
