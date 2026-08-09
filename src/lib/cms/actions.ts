"use server"

import { cms } from "./client"

export interface FormState {
  status: "idle" | "success" | "error"
  message: string
  errors: Record<string, string>
}

export const INITIAL_FORM_STATE: FormState = {
  status: "idle",
  message: "",
  errors: {},
}

/** Feldtypen ohne Wert (reine Darstellung). */
const LAYOUT_TYPES = new Set(["heading", "paragraph", "divider", "file"])
/** Feldtypen mit Mehrfachauswahl. */
const ARRAY_TYPES = new Set(["checkbox-group", "multiselect"])
/** Feldtypen mit Ja/Nein-Wert. */
const BOOL_TYPES = new Set(["checkbox", "consent"])

/**
 * Server Action: nimmt die Formulardaten entgegen, ermittelt die Feldtypen aus
 * der CMS-Definition und leitet die Übermittlung serverseitig an die CMS-API
 * weiter. Dadurch bleibt die Backend-Adresse im Browser unsichtbar und es
 * entsteht kein CORS-Fall.
 */
export async function submitCmsForm(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const key = String(formData.get("__formKey") ?? "")
  const honeypot = String(formData.get("__honeypot") ?? "")

  const definition = await cms.form(key)
  if (!definition) {
    return {
      status: "error",
      message: "Das Formular ist derzeit nicht verfügbar.",
      errors: {},
    }
  }

  const data: Record<string, unknown> = {}
  for (const field of definition.fields) {
    if (LAYOUT_TYPES.has(field.type)) {
      continue
    }
    if (BOOL_TYPES.has(field.type)) {
      data[field.name] = formData.get(field.name) !== null
    } else if (ARRAY_TYPES.has(field.type)) {
      data[field.name] = formData.getAll(field.name).map(String)
    } else {
      const value = formData.get(field.name)
      if (value !== null && value !== "") {
        data[field.name] = String(value)
      }
    }
  }

  const result = await cms.submitForm(key, { data, honeypot })
  if (result.ok) {
    return { status: "success", message: result.data.successMessage, errors: {} }
  }
  return { status: "error", message: result.message, errors: {} }
}
