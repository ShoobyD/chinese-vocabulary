# Chinese Vocabulary (לימוד סינית)

A small web app for learning Chinese vocabulary, aimed at Hebrew speakers. Each
word pairs **Hanzi** (汉字), **Pinyin**, and a **Hebrew** translation. The UI is
right-to-left (RTL) and in Hebrew.

## Features

- **Browse & search** (עיון וחיפוש) — scan the full word list and filter it.
- **Flashcards** (כרטיסיות) — flip cards to test recall.
- **Quiz** (בוחן) — multiple-choice practice.
- **Group scoping** — limit any mode to a single vocabulary group (e.g. "times
  of day", "pronouns") or study everything at once.
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
  App.vue               # top bar, mode switching, group scope selector
  components/           # views (Browse/Flashcards/Quiz) and UI (cards, modal, tooltip)
  composables/          # reusable logic (useScope, useCard, useHanziTooltip)
  data/
    data.txt            # source vocabulary (hand-edited, see format below)
    parse.ts            # turns data.txt into groups of words
    types.ts            # Word / Group types
    index.ts            # loads, parses, indexes, and segments the vocabulary
  utils.ts              # shared helpers
  style.css             # global styles
```

## Editing the vocabulary

Vocabulary lives in [`src/data/data.txt`](src/data/data.txt) and is parsed by
[`src/data/parse.ts`](src/data/parse.ts). The format is intentionally forgiving
so the file can be hand-edited:

- Each word is one **tab-separated** line: `Hanzi <tab> Pinyin <tab> [Hebrew]`.
  Extra alignment tabs are collapsed, and the Hebrew column is optional.
- A **blank line** separates groups.
- A line starting with `#` sets that group's title. Groups without one get an
  auto title (`קבוצה N`).

Example:

```
# כינויי גוף
我		wǒ		אני
你		nǐ		אתה
```

Word ids are derived from group/position, so reordering entries will change
them. If the data later moves to JSON, only `src/data/index.ts` needs to change.

## Conventions

Line endings are **CRLF** and indentation uses **tabs**, enforced via
[`.editorconfig`](.editorconfig) and [`.gitattributes`](.gitattributes).
