<script setup lang="ts">
import { computed } from 'vue'
import { allWords, segment, tagLabels } from '@/data'
import type { Segment, Word } from '@/data'
import HanziText from './HanziText.vue'
import ToneContour from './ToneContour.vue'

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

    <div class="headline" lang="zh-Hans">
      <HanziText class="big" :text="word.hanzi" />
    </div>
    <!-- Remounts per word, so the contours write themselves once on open. -->
    <ToneContour :key="word.id" :pinyin="word.pinyin" :hanzi="word.hanzi" size="lg" playing />
    <p class="pinyin big-pinyin" dir="ltr">{{ word.pinyin || '—' }}</p>
    <p class="hebrew meaning">{{ word.hebrew ?? '—' }}</p>

    <section v-if="breakdown.length" class="group">
      <h3 class="group-title">פירוק לרכיבים</h3>
      <ul class="minis" dir="ltr">
        <li v-for="(p, i) in breakdown" :key="i">
          <button v-if="p.word" type="button" class="mini" @click="emit('select', p.word)">
            <span class="hanzi mini-hanzi" lang="zh-Hans">{{ p.text }}</span>
            <span class="pinyin mini-pinyin">{{ p.word.pinyin || '—' }}</span>
            <span class="hebrew mini-hebrew">{{ p.word.hebrew ?? '—' }}</span>
          </button>
          <span v-else class="mini static">
            <span class="hanzi mini-hanzi" lang="zh-Hans">{{ p.text }}</span>
            <span class="mini-hebrew">אין רשומה</span>
          </span>
        </li>
      </ul>
    </section>

    <section v-if="usedIn.length" class="group">
      <h3 class="group-title">מילים שמשתמשות בו</h3>
      <ul class="minis" dir="ltr">
        <li v-for="w in usedIn" :key="w.id">
          <button type="button" class="mini" @click="emit('select', w)">
            <span class="hanzi mini-hanzi" lang="zh-Hans">{{ w.hanzi }}</span>
            <span class="pinyin mini-pinyin">{{ w.pinyin }}</span>
          </button>
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
  margin: 0 0 var(--space-4);
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
}

.tag {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--jade-100);
  color: var(--jade-900);
  font-size: var(--text-xs);
  font-weight: 600;
}

.headline {
  display: flex;
  justify-content: center;
}

.big {
  font-size: 4.5rem;
  line-height: 1.15;
}

.big-pinyin {
  margin: var(--space-3) 0 var(--space-1);
  font-size: var(--text-xl);
}

.meaning {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 600;
}

/* ---------- Breakdown and related words, as small tiles ---------- */

.group {
  margin-top: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px solid var(--bone-shade);
}

.group-title {
  margin: 0 0 var(--space-4);
  color: var(--ink-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.minis {
  list-style: none;
  margin: 0;
  padding: 0 0 var(--space-2);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4) var(--space-3);
}

.mini {
  --lift: 0px;
  min-width: 4.5rem;
  min-height: 2.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: var(--space-2) var(--space-3);
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--bone);
  color: var(--ink);
  transform: translateY(calc(var(--lift) * -1));
  box-shadow:
    inset 0 0 0 1px var(--bone-shade),
    inset 0 -2px 0 var(--bone-shade),
    0 calc(3px + var(--lift)) 0 var(--jade-800),
    0 calc(5px + var(--lift)) 0 var(--jade-900),
    0 calc(8px + var(--lift)) 10px rgba(7, 42, 34, 0.2);
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base) var(--ease-spring);
}

button.mini:hover,
button.mini:focus-visible {
  --lift: 3px;
}

button.mini:active {
  --lift: -2px;
  transition-duration: var(--dur-fast);
}

.mini.static {
  box-shadow: inset 0 0 0 1px var(--bone-shade);
}

.mini-hanzi {
  font-size: 1.6rem;
  line-height: 1.2;
}

.mini-pinyin {
  font-size: var(--text-sm);
}

.mini-hebrew {
  direction: rtl;
  font-size: var(--text-xs);
  color: var(--ink-soft);
}
</style>

