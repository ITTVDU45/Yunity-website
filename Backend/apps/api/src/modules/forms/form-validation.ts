/**
 * Serverseitige Validierung von Formular-Uebermittlungen aus den
 * Felddefinitionen. Rein funktional, ohne Datenbank — isoliert testbar.
 * Clientseitige Validierung dient nur der Bedienbarkeit.
 */
import safeRegex from "safe-regex2";

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface ConditionRule {
  field: string;
  comparison: "equals" | "notEquals" | "isEmpty" | "isNotEmpty";
  value?: unknown;
}

export interface FieldConditions {
  action: "show" | "hide" | "require";
  operator: "AND" | "OR";
  rules: ConditionRule[];
}

export interface FieldDef {
  id: string;
  type: string;
  name: string;
  required: boolean;
  isEnabled: boolean;
  validation: ValidationRules;
  conditions: FieldConditions | null;
  options: { value: string; isEnabled: boolean }[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationOutcome {
  valid: boolean;
  errors: ValidationError[];
  cleaned: Record<string, unknown>;
}

/** Feldtypen ohne Eingabewert. */
const LAYOUT_TYPES = new Set(["heading", "paragraph", "divider"]);
const ARRAY_TYPES = new Set(["checkbox-group", "multiselect"]);
const CHOICE_TYPES = new Set(["select", "radio"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PATTERN_LENGTH = 256;
const MAX_PATTERN_INPUT_LENGTH = 10_000;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === "") {
    return true;
  }
  return Array.isArray(value) && value.length === 0;
}

function evalRule(rule: ConditionRule, data: Record<string, unknown>): boolean {
  const actual = data[rule.field];
  switch (rule.comparison) {
    case "equals":
      return actual === rule.value;
    case "notEquals":
      return actual !== rule.value;
    case "isEmpty":
      return isEmpty(actual);
    case "isNotEmpty":
      return !isEmpty(actual);
    default:
      return false;
  }
}

/**
 * Wertet die Sichtbarkeits-/Pflichtbedingung eines Feldes aus.
 * Ein durch Bedingungen verstecktes Feld ist weder sichtbar noch pflichtig.
 */
export function evaluateConditions(
  field: FieldDef,
  data: Record<string, unknown>,
): { visible: boolean; required: boolean } {
  if (!field.conditions || field.conditions.rules.length === 0) {
    return { visible: true, required: field.required };
  }
  const { action, operator, rules } = field.conditions;
  const results = rules.map((rule) => evalRule(rule, data));
  const matched =
    operator === "AND" ? results.every(Boolean) : results.some(Boolean);

  if (action === "show") {
    return { visible: matched, required: matched && field.required };
  }
  if (action === "hide") {
    return { visible: !matched, required: !matched && field.required };
  }
  // require
  return { visible: true, required: field.required || matched };
}

export function validateSubmission(
  fields: readonly FieldDef[],
  data: Record<string, unknown>,
): ValidationOutcome {
  const errors: ValidationError[] = [];
  const cleaned: Record<string, unknown> = {};

  for (const field of fields) {
    if (
      !field.isEnabled ||
      LAYOUT_TYPES.has(field.type) ||
      field.type === "file" // Datei-Uploads: v1 nicht unterstuetzt (uebersprungen)
    ) {
      continue;
    }

    const { visible, required } = evaluateConditions(field, data);
    if (!visible) {
      continue;
    }

    const raw = data[field.name];
    const message = field.validation.errorMessage;

    // Pflichtfeld
    if (required && isEmpty(raw)) {
      errors.push({ field: field.name, message: message ?? "Pflichtfeld." });
      continue;
    }
    if (isEmpty(raw)) {
      continue;
    }

    // Zustimmung
    if (field.type === "consent") {
      if (raw !== true) {
        if (required) {
          errors.push({
            field: field.name,
            message: message ?? "Zustimmung erforderlich.",
          });
        }
        continue;
      }
      cleaned[field.name] = true;
      continue;
    }

    // Zahl
    if (field.type === "number") {
      const num = typeof raw === "number" ? raw : Number(raw);
      if (Number.isNaN(num)) {
        errors.push({ field: field.name, message: message ?? "Ungueltige Zahl." });
        continue;
      }
      if (field.validation.min !== undefined && num < field.validation.min) {
        errors.push({ field: field.name, message: message ?? "Wert zu klein." });
        continue;
      }
      if (field.validation.max !== undefined && num > field.validation.max) {
        errors.push({ field: field.name, message: message ?? "Wert zu gross." });
        continue;
      }
      cleaned[field.name] = num;
      continue;
    }

    // Auswahl (einfach)
    if (CHOICE_TYPES.has(field.type)) {
      const allowed = field.options
        .filter((option) => option.isEnabled)
        .map((option) => option.value);
      if (!allowed.includes(String(raw))) {
        errors.push({ field: field.name, message: message ?? "Ungueltige Auswahl." });
        continue;
      }
      cleaned[field.name] = String(raw);
      continue;
    }

    // Auswahl (mehrfach)
    if (ARRAY_TYPES.has(field.type)) {
      if (!Array.isArray(raw)) {
        errors.push({ field: field.name, message: message ?? "Ungueltige Auswahl." });
        continue;
      }
      const allowed = new Set(
        field.options.filter((o) => o.isEnabled).map((o) => o.value),
      );
      const values = raw.map(String).filter((value) => allowed.has(value));
      cleaned[field.name] = values;
      continue;
    }

    // Text-artige Felder
    const text = String(raw);
    if (
      field.validation.minLength !== undefined &&
      text.length < field.validation.minLength
    ) {
      errors.push({ field: field.name, message: message ?? "Eingabe zu kurz." });
      continue;
    }
    if (
      field.validation.maxLength !== undefined &&
      text.length > field.validation.maxLength
    ) {
      errors.push({ field: field.name, message: message ?? "Eingabe zu lang." });
      continue;
    }
    if (field.type === "email" && !EMAIL_REGEX.test(text)) {
      errors.push({
        field: field.name,
        message: message ?? "Ungueltige E-Mail-Adresse.",
      });
      continue;
    }
    if (field.validation.pattern) {
      try {
        const pattern = field.validation.pattern;
        if (
          pattern.length > MAX_PATTERN_LENGTH ||
          text.length > MAX_PATTERN_INPUT_LENGTH ||
          !safeRegex(pattern) ||
          !new RegExp(pattern).test(text)
        ) {
          errors.push({
            field: field.name,
            message: message ?? "Ungueltiges Format.",
          });
          continue;
        }
      } catch {
        // Fehlerhafte Admin-Konfiguration darf die API nicht abstuerzen und
        // wird fuer die oeffentliche Eingabe geschlossen behandelt.
        errors.push({
          field: field.name,
          message: message ?? "Ungueltiges Format.",
        });
        continue;
      }
    }
    cleaned[field.name] = text;
  }

  return { valid: errors.length === 0, errors, cleaned };
}
