export interface Word {
  /** Stable id, unique across the whole dataset. */
  id: string
  /** Chinese characters, e.g. 你好. */
  hanzi: string
  /** Pinyin pronunciation, e.g. "nǐ hǎo". */
  pinyin: string
  /** Hebrew translation. Optional — some entries don't have one yet. */
  hebrew?: string
  /** Tag keys this word carries (see TagMap for their labels). */
  tags: string[]
}

/** Map from a tag key (stable id) to its display label. */
export type TagMap = Record<string, string>

/** A tag for the filter UI: its key, display label, and word count. */
export interface Tag {
  key: string
  label: string
  count: number
}
