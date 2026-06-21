import data from './data.json'
import type { Tag, TagMap, Word } from './types'

// Single source of truth: hand-edited JSON with a `tags` map (key -> label)
// and a `words` list. Each word carries one or more tag keys.
export const tagLabels: TagMap = data.tags

// Generate a stable id per word from its position (matches the previous
// position-based scheme), so the JSON file itself stays free of ids to maintain.
export const allWords: Word[] = data.words.map((w, i) => ({
  id: `${i}-${w.hanzi}`,
  hanzi: w.hanzi,
  pinyin: w.pinyin,
  hebrew: 'hebrew' in w ? (w.hebrew as string) : undefined,
  tags: [...w.tags],
}))

/** All tags with their label and word count, in the `tags` map's order. */
export const tags: Tag[] = Object.entries(tagLabels).map(([key, label]) => ({
  key,
  label,
  count: allWords.reduce((n, w) => n + (w.tags.includes(key) ? 1 : 0), 0),
}))

/** Index from a Hanzi string (any length) to its entry. First occurrence wins. */
export const wordIndex = new Map<string, Word>()
for (const w of allWords) {
  if (!wordIndex.has(w.hanzi)) wordIndex.set(w.hanzi, w)
}

export interface Segment {
  text: string
  /** The matching entry, or null when no record exists for this piece. */
  word: Word | null
}

/**
 * Break a Hanzi string into the longest recorded sub-words (greedy maximal
 * matching), e.g. 一家老小 → 一家 + 老小 because both have entries. Falls back to
 * single characters where no multi-char record exists. The whole string never
 * matches itself, so a word always breaks into its constituent parts.
 */
export function segment(text: string): Segment[] {
  const chars = [...text]
  const n = chars.length
  const out: Segment[] = []
  let i = 0
  while (i < n) {
    let took = 0
    // Longest match starting at i, skipping the whole-string identity match.
    for (let len = n - i; len >= 1; len--) {
      if (i === 0 && len === n) continue
      const sub = chars.slice(i, i + len).join('')
      const word = wordIndex.get(sub)
      if (word) {
        out.push({ text: sub, word })
        took = len
        break
      }
    }
    if (took === 0) {
      out.push({ text: chars[i], word: null })
      took = 1
    }
    i += took
  }
  return out
}

export type { Tag, TagMap, Word } from './types'
