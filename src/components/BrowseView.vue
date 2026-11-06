<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Word } from '@/data'
import { normalizePinyin } from '@/utils'
import { useCard } from '@/composables/useCard'
import HanziText from './HanziText.vue'
import ToneContour from './ToneContour.vue'

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
        @mouseenter="playingId = w.id"
        @mouseleave="playingId = null"
        @focus="playingId = w.id"
        @blur="playingId = null"
      >
        <span :class="['face-hanzi', hanziSize(w.hanzi)]" lang="zh-Hans">
          <HanziText :text="w.hanzi" />
        </span>
        <ToneContour :pinyin="w.pinyin" :hanzi="w.hanzi" :playing="playingId === w.id" />
        <span class="pinyin face-pinyin" dir="ltr">{{ w.pinyin }}</span>
        <span class="hebrew face-hebrew">{{ w.hebrew ?? '—' }}</span>
      </li>
    </ul>

    <p v-if="results.length === 0" class="empty">לא נמצאו תוצאות.</p>
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
  font-size: 3.25rem;
}

.len-2 {
  font-size: 2.6rem;
}

.len-3 {
  font-size: 2rem;
}

.len-4 {
  font-size: 1.6rem;
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

.empty {
  margin: 0;
  padding: var(--space-7) var(--space-4);
  border: 2px dashed var(--felt-deep);
  border-radius: var(--radius-lg);
  color: var(--ink-muted);
  text-align: center;
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

