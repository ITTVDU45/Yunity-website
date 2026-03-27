"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDone(true)
  }

  if (done) {
    return (
      <p className="rounded-2xl border border-border bg-muted/50 p-6 text-sm text-muted-foreground">
        Vielen Dank – Demo-Formular. Technischer Versand folgt bei Anbindung an Backend
        oder E-Mail-Service.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
      <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto sm:px-10">
        Nachricht senden
      </Button>
    </form>
  )
}
