import type { TagMap, Word } from './types'

/**
 * Serialize the in-memory store back into `data.json`'s shape — the inverse of
 * index.ts's loader. Ids are positional and regenerated on load, so they (and
 * empty Hebrew translations) are omitted. Round-trips: loading the output
 * yields the same data.
 */
export function serialize(tagLabels: TagMap, words: Word[]): string {
  const data = {
    tags: { ...tagLabels },
    words: words.map((w) => ({
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      ...(w.hebrew ? { hebrew: w.hebrew } : {}),
      tags: [...w.tags],
    })),
  }
  return JSON.stringify(data, null, 2) + '\n'
}
