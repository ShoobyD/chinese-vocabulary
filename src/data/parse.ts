import type { Group, Word } from './types'

/**
 * Parse the raw vocabulary text into groups of words.
 *
 * Format:
 *  - Lines are tab-separated: Hanzi <tabs> Pinyin <tabs> [Hebrew].
 *    Extra/alignment tabs are collapsed (empty cells dropped).
 *  - Blank lines separate groups.
 *  - A line starting with `#` sets the title of the group it appears in.
 *    Groups without such a line get an auto title ("קבוצה N").
 *
 * The format is intentionally forgiving so the source `data.txt` can keep
 * being hand-edited; when it later becomes JSON, only `data/index.ts` changes.
 */
export function parse(raw: string): Group[] {
  const groups: Group[] = []
  const blocks = raw.replace(/\r\n/g, '\n').split(/\n[ \t]*\n/)

  let groupIndex = 0
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trimEnd())

    let title: string | undefined
    const words: Word[] = []

    for (const line of lines) {
      if (line.trim() === '') continue

      if (line.trimStart().startsWith('#')) {
        // Title line — use the first one found for the group.
        if (title === undefined) title = line.trim().replace(/^#+\s*/, '')
        continue
      }

      const cells = line.split('\t').map((c) => c.trim()).filter((c) => c !== '')
      if (cells.length === 0) continue

      const [hanzi, pinyin, ...rest] = cells
      const hebrew = rest.join(' ').trim()

      words.push({
        id: `${groupIndex}-${words.length}-${hanzi}`,
        hanzi,
        pinyin: pinyin ?? '',
        hebrew: hebrew !== '' ? hebrew : undefined,
        groupId: String(groupIndex),
      })
    }

    // Skip empty blocks (e.g. leading/trailing blank lines).
    if (words.length === 0) continue

    groups.push({
      id: String(groupIndex),
      title: title ?? `קבוצה ${groupIndex + 1}`,
      words,
    })
    groupIndex++
  }

  return groups
}

/** Flatten parsed groups into a single list of words. */
export function flatten(groups: Group[]): Word[] {
  return groups.flatMap((g) => g.words)
}
