import raw from '@/data.txt?raw'
import { flatten, parse } from './parse'
import type { Group, Word } from './types'

// Single source of truth. When data.txt becomes a JSON file, swap the import
// above for `import groups from '@/data.json'` and drop the parse() call.
export const groups = parse(raw)
export const allWords = flatten(groups)

/** Group lookup by id (used to show a word's lesson title). */
export const groupById = new Map<string, Group>(groups.map((g) => [g.id, g]))

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

export type { Group, Word } from './types'
