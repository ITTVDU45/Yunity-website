import sanitizeHtml from "sanitize-html";

/** Allowlist fuer Rich-Text-Inhalte. Kein <script>, keine Event-Handler, keine js:-URLs. */
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "a",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    span: [],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    // Externe Links bekommen sichere rel-Attribute erzwungen.
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
    }),
  },
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS);
}

/** Felder, deren String-Werte als HTML behandelt und bereinigt werden. */
const HTML_FIELDS = new Set(["body", "answer"]);

/**
 * Geht die Inhaltsdaten einer Sektion rekursiv durch und bereinigt alle als
 * HTML gedachten Felder. Andere Strings bleiben unveraendert (das Frontend
 * rendert sie als Text; React maskiert sie).
 */
export function sanitizeBlockData(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((entry) => sanitizeBlockData(entry));
  }
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => {
        if (HTML_FIELDS.has(key) && typeof value === "string") {
          return [key, sanitizeRichText(value)];
        }
        return [key, sanitizeBlockData(value)];
      }),
    );
  }
  return data;
}
