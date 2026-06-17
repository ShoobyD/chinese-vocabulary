<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Word } from '@/data'
import { shuffle } from '@/utils'

const props = defineProps<{ words: Word[] }>()

const deck = ref<Word[]>([])
const index = ref(0)
const flipped = ref(false)
// Drives the slide direction between cards ('next' = forward, 'prev' = back).
const direction = ref<'next' | 'prev'>('next')

function reset(shuffled = false) {
  deck.value = shuffled ? shuffle(props.words) : props.words.slice()
  index.value = 0
  flipped.value = false
}

// Rebuild the deck whenever the scoped word list changes.
watch(() => props.words, () => reset(), { immediate: true })

const current = computed<Word | undefined>(() => deck.value[index.value])

function go(step: 1 | -1) {
  if (deck.value.length === 0) return
  direction.value = step === 1 ? 'next' : 'prev'
  flipped.value = false
  index.value = (index.value + step + deck.value.length) % deck.value.length
}
</script>

<template>
  <section class="flashcards">
    <div class="toolbar">
      <span class="progress" v-if="deck.length">
        {{ index + 1 }} / {{ deck.length }}
      </span>
      <button class="btn" @click="reset(true)">ערבוב 🔀</button>
    </div>

    <div v-if="current" class="card-area">
      <Transition :name="'slide-' + direction" mode="out-in">
        <div class="slot" :key="index">
          <div
            class="flip"
            :class="{ 'is-flipped': flipped }"
            role="button"
            tabindex="0"
            @click="flipped = !flipped"
            @keydown.enter.prevent="flipped = !flipped"
            @keydown.space.prevent="flipped = !flipped"
          >
            <div class="face face-front">
              <div class="hanzi card-hanzi">{{ current.hanzi }}</div>
              <div class="hint">לחצו לחשיפה</div>
            </div>
            <div class="face face-back" dir="rtl">
              <div class="pinyin card-pinyin">{{ current.pinyin || '—' }}</div>
              <div class="hebrew card-hebrew">{{ current.hebrew ?? '—' }}</div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <p v-else class="empty">אין מילים בקבוצה זו.</p>

    <div class="nav" v-if="deck.length">
      <button class="btn" @click="go(-1)">‹ הקודם</button>
      <button class="btn" @click="flipped = !flipped">הפיכה</button>
      <button class="btn" @click="go(1)">הבא ›</button>
    </div>
  </section>
</template>

<style scoped>
.flashcards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress {
  color: var(--muted);
  font-size: 0.9rem;
}

.card-area {
  width: 100%;
  max-width: 420px;
}

/* Perspective lives on the slot so the inner flip reads as real 3D. */
.slot {
  perspective: 1200px;
}

.flip {
  position: relative;
  width: 100%;
  min-height: 260px;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
  cursor: pointer;
}

.flip.is-flipped {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
  user-select: none;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.face-back {
  transform: rotateY(180deg);
}

.card-hanzi {
  font-size: 4.5rem;
  line-height: 1;
}

.card-pinyin {
  font-size: 1.5rem;
}

.card-hebrew {
  font-size: 1.4rem;
}

.hint {
  color: var(--muted);
  font-size: 0.9rem;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
}

.btn:hover {
  border-color: var(--accent);
}

.empty {
  color: var(--muted);
  padding: 2rem 0;
}

/* --- Slide between cards (directional). out-in: old leaves, new enters. --- */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.slide-next-enter-from {
  transform: translateX(60px);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(60px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .flip,
  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition: none;
  }
}
</style>
