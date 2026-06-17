export interface Word {
  /** Stable id, unique across the whole dataset. */
  id: string
  /** Chinese characters, e.g. 你好. */
  hanzi: string
  /** Pinyin pronunciation, e.g. "nǐ hǎo". */
  pinyin: string
  /** Hebrew translation. Optional — some entries don't have one yet. */
  hebrew?: string
  /** Id of the group this word belongs to. */
  groupId: string
}

export interface Group {
  /** Stable id, derived from the group's position. */
  id: string
  /** Display title (from a `# ...` line in the data, or an auto fallback). */
  title: string
  words: Word[]
}
