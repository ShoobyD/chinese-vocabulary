<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Word } from '@/data'
import { shuffle } from '@/utils'
import ToneContour from './ToneContour.vue'

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

/** Hanzi scale steps down with length so the tile keeps one line. */
const hanziSize = computed(() => {
  const n = current.value ? [...current.value.hanzi].length : 1
  return n <= 1 ? 'len-1' : n === 2 ? 'len-2' : n === 3 ? 'len-3' : 'len-4'
})

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
      <span v-if="deck.length" class="progress" aria-live="polite">
        כרטיס <b>{{ index + 1 }}</b> מתוך {{ deck.length }}
      </span>
      <button type="button" class="btn btn-quiet" @click="reset(true)">
        <svg class="icon" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h3.5c2 0 3 1 4.2 3l.6 1c1.2 2 2.2 3 4.2 3H17" />
          <path d="M3 14h3.5c1.2 0 2-.4 2.7-1.2M11.8 7.2c.7-.8 1.5-1.2 2.7-1.2H17" />
          <path d="M14.5 3.5 17 6l-2.5 2.5M14.5 11.5 17 14l-2.5 2.5" />
        </svg>
        ערבוב
      </button>
    </div>

    <div v-if="current" class="card-area">
      <Transition :name="'slide-' + direction" mode="out-in">
        <div class="slot" :key="index">
          <div
            class="flip"
            :class="{ 'is-flipped': flipped }"
            role="button"
            tabindex="0"
            :aria-pressed="flipped"
            aria-label="הפיכת הכרטיס"
            @click="flipped = !flipped"
            @keydown.enter.prevent="flipped = !flipped"
            @keydown.space.prevent="flipped = !flipped"
          >
            <!-- Unrevealed: the tile's jade back, the Hanzi inlaid in bone. -->
            <div class="face face-front">
              <div :class="['hanzi', 'card-hanzi', hanziSize]" lang="zh-Hans">{{ current.hanzi }}</div>
              <div class="hint">לחצו לחשיפה</div>
            </div>
            <!-- Revealed: the carved bone face; tones write in once it lands. -->
            <div class="face face-back" dir="rtl">
              <div :class="['hanzi', 'back-hanzi', `back-${hanziSize}`]" lang="zh-Hans">{{ current.hanzi }}</div>
              <ToneContour
                class="back-tones"
                :pinyin="current.pinyin"
                :hanzi="current.hanzi"
                size="lg"
                :playing="flipped"
              />
              <div class="pinyin card-pinyin" dir="ltr">{{ current.pinyin || '—' }}</div>
              <div class="hebrew card-hebrew">{{ current.hebrew ?? '—' }}</div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <p v-else class="empty">אין מילים בקבוצה זו.</p>

    <div v-if="deck.length" class="nav">
      <button type="button" class="btn" @click="go(-1)">
        <svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" /></svg>
        הקודם
      </button>
      <button type="button" class="btn btn-primary" @click="flipped = !flipped">הפיכה</button>
      <button type="button" class="btn" @click="go(1)">
        הבא
        <svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.flashcards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.toolbar {
  width: 100%;
  max-width: 30rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress {
  color: var(--ink-muted);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

.progress b {
  color: var(--ink);
  font-weight: 700;
}

/* ---------- The tile ---------- */

.card-area {
  width: min(100%, 20rem);
}

/* Perspective lives on the slot so the inner flip reads as real 3D. */
.slot {
  perspective: 1400px;
}

.flip {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  transform-style: preserve-3d;
  transition: transform var(--dur-slow) var(--ease-spring);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.flip:hover {
  transform: rotateX(5deg) translateY(-6px);
}

.flip.is-flipped {
  transform: rotateY(180deg);
}

.flip.is-flipped:hover {
  transform: rotateY(180deg) rotateX(5deg) translateY(-6px);
}

.flip:focus-visible {
  outline: none;
}

.flip:focus-visible .face {
  outline: 3px solid var(--jade-800);
  outline-offset: 6px;
}

.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-lg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.face-front {
  background: var(--jade-800);
  color: var(--bone);
  box-shadow:
    inset 0 0 0 0.6rem var(--jade-700),
    inset 0 0 0 calc(0.6rem + 1px) var(--jade-900),
    0 9px 0 var(--bone-shade),
    0 13px 0 var(--bone-deep),
    0 26px 36px rgba(7, 42, 34, 0.3);
}

.face-back {
  transform: rotateY(180deg);
  background: var(--bone);
  color: var(--ink);
  box-shadow:
    inset 0 -5px 0 var(--bone-shade),
    0 9px 0 var(--jade-800),
    0 13px 0 var(--jade-900),
    0 26px 36px rgba(7, 42, 34, 0.3);
}

.card-hanzi {
  line-height: 1.1;
  white-space: nowrap;
}

.len-1 {
  font-size: 7rem;
}

.len-2 {
  font-size: 5rem;
}

.len-3 {
  font-size: 3.5rem;
}

.len-4 {
  font-size: 2.75rem;
}

.hint {
  color: var(--on-jade-muted);
  font-size: var(--text-sm);
}

.back-hanzi {
  line-height: 1.15;
  white-space: nowrap;
}

.back-len-1 {
  font-size: 4.5rem;
}

.back-len-2 {
  font-size: 3.5rem;
}

.back-len-3 {
  font-size: 2.75rem;
}

.back-len-4 {
  font-size: 2.25rem;
}

.back-tones {
  --tone-lead: 320ms;
  margin: var(--space-1) 0;
}

.card-pinyin {
  font-size: 2rem;
  line-height: 1.2;
}

.card-hebrew {
  font-size: var(--text-xl);
  font-weight: 600;
  text-align: center;
}

/* ---------- Controls: small bone tiles; the primary one is jade ---------- */

.nav {
  display: flex;
  gap: var(--space-3);
}

.btn {
  --lift: 0px;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-5);
  border: 0;
  border-radius: var(--radius-sm);
  background: var(--bone);
  color: var(--ink);
  font-weight: 600;
  transform: translateY(calc(var(--lift) * -1));
  box-shadow:
    inset 0 -2px 0 var(--bone-shade),
    0 calc(3px + var(--lift)) 0 var(--jade-800),
    0 calc(5px + var(--lift)) 0 var(--jade-900),
    0 calc(8px + var(--lift)) 12px rgba(7, 42, 34, 0.2);
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base) var(--ease-spring);
}

.btn:hover {
  --lift: 3px;
}

.btn:active {
  --lift: -2px;
  transition-duration: var(--dur-fast);
}

.btn-primary {
  background: var(--jade-800);
  color: var(--on-jade);
  box-shadow:
    inset 0 -2px 0 var(--jade-900),
    0 calc(3px + var(--lift)) 0 var(--bone-shade),
    0 calc(5px + var(--lift)) 0 var(--bone-deep),
    0 calc(8px + var(--lift)) 12px rgba(7, 42, 34, 0.2);
}

.btn-quiet {
  min-height: 2.5rem;
  padding: 0 var(--space-3);
  background: transparent;
  color: var(--jade-800);
  box-shadow: none;
  transition: background-color var(--dur-base) var(--ease-out);
}

.btn-quiet:hover {
  --lift: 0px;
  background: var(--felt-deep);
}

.icon {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.empty {
  margin: 0;
  width: 100%;
  padding: var(--space-7) var(--space-4);
  border: 2px dashed var(--felt-deep);
  border-radius: var(--radius-lg);
  color: var(--ink-muted);
  text-align: center;
}

/* --- Slide between cards (directional). out-in: old leaves, new enters. --- */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition:
    transform var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-out);
}

.slide-next-enter-from {
  transform: translateX(60px) rotate(3deg);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-60px) rotate(-3deg);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-60px) rotate(-3deg);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(60px) rotate(3deg);
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

  .flip:hover {
    transform: none;
  }

  .flip.is-flipped:hover {
    transform: rotateY(180deg);
  }
}

@media (max-width: 640px) {
  .flashcards {
    gap: var(--space-5);
  }

  .card-area {
    width: min(100%, 17rem);
  }

  .len-1 {
    font-size: 6rem;
  }

  .nav {
    width: 100%;
  }

  .nav .btn {
    flex: 1;
    justify-content: center;
    padding: 0 var(--space-3);
  }
}
</style>

