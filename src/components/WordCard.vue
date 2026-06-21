<script setup lang="ts">
import { computed } from 'vue'
import { allWords, segment, tagLabels } from '@/data'
import type { Segment, Word } from '@/data'
import HanziText from './HanziText.vue'

const props = defineProps<{ word: Word }>()
const emit = defineEmits<{ (e: 'select', word: Word): void }>()

const tagLabelsForWord = computed(() =>
  props.word.tags.map((key) => tagLabels[key] ?? key),
)

// Breakdown into the longest recorded sub-words; only shown when there's more
// than one part (i.e. the word actually decomposes).
const breakdown = computed<Segment[]>(() => {
  const segs = segment(props.word.hanzi)
  return segs.length > 1 ? segs : []
})

// Other entries that contain this word/character as a part of them.
const usedIn = computed<Word[]>(() =>
  allWords.filter(
    (w) => w.id !== props.word.id && w.hanzi !== props.word.hanzi && w.hanzi.includes(props.word.hanzi),
  ),
)
</script>

<template>
  <article class="word-card" dir="rtl">
    <ul v-if="tagLabelsForWord.length" class="tags">
      <li v-for="(label, i) in tagLabelsForWord" :key="i" class="tag">{{ label }}</li>
    </ul>

    <div class="headline">
      <HanziText class="big" :text="word.hanzi" />
    </div>
    <p class="pinyin big-pinyin">{{ word.pinyin || '—' }}</p>
    <p class="hebrew meaning">{{ word.hebrew ?? '—' }}</p>

    <section v-if="breakdown.length" class="breakdown">
      <h3 class="breakdown-title">פירוק לסימניות</h3>
      <ul class="parts" dir="ltr">
        <li
          v-for="(p, i) in breakdown"
          :key="i"
          :class="['part', { clickable: p.word }]"
          @click="p.word && emit('select', p.word)"
        >
          <span class="hanzi part-hanzi">{{ p.text }}</span>
          <span class="pinyin part-pinyin">{{ p.word?.pinyin || '—' }}</span>
          <span class="hebrew part-hebrew">{{ p.word?.hebrew ?? '—' }}</span>
        </li>
      </ul>
    </section>

    <section v-if="usedIn.length" class="used-in">
      <h3 class="breakdown-title">מילים שמשתמשות בו</h3>
      <ul class="chips">
        <li
          v-for="w in usedIn"
          :key="w.id"
          class="chip"
          @click="emit('select', w)"
        >
          <span class="hanzi chip-hanzi">{{ w.hanzi }}</span>
          <span class="pinyin chip-pinyin">{{ w.pinyin }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.word-card {
  text-align: center;
}

.tags {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
}

.tag {
  color: var(--muted);
  font-size: 0.8rem;
  padding: 0.15rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
}

.headline {
  display: flex;
  justify-content: center;
}

.big {
  font-size: 4rem;
  line-height: 1.1;
}

.big-pinyin {
  font-size: 1.5rem;
  margin: 0.5rem 0 0.25rem;
}

.meaning {
  font-size: 1.4rem;
  margin: 0 0 0.5rem;
}

.breakdown {
  margin-top: 1.5rem;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.breakdown-title {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.parts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.part {
  display: grid;
  /* wide enough for multi-character segments (e.g. 一家, 老小) */
  grid-template-columns: 5rem 1fr 1fr;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}

.part.clickable {
  cursor: pointer;
}

.part.clickable:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.part-hanzi {
  font-size: 1.5rem;
}

.part-pinyin {
  text-align: center;
}

.part-hebrew {
  text-align: right;
}

.used-in {
  margin-top: 1.5rem;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

.chips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
}

.chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  cursor: pointer;
}

.chip:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.chip-hanzi {
  font-size: 1.15rem;
}

.chip-pinyin {
  font-size: 0.8rem;
}
</style>
