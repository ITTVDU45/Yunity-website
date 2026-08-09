/** Escapes user-controlled text before it is embedded in a MongoDB regex. */
export function escapeRegex(value: string, maxLength = 100): string {
  return value
    .slice(0, maxLength)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
