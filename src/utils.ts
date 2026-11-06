/** Strip tone diacritics and lowercase, so "nǐ hǎo" ≈ "ni hao". */
export function normalizePinyin(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining tone marks
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/** Mandarin tone of one syllable: 1 flat, 2 rising, 3 dipping, 4 falling, 0 neutral. */
export type Tone = 0 | 1 | 2 | 3 | 4

// Combining marks (after NFD) → tone number.
const TONE_MARKS: Record<string, Tone> = {
  '̄': 1, // macron  ā
  '́': 2, // acute   á
  '̌': 3, // caron   ǎ
  '̀': 4, // grave   à
}

// One pinyin syllable on toneless, lowercase letters (ü folded to u).
// Initials and finals are listed longest-first so greedy matching splits
// run-together words such as "zaoshang" → zao + shang.
const SYLLABLE =
  /(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(?:iang|iong|uang|ang|eng|ing|ong|uai|iao|ian|uan|ai|ei|ao|ou|an|en|in|un|ia|ie|iu|ua|uo|ui|ue|er|a|o|e|i|u|ng|n|m)/y

/**
 * Tone of each syllable in `pinyin`, in reading order, e.g. "zǎoshang" → [3, 0].
 * Returns null when the syllables cannot be matched one-to-one with the Hanzi,
 * so callers can simply skip drawing tone contours.
 */
export function pinyinTones(pinyin: string, hanzi: string): Tone[] | null {
  // Split into base letters, remembering which base index carries a tone mark.
  const toneAt = new Map<number, Tone>()
  let base = ''
  for (const ch of pinyin.normalize('NFD').toLowerCase()) {
    if (ch in TONE_MARKS) {
      toneAt.set(base.length - 1, TONE_MARKS[ch])
    } else if (ch === '̈') {
      // ü's diaeresis: fold to u.
    } else if (/[a-z]/.test(ch)) {
      base += ch
    } else {
      base += ' ' // separators: space, hyphen, apostrophe
    }
  }

  const tones: Tone[] = []
  let i = 0
  while (i < base.length) {
    if (base[i] === ' ') {
      i++
      continue
    }
    SYLLABLE.lastIndex = i
    const m = SYLLABLE.exec(base)
    if (!m) return null
    let tone: Tone = 0
    for (let k = i; k < i + m[0].length; k++) tone = toneAt.get(k) ?? tone
    tones.push(tone)
    i += m[0].length
  }

  const charCount = [...hanzi].filter((c) => /\p{Script=Han}/u.test(c)).length
  return tones.length === charCount ? tones : null
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

