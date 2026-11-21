// registry: auradata (the initials of a person or a workspace, for avatars)

/** "Ana López" → "AL", "ventas" → "V": the first letter of the first two words. */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()
}
