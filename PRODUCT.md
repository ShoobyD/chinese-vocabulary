# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The public: any Hebrew speaker learning Chinese vocabulary, from self-learners to course students. Used on phone and desktop equally — short practice sessions on the go as well as longer sessions at a computer.

## Product Purpose

A free web app for learning Chinese vocabulary in Hebrew. Every word pairs **Hanzi** (汉字), **Pinyin**, and a **Hebrew** translation. Success means the learner recognises and recalls words: they find a word fast, review it, and test themselves.

## Positioning

Built for Hebrew speakers from the ground up: the interface is Hebrew and right-to-left, translations are Hebrew, and the vocabulary is grouped by Hebrew-labelled tags. Character-level help (per-Hanzi tooltip, word detail modal) is part of every view.

## Operating Context

Three study modes over one vocabulary list, all scoped by the same tag filter:

- **Browse & search** (עיון וחיפוש) — scan and filter the full list.
- **Flashcards** (כרטיסיות) — flip cards to test recall.
- **Quiz** (בוחן) — multiple-choice practice.
- **Edit** (עריכה) — a dev-only vocabulary editor, excluded from production builds.

Tag filter: choosing one or more tags narrows every mode to words matching any of them; "all" studies everything.

## Capabilities and Constraints

- Vue 3 + Vite + TypeScript SPA, deployed to GitHub Pages (`https://shoobyd.github.io/chinese-vocabulary/`).
- Vocabulary is hand-edited in `src/data/data.json` (tags map + words list).
- UI is RTL Hebrew; Hanzi and Pinyin flow LTR and are isolated per element.
- Text must render Hebrew, Simplified Chinese, and Pinyin tone diacritics (ǎ ǐ ǚ ü).
- No accounts, no backend, no progress persistence.

## Brand Commitments

- Name: "לימוד סינית", with 汉语 as the Chinese mark.
- Footer credit to ShoobyD (personal site and GitHub).
- An Open Graph image exists at `public/og-image.png`, rendered from `scripts/og-image.html`.

## Evidence on Hand

- Real vocabulary in `src/data/data.json`.
- No testimonials, user counts, or learning-outcome claims exist; none may be invented.

## Product Principles

1. Recall first: every mode serves recognising and remembering a word.
2. The three scripts are equal citizens: Hanzi, Pinyin, and Hebrew are each legible and distinct.
3. Hebrew-native, not translated: RTL and Hebrew wording are the default, never an afterthought.
4. Fast on a phone: a session starts in one tap and loads quickly on mobile networks.

## Accessibility & Inclusion

Public audience on mixed devices: keyboard-operable, visible focus, AA contrast, touch targets suitable for phones, and respect for reduced-motion preferences.

