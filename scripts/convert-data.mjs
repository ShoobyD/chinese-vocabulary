// One-time migration: src/data/data.txt (group-based) -> src/data/data.json
// (tag-based). Splits the text into blocks exactly like the old parse.ts did,
// then assigns each block a tag via the BLOCKS table below (block order must
// match the parsed order). Titled blocks reuse their `# ...` title as the
// label; untitled blocks get a generated key + an inferred Hebrew label that
// can be renamed later.
//
// Usage: node scripts/convert-data.mjs
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const input = resolve(root, 'src/data/data.txt')
const output = resolve(root, 'src/data/data.json')

/**
 * One entry per non-empty block, in the order they appear in data.txt.
 * `label` for untitled blocks is inferred (marked with a trailing comment) and
 * is meant to be renamed by hand later.
 */
const BLOCKS = [
  { key: 'direction-location', label: 'כיוון ומיקום' },
  { key: 'times-of-day', label: 'זמני היום' },
  { key: 'parts-of-day', label: 'חלקי היום' },
  { key: 'pronouns', label: 'כינויי גוף' },
  { key: 'copula', label: 'אוגד (是)' }, // inferred
  { key: 'greeting-blocks', label: 'אבני בניין לברכות' },
  { key: 'function-words', label: 'מילות פונקציה וחלקיקים' },
  { key: 'classifier', label: 'קלאסיפייר' }, // inferred
  { key: 'greetings', label: 'ברכות' },
  { key: 'ke-yi', label: 'יכולת ומילים נגזרות' }, // inferred
  { key: 'polite-blocks', label: 'אבני בניין למילות נימוס' }, // inferred
  { key: 'polite-phrases', label: 'ביטויי נימוס ופרידה' }, // inferred
  { key: 'greeting-phrases', label: 'ביטויי ברכה' }, // inferred
  { key: 'numbers', label: 'מספרים' },
  { key: 'right-wrong', label: 'נכון ולא נכון' },
  { key: 'adjectives-size-age', label: 'תארים: גודל, גיל, כבוד' },
  { key: 'family-char', label: 'משפחה (家)' }, // inferred
  { key: 'whole-family', label: 'כל המשפחה' }, // inferred
  { key: 'parents', label: 'הורים' },
  { key: 'siblings', label: 'אחים ואחיות' },
  { key: 'friends', label: 'חברים' },
  { key: 'singing', label: 'שירה' }, // inferred
  { key: 'lesson-char', label: 'שיעור (课)' }, // inferred
  { key: 'transcription-syllables', label: 'תעתיק והברות' },
  { key: 'phonology', label: 'פונולוגיה: טונים והברות' },
  { key: 'great-wall', label: 'החומה הסינית' },
  { key: 'compounds-misc', label: 'מילים מורכבות נפוצות' }, // inferred
  { key: 'animals', label: 'בעלי חיים' },
  { key: 'body-parts', label: 'איברי הגוף' },
  { key: 'devices-tech', label: 'מכשירים וטכנולוגיה' },
  { key: 'qi-rise', label: 'לקום / להמריא' }, // inferred
  { key: 'chinese-language', label: 'השפה הסינית' },
  { key: 'journey-west', label: 'המסע למערב ומילים קשורות' }, // inferred
  { key: 'ma-pair', label: 'קנבס / לקלל' }, // inferred
  { key: 'interjection', label: 'מילות קריאה (啊)' }, // inferred
  { key: 'surnames', label: 'שמות משפחה' }, // inferred
  { key: 'loanwords', label: 'מילים שאולות' },
]

const raw = readFileSync(input, 'utf8')
const rawBlocks = raw.replace(/\r\n/g, '\n').split(/\n[ \t]*\n/)

// Parse each block into its words (mirrors the old parse.ts column handling).
const parsedBlocks = []
for (const block of rawBlocks) {
  const words = []
  for (const line of block.split('\n').map((l) => l.trimEnd())) {
    if (line.trim() === '') continue
    if (line.trimStart().startsWith('#')) continue // title line — ignored, label comes from BLOCKS
    const cells = line.split('\t').map((c) => c.trim()).filter((c) => c !== '')
    if (cells.length === 0) continue
    const [hanzi, pinyin, ...rest] = cells
    const hebrew = rest.join(' ').trim()
    words.push({ hanzi, pinyin: pinyin ?? '', hebrew: hebrew !== '' ? hebrew : undefined })
  }
  if (words.length > 0) parsedBlocks.push(words)
}

if (parsedBlocks.length !== BLOCKS.length) {
  console.error(
    `Block count mismatch: parsed ${parsedBlocks.length} blocks but BLOCKS has ${BLOCKS.length}. ` +
      `Update the BLOCKS table to match data.txt before converting.`,
  )
  process.exit(1)
}

const tags = {}
for (const { key, label } of BLOCKS) tags[key] = label

const words = []
parsedBlocks.forEach((blockWords, i) => {
  const tag = BLOCKS[i].key
  for (const w of blockWords) {
    const word = { hanzi: w.hanzi, pinyin: w.pinyin }
    if (w.hebrew !== undefined) word.hebrew = w.hebrew
    word.tags = [tag]
    words.push(word)
  }
})

writeFileSync(output, JSON.stringify({ tags, words }, null, 2) + '\n', 'utf8')
console.log(`Wrote ${output}: ${Object.keys(tags).length} tags, ${words.length} words.`)
