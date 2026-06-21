# Chinese Vocabulary (לימוד סינית)

A small web app for learning Chinese vocabulary, aimed at Hebrew speakers. Each
word pairs **Hanzi** (汉字), **Pinyin**, and a **Hebrew** translation. The UI is
right-to-left (RTL) and in Hebrew.

## Features

- **Browse & search** (עיון וחיפוש) — scan the full word list and filter it.
- **Flashcards** (כרטיסיות) — flip cards to test recall.
- **Quiz** (בוחן) — multiple-choice practice.
- **Tag filtering** — limit any mode to one or more tags (e.g. "times of day",
  "pronouns"); words matching any selected tag are shown, or study everything at
  once.
- **Hanzi helpers** — per-character tooltips and a word detail modal.

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>` SFCs)
- [Vite](https://vite.dev/) for dev server and build
- [TypeScript](https://www.typescriptlang.org/) (type-checked builds via `vue-tsc`)

## Getting started

Requires [Node.js](https://nodejs.org/) (18+ recommended).

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production into dist/
npm run preview  # preview the production build locally
```

## Project structure

```
index.html              # app entry HTML
src/
  main.ts               # bootstraps the Vue app
  App.vue               # top bar, mode switching, tag filter chips
  components/           # views (Browse/Flashcards/Quiz) and UI (cards, modal, tooltip)
  composables/          # reusable logic (useScope, useCard, useHanziTooltip)
  data/
    data.json           # source vocabulary (hand-edited, see format below)
    types.ts            # Word / Tag types
    index.ts            # loads, indexes, and segments the vocabulary
  utils.ts              # shared helpers
  style.css             # global styles
scripts/
  convert-data.mjs      # one-time migration that produced data.json from the old data.txt
```

## Editing the vocabulary

Vocabulary lives in [`src/data/data.json`](src/data/data.json), hand-edited
directly. It has two parts:

- `tags` — a map from a stable tag **key** to its display **label** (the label
  is what shows in the UI; the key is what words reference). Filter chips appear
  in the order keys are listed here.
- `words` — a list of entries. Each has `hanzi`, `pinyin`, an optional `hebrew`
  translation, and a `tags` array of one or more tag keys.

Example:

```json
{
  "tags": { "pronouns": "כינויי גוף" },
  "words": [
    { "hanzi": "我", "pinyin": "wǒ", "hebrew": "אני", "tags": ["pronouns"] },
    { "hanzi": "你", "pinyin": "nǐ", "hebrew": "אתה", "tags": ["pronouns"] }
  ]
}
```

A word may carry several tags. Word ids are derived from list position at load
time (`src/data/index.ts`), so reordering entries will change them.

The data was originally a tab-separated `data.txt` grouped by blank lines;
[`scripts/convert-data.mjs`](scripts/convert-data.mjs) performed the one-time
migration to this tag-based JSON.

## Conventions

Line endings are **CRLF** and indentation uses **tabs**, enforced via
[`.editorconfig`](.editorconfig) and [`.gitattributes`](.gitattributes).
