<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Word } from '@/data'
import { normalizePinyin } from '@/utils'
import { useCard } from '@/composables/useCard'
import HanziText from './HanziText.vue'
import ToneContour from './ToneContour.vue'
import PinyinText from './PinyinText.vue'

const props = defineProps<{ words: Word[] }>()

const { open } = useCard()

const query = ref('')

// The tile under the pointer (or keyboard focus) replays its tone contours.
const playingId = ref<string | null>(null)

const results = computed<Word[]>(() => {
  const q = query.value.trim()
  if (q === '') return props.words

  const qNorm = normalizePinyin(q)
  const qLower = q.toLowerCase()
  return props.words.filter((w) => {
    return (
      w.hanzi.includes(q) ||
      normalizePinyin(w.pinyin).includes(qNorm) ||
      (w.hebrew?.toLowerCase().includes(qLower) ?? false)
    )
  })
})

/**
 * Split a gloss from its trailing literal note, e.g.
 * "בוקר (מילולית: על הבוקר)" → ["בוקר", "(מילולית: על הבוקר)"], so the tile
 * can set the note on its own line. Glosses without one come back whole.
 */
function splitGloss(hebrew: string | undefined): [string, string | null] {
  if (!hebrew) return ['—', null]
  const m = hebrew.match(/^(.*?)\s*(\(מילולית:.*\))\s*$/)
  return m ? [m[1], m[2]] : [hebrew, null]
}

/** Hanzi scale steps down with length so every tile keeps one line. */
function hanziSize(hanzi: string): string {
  const n = [...hanzi].length
  return n <= 1 ? 'len-1' : n === 2 ? 'len-2' : n === 3 ? 'len-3' : 'len-4'
}
</script>

<template>
  <section class="browse">
    <div class="search-row">
      <label class="search">
        <svg class="search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M12.6 12.6 17 17" />
        </svg>
        <input
          v-model="query"
          type="search"
          aria-label="חיפוש מילים"
          placeholder="חיפוש בסינית, פין־יין או עברית…"
        />
      </label>
      <p class="count" aria-live="polite">{{ results.length }} פריטים</p>
    </div>

    <ul class="grid">
      <li
        v-for="w in results"
        :key="w.id"
        class="tile"
        role="button"
        tabindex="0"
        @click="open(w)"
        @keydown.enter="open(w)"
        @keydown.space.prevent="open(w)"
        @mouseenter="playingId = w.id"
        @mouseleave="playingId = null"
        @focus="playingId = w.id"
        @blur="playingId = null"
      >
        <span :class="['face-hanzi', hanziSize(w.hanzi)]" lang="zh-Hans">
          <HanziText :text="w.hanzi" nested />
        </span>
        <ToneContour :pinyin="w.pinyin" :hanzi="w.hanzi" :playing="playingId === w.id" />
        <PinyinText class="pinyin face-pinyin" :pinyin="w.pinyin" :hanzi="w.hanzi" />
        <span class="hebrew face-hebrew">
          {{ splitGloss(w.hebrew)[0] }}
          <span v-if="splitGloss(w.hebrew)[1]" class="face-literal">{{ splitGloss(w.hebrew)[1] }}</span>
        </span>
      </li>
    </ul>

    <div v-if="results.length === 0" class="empty">
      <p class="empty-text">
        לא נמצאו תוצאות<template v-if="query.trim()"> עבור <bdi class="empty-query">{{ query.trim() }}</bdi></template>.
      </p>
      <button v-if="query.trim()" type="button" class="empty-clear" @click="query = ''">ניקוי החיפוש</button>
    </div>
  </section>
</template>

<style scoped>
/* ---------- Search: a well sunk into the felt ---------- */

.search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-5);
  margin-bottom: var(--space-6);
}

.search {
  flex: 1 1 20rem;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  inset-inline-start: var(--space-4);
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: var(--ink-muted);
  stroke-width: 2;
  stroke-linecap: round;
  pointer-events: none;
}

.search input {
  width: 100%;
  min-height: 3rem;
  padding: 0 var(--space-4);
  padding-inline-start: 3rem;
  border: 1px solid var(--felt-deep);
  border-radius: var(--radius-md);
  background: var(--bone);
  font-size: var(--text-md);
  box-shadow: inset 0 2px 4px rgba(7, 42, 34, 0.12);
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.search input:hover {
  border-color: var(--bone-deep);
}

.search input:focus {
  outline: none;
  border-color: var(--jade-800);
  box-shadow:
    inset 0 2px 4px rgba(7, 42, 34, 0.12),
    0 0 0 3px var(--jade-200);
}

.count {
  margin: 0;
  color: var(--ink-muted);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

/* ---------- The tiles ---------- */

.grid {
  list-style: none;
  margin: 0;
  padding: 0 0 var(--space-3);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: var(--space-6) var(--space-5);
}

.tile {
  --lift: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--bone);
  color: var(--ink);
  text-align: center;
  cursor: pointer;
  transform: translateY(calc(var(--lift) * -1));
  box-shadow: var(--tile-depth);
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base) var(--ease-spring);
}

.tile:hover {
  --lift: 6px;
}

.tile:active {
  --lift: -3px;
  transition-duration: var(--dur-fast);
}

.tile:focus-visible {
  --lift: 6px;
  outline: 3px solid var(--jade-800);
  outline-offset: 4px;
}

.face-hanzi {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4.25rem;
  line-height: 1;
  white-space: nowrap;
}

.len-1 {
  font-size: var(--hanzi-5);
}

.len-2 {
  font-size: var(--hanzi-3);
}

.len-3 {
  font-size: var(--hanzi-2);
}

.len-4 {
  font-size: var(--hanzi-1);
}

.face-pinyin {
  margin-top: var(--space-1);
  font-size: var(--text-md);
  line-height: 1.3;
}

.face-hebrew {
  font-size: var(--text-sm);
  line-height: 1.35;
  color: var(--ink-soft);
}

/* The literal sense sits on its own quieter line under the gloss. */
.face-literal {
  display: block;
  margin-top: 0.125rem;
  font-size: var(--text-xs);
  color: var(--ink-muted);
}

/* An empty tile well pressed into the felt. */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-7) var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--felt-well);
  box-shadow: var(--well-inset);
  text-align: center;
}

.empty-text {
  margin: 0;
  color: var(--ink-soft);
  font-size: var(--text-md);
}

.empty-query {
  font-weight: 700;
  color: var(--ink);
}

.empty-clear {
  --lift: 0px;
  min-height: 2.75rem;
  padding: 0 var(--space-5);
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--jade-800);
  color: var(--on-jade);
  font-weight: 600;
  transform: translateY(calc(var(--lift) * -1));
  box-shadow:
    inset 0 -2px 0 var(--jade-900),
    0 calc(3px + var(--lift)) 0 var(--jade-950),
    0 calc(8px + var(--lift)) 12px rgba(7, 42, 34, 0.2);
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base) var(--ease-spring);
}

.empty-clear:hover {
  --lift: 3px;
}

.empty-clear:active {
  --lift: -2px;
  transition-duration: var(--dur-fast);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-5) var(--space-4);
  }

  .search-row {
    margin-bottom: var(--space-5);
  }
}
</style>

