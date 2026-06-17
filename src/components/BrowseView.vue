<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Word } from '@/data'
import { normalizePinyin } from '@/utils'
import { useCard } from '@/composables/useCard'
import HanziText from './HanziText.vue'

const props = defineProps<{ words: Word[] }>()

const { open } = useCard()

const query = ref('')

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
</script>

<template>
  <section>
    <input
      v-model="query"
      class="search"
      type="search"
      placeholder="חיפוש בסינית, פין־יין או עברית…"
    />

    <p class="count">{{ results.length }} פריטים</p>

    <ul class="list" dir="ltr">
      <li
        v-for="w in results"
        :key="w.id"
        class="row"
        role="button"
        tabindex="0"
        @click="open(w)"
        @keydown.enter="open(w)"
      >
        <HanziText class="cell-hanzi" :text="w.hanzi" />
        <span class="pinyin cell-pinyin">{{ w.pinyin }}</span>
        <span class="hebrew cell-hebrew">{{ w.hebrew ?? '—' }}</span>
      </li>
    </ul>

    <p v-if="results.length === 0" class="empty">לא נמצאו תוצאות.</p>
  </section>
</template>

<style scoped>
.search {
  width: 100%;
  font: inherit;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.count {
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0.6rem 0;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.row {
  display: grid;
  /* Three equal columns for even spacing across the row. */
  grid-template-columns: 1fr 1fr 1fr;
  align-items: baseline;
  column-gap: 1rem;
  row-gap: 0.75rem;
  padding: 0.7rem 1.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}

.row:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.cell-hanzi {
  font-size: 1.5rem;
}

.cell-pinyin {
  text-align: center;
}

.cell-hebrew {
  text-align: right;
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 2rem 0;
}
</style>
