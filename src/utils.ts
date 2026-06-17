/** Strip tone diacritics and lowercase, so "nǐ hǎo" ≈ "ni hao". */
export function normalizePinyin(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining tone marks
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/** Loose comparison for typed answers (trim + case/whitespace-insensitive). */
export function looseEqual(a: string, b: string): boolean {
  return a.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase() ===
    b.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase()
}

/** Return a new shuffled copy of the array (Fisher–Yates). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Pick up to `n` random distinct items from the array. */
export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}
