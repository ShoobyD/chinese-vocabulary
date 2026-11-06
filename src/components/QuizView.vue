<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Word } from '@/data'
import { looseEqual, normalizePinyin, sample, shuffle } from '@/utils'
import ToneContour from './ToneContour.vue'
import PinyinText from './PinyinText.vue'

const props = defineProps<{ words: Word[] }>()

type Field = 'hanzi' | 'pinyin' | 'hebrew'
type QuizType = 'mc' | 'typed'

interface Direction {
  id: string
  label: string
  prompt: Field
  answer: Field
}

const directions: Direction[] = [
  { id: 'hanzi-hebrew', label: 'סינית ← עברית', prompt: 'hanzi', answer: 'hebrew' },
  { id: 'hebrew-hanzi', label: 'עברית ← סינית', prompt: 'hebrew', answer: 'hanzi' },
  { id: 'hanzi-pinyin', label: 'סינית ← פין־יין', prompt: 'hanzi', answer: 'pinyin' },
  { id: 'pinyin-hanzi', label: 'פין־יין ← סינית', prompt: 'pinyin', answer: 'hanzi' },
  { id: 'hebrew-pinyin', label: 'עברית ← פין־יין', prompt: 'hebrew', answer: 'pinyin' },
  { id: 'pinyin-hebrew', label: 'פין־יין ← עברית', prompt: 'pinyin', answer: 'hebrew' },
]

const direction = ref<Direction>(directions[0])
const quizType = ref<QuizType>('mc')

function field(w: Word, f: Field): string {
  return f === 'hebrew' ? (w.hebrew ?? '') : w[f]
}

// Words usable for the current direction need both prompt and answer fields.
const eligible = computed<Word[]>(() =>
  props.words.filter(
    (w) => field(w, direction.value.prompt) !== '' && field(w, direction.value.answer) !== '',
  ),
)

const queue = ref<Word[]>([])
const qIndex = ref(0)
const score = ref(0)
const answered = ref(0)
const submitted = ref(false)
const typedAnswer = ref('')
const picked = ref<string | null>(null)

function start() {
  queue.value = shuffle(eligible.value)
  qIndex.value = 0
  score.value = 0
  answered.value = 0
  resetQuestion()
}

function resetQuestion() {
  submitted.value = false
  typedAnswer.value = ''
  picked.value = null
}

// Restart whenever the scope, direction or quiz type changes.
watch([() => props.words, direction, quizType], () => start(), { immediate: true })

const current = computed<Word | undefined>(() => queue.value[qIndex.value])
const finished = computed(() => queue.value.length > 0 && qIndex.value >= queue.value.length)

const correctAnswer = computed(() =>
  current.value ? field(current.value, direction.value.answer) : '',
)

// Multiple-choice options: correct answer + up to 3 distinct distractors.
const options = computed<string[]>(() => {
  if (quizType.value !== 'mc' || !current.value) return []
  const correct = correctAnswer.value
  const pool = eligible.value
    .filter((w) => w.id !== current.value!.id)
    .map((w) => field(w, direction.value.answer))
    .filter((v) => v !== '' && v !== correct)
  const distractors = sample([...new Set(pool)], 3)
  return shuffle([correct, ...distractors])
})

function isCorrect(value: string): boolean {
  if (direction.value.answer === 'pinyin') {
    return normalizePinyin(value) === normalizePinyin(correctAnswer.value)
  }
  return looseEqual(value, correctAnswer.value)
}

function submitTyped() {
  if (submitted.value || !current.value) return
  submitted.value = true
  answered.value++
  if (isCorrect(typedAnswer.value)) score.value++
}

function pick(option: string) {
  if (submitted.value) return
  picked.value = option
  submitted.value = true
  answered.value++
  if (isCorrect(option)) score.value++
}

function nextQuestion() {
  qIndex.value++
  resetQuestion()
}

const lastCorrect = computed(() =>
  isCorrect(quizType.value === 'typed' ? typedAnswer.value : (picked.value ?? '')),
)

/** Prompt scale steps down with length so the tile keeps its shape. */
const promptSize = computed(() => {
  if (!current.value) return ''
  const text = field(current.value, direction.value.prompt)
  if (direction.value.prompt !== 'hanzi') return text.length > 14 ? 'long' : ''
  const n = [...text].length
  return n <= 1 ? 'len-1' : n === 2 ? 'len-2' : n === 3 ? 'len-3' : 'len-4'
})
</script>

<template>
  <section class="quiz">
    <div class="config">
      <label class="field">
        <span class="field-label">כיוון</span>
        <span class="select">
          <select v-model="direction">
            <option v-for="d in directions" :key="d.id" :value="d">{{ d.label }}</option>
          </select>
        </span>
      </label>
      <label class="field">
        <span class="field-label">סוג</span>
        <span class="select">
          <select v-model="quizType">
            <option value="mc">רב־ברירה</option>
            <option value="typed">הקלדה</option>
          </select>
        </span>
      </label>
      <p class="score" aria-live="polite">
        ניקוד
        <b :key="score" class="score-num">{{ score }}</b>
        <span class="score-of">/ {{ answered }}</span>
      </p>
    </div>

    <p v-if="eligible.length === 0" class="empty">
      אין מספיק מילים עם השדות הדרושים לכיוון זה.
    </p>

    <div v-else-if="finished" class="done">
      <p class="done-title">סיימת!</p>
      <p class="score-big"><b>{{ score }}</b> / {{ answered }}</p>
      <button type="button" class="btn primary" @click="start">מבחן חדש</button>
    </div>

    <div v-else-if="current" class="question">
      <!-- The question as a tile; once answered it turns over the whole word. -->
      <div class="prompt-col">
        <div class="counter">שאלה <b>{{ qIndex + 1 }}</b> מתוך {{ queue.length }}</div>
        <div :class="['prompt', { revealed: submitted }]">
          <div
            :class="['prompt-text', promptSize, {
              hebrew: direction.prompt === 'hebrew',
              hanzi: direction.prompt === 'hanzi',
              pinyin: direction.prompt === 'pinyin',
            }]"
            :lang="direction.prompt === 'hanzi' ? 'zh-Hans' : undefined"
            :dir="direction.prompt === 'hebrew' ? 'rtl' : 'ltr'"
          >
            <PinyinText v-if="direction.prompt === 'pinyin'" :pinyin="current.pinyin" :hanzi="current.hanzi" />
            <template v-else>{{ field(current, direction.prompt) }}</template>
          </div>

          <div v-if="submitted" class="reveal">
            <span v-if="direction.prompt !== 'hanzi'" class="hanzi reveal-hanzi" lang="zh-Hans">{{ current.hanzi }}</span>
            <ToneContour :pinyin="current.pinyin" :hanzi="current.hanzi" size="lg" playing />
            <PinyinText
              v-if="direction.prompt !== 'pinyin'"
              class="pinyin reveal-pinyin"
              :pinyin="current.pinyin"
              :hanzi="current.hanzi"
            />
            <span v-if="direction.prompt !== 'hebrew' && current.hebrew" class="hebrew reveal-hebrew">{{ current.hebrew }}</span>
          </div>
        </div>
      </div>

      <div class="answer-col">
        <!-- Multiple choice -->
        <div v-if="quizType === 'mc'" class="options">
          <button
            v-for="opt in options"
            :key="opt"
            type="button"
            :class="[
              'option',
              {
                hebrew: direction.answer === 'hebrew',
                hanzi: direction.answer === 'hanzi',
                pinyin: direction.answer === 'pinyin',
                correct: submitted && isCorrect(opt),
                wrong: submitted && picked === opt && !isCorrect(opt),
                faded: submitted && !isCorrect(opt) && picked !== opt,
              },
            ]"
            :lang="direction.answer === 'hanzi' ? 'zh-Hans' : undefined"
            :dir="direction.answer === 'hebrew' ? 'rtl' : 'ltr'"
            :disabled="submitted"
            @click="pick(opt)"
          >
            <span class="option-text">{{ opt }}</span>
            <svg v-if="submitted && isCorrect(opt)" class="mark" viewBox="0 0 20 20" aria-label="נכון">
              <path d="M4.5 10.5 8.5 14.5 15.5 6" />
            </svg>
            <svg v-else-if="submitted && picked === opt" class="mark" viewBox="0 0 20 20" aria-label="לא נכון">
              <path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" />
            </svg>
          </button>
        </div>

        <!-- Typed -->
        <form v-else class="typed" @submit.prevent="submitTyped">
          <input
            v-model="typedAnswer"
            :class="['answer-input', {
              hebrew: direction.answer === 'hebrew',
              correct: submitted && lastCorrect,
              wrong: submitted && !lastCorrect,
            }]"
            :disabled="submitted"
            :dir="direction.answer === 'hebrew' ? 'rtl' : 'ltr'"
            aria-label="התשובה שלכם"
            placeholder="הקלידו תשובה…"
            autofocus
          />
          <button v-if="!submitted" class="btn primary" type="submit">בדיקה</button>
        </form>

        <div v-if="submitted" :class="['feedback', lastCorrect ? 'is-good' : 'is-bad']">
          <p v-if="quizType === 'typed' || picked !== null" class="verdict" role="status">
            <template v-if="lastCorrect">
              <svg class="mark" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5 8.5 14.5 15.5 6" /></svg>
              נכון!
            </template>
            <template v-else>
              <svg class="mark" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" /></svg>
              <span>לא נכון. התשובה: <strong>{{ correctAnswer }}</strong></span>
            </template>
          </p>
          <button type="button" class="btn primary" @click="nextQuestion">
            הבא
            <svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" /></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quiz {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* ---------- Settings row ---------- */

.config {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-4) var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field-label {
  color: var(--ink-muted);
  font-size: var(--text-xs);
  font-weight: 600;
}

.select {
  position: relative;
  display: inline-flex;
}

/* Chevron drawn as a background so the native select keeps its behaviour. */
.select select {
  appearance: none;
  min-height: 2.75rem;
  min-width: 10rem;
  padding: 0 var(--space-4);
  padding-inline-end: 2.5rem;
  border: 1px solid var(--felt-deep);
  border-radius: var(--radius-md);
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%235d574b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      no-repeat left 0.9rem center / 1rem,
    var(--bone);
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 2px 4px rgba(7, 42, 34, 0.1);
  transition: border-color var(--dur-base) var(--ease-out);
}

.select select:hover {
  border-color: var(--bone-deep);
}

.select select:focus-visible {
  outline: 2px solid var(--jade-800);
  outline-offset: 2px;
}

.score {
  margin: 0;
  margin-inline-start: auto;
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  color: var(--ink-muted);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

.score-num {
  display: inline-block;
  color: var(--jade-800);
  font-size: var(--text-xl);
  font-weight: 700;
  animation: pop var(--dur-base) var(--ease-out);
}

.score-of {
  font-size: var(--text-md);
}

@keyframes pop {
  0% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

/* ---------- Question ---------- */

.question {
  display: grid;
  grid-template-columns: minmax(16rem, 22rem) 1fr;
  gap: var(--space-7);
  align-items: start;
}

.counter {
  margin-bottom: var(--space-3);
  color: var(--ink-muted);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

.counter b {
  color: var(--ink);
}

.prompt {
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-lg);
  background: var(--bone);
  text-align: center;
  box-shadow:
    inset 0 -5px 0 var(--bone-shade),
    0 9px 0 var(--jade-800),
    0 13px 0 var(--jade-900),
    0 26px 36px rgba(7, 42, 34, 0.26);
}

.prompt-text {
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.prompt-text.long {
  font-size: var(--text-xl);
}

.prompt-text.hanzi {
  white-space: nowrap;
}

.prompt-text.len-1 {
  font-size: var(--hanzi-9);
}

.prompt-text.len-2 {
  font-size: var(--hanzi-7);
}

.prompt-text.len-3 {
  font-size: var(--hanzi-5);
}

.prompt-text.len-4 {
  font-size: var(--hanzi-3);
}

.reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--bone-shade);
  width: 100%;
  animation: rise var(--dur-slow) var(--ease-out);
}

.reveal-hanzi {
  font-size: var(--hanzi-3);
  line-height: 1.2;
}

.reveal-pinyin {
  font-size: var(--text-lg);
}

.reveal-hebrew {
  font-size: var(--text-md);
  font-weight: 600;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ---------- Answers: tiles that lift, press, and hold their verdict ---------- */

.answer-col {
  padding-top: calc(var(--space-3) + 1.3rem);
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5) var(--space-4);
}

.option {
  --lift: 0px;
  position: relative;
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--bone);
  color: var(--ink);
  font-size: var(--text-lg);
  font-weight: 600;
  text-align: center;
  transform: translateY(calc(var(--lift) * -1));
  box-shadow: var(--tile-depth);
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base) var(--ease-spring),
    background-color var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-out);
}

.option.hanzi {
  font-size: var(--hanzi-2);
}

.option.pinyin {
  color: var(--ink-soft);
}

.option:not(:disabled):hover {
  --lift: 5px;
}

.option:not(:disabled):active {
  --lift: -3px;
  transition-duration: var(--dur-fast);
}

.option:disabled {
  cursor: default;
}

.option.correct {
  --lift: 3px;
  background: var(--verdict-good-fill);
  color: var(--carve-green);
  box-shadow:
    inset 0 0 0 2px var(--carve-green),
    0 calc(5px + var(--lift)) 0 var(--carve-green),
    0 calc(8px + var(--lift)) 0 var(--verdict-good-deep),
    0 calc(12px + var(--lift) * 2) 18px rgba(7, 42, 34, 0.24);
  animation: land 420ms var(--ease-spring);
}

.option.wrong {
  --lift: -3px;
  background: var(--verdict-bad-fill);
  color: var(--carve-red);
  box-shadow:
    inset 0 0 0 2px var(--carve-red),
    0 calc(5px + var(--lift)) 0 var(--carve-red),
    0 calc(8px + var(--lift)) 0 var(--verdict-bad-deep),
    0 6px 10px rgba(7, 42, 34, 0.18);
  animation: shake 380ms var(--ease-out);
}

/* Hanzi glyphs never take a carving ink (those mean tones); the fill, edge
   and icon carry the verdict instead. */
.option.hanzi.correct,
.option.hanzi.wrong {
  color: var(--ink);
}

/* Pinyin answers keep the neutral pinyin ink through a verdict too. */
.option.pinyin.correct,
.option.pinyin.wrong {
  color: var(--ink-soft);
}

.option.correct .mark {
  color: var(--carve-green);
}

.option.wrong .mark {
  color: var(--carve-red);
}

.option.faded {
  opacity: 0.5;
}

@keyframes land {
  0% {
    transform: translateY(-14px);
  }
  100% {
    transform: translateY(-3px);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translate(0, 3px);
  }
  25% {
    transform: translate(-6px, 3px);
  }
  50% {
    transform: translate(5px, 3px);
  }
  75% {
    transform: translate(-3px, 3px);
  }
}

.mark {
  flex: 0 0 auto;
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- Typed answer ---------- */

.typed {
  display: flex;
  gap: var(--space-3);
}

.answer-input {
  flex: 1;
  min-width: 0;
  min-height: 3.25rem;
  padding: 0 var(--space-4);
  border: 1px solid var(--felt-deep);
  border-radius: var(--radius-md);
  background: var(--bone);
  font-size: var(--text-lg);
  box-shadow: inset 0 2px 4px rgba(7, 42, 34, 0.12);
  transition:
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.answer-input:focus {
  outline: none;
  border-color: var(--jade-800);
  box-shadow:
    inset 0 2px 4px rgba(7, 42, 34, 0.12),
    0 0 0 3px var(--jade-200);
}

.answer-input.correct {
  border-color: var(--carve-green);
  box-shadow: inset 0 0 0 1px var(--carve-green);
  background: var(--verdict-good-fill);
}

.answer-input.wrong {
  border-color: var(--carve-red);
  box-shadow: inset 0 0 0 1px var(--carve-red);
  background: var(--verdict-bad-fill);
  animation: shake 380ms var(--ease-out);
}

/* ---------- Feedback ---------- */

.feedback {
  margin-top: var(--space-6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  animation: rise var(--dur-base) var(--ease-out);
}

.verdict {
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-md);
  font-weight: 600;
}

.is-good .verdict {
  color: var(--carve-green);
}

.is-bad .verdict {
  color: var(--carve-red);
}

.verdict strong {
  color: var(--ink);
}

/* ---------- Buttons ---------- */

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
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base) var(--ease-spring);
}

.btn.primary {
  background: var(--jade-800);
  color: var(--on-jade);
  box-shadow:
    inset 0 -2px 0 var(--jade-900),
    0 calc(3px + var(--lift)) 0 var(--bone-shade),
    0 calc(5px + var(--lift)) 0 var(--bone-deep),
    0 calc(8px + var(--lift)) 12px rgba(7, 42, 34, 0.2);
}

.btn:hover {
  --lift: 3px;
}

.btn:active {
  --lift: -2px;
  transition-duration: var(--dur-fast);
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

/* ---------- End and empty ---------- */

.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-7) var(--space-4);
  text-align: center;
}

.done-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 700;
}

.score-big {
  margin: 0 0 var(--space-3);
  color: var(--ink-muted);
  font-size: 2rem;
  font-variant-numeric: tabular-nums;
}

.score-big b {
  color: var(--jade-800);
  font-size: 4rem;
}

.empty {
  margin: 0;
  padding: var(--space-7) var(--space-4);
  /* An empty tile well pressed into the felt, as in Browse. */
  border-radius: var(--radius-lg);
  background: var(--felt-well);
  box-shadow: var(--well-inset);
  color: var(--ink-soft);
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .score-num,
  .reveal,
  .feedback,
  .option.correct,
  .option.wrong,
  .answer-input.wrong {
    animation: none;
  }
}

/* ---------- Phones ---------- */

@media (max-width: 760px) {
  .question {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .answer-col {
    padding-top: 0;
  }

  .prompt {
    min-height: 10rem;
  }

  .prompt-text.len-1 {
    font-size: var(--hanzi-7);
  }

  .prompt-text.len-2 {
    font-size: var(--hanzi-6);
  }

  .options {
    gap: var(--space-4) var(--space-3);
  }

  .option {
    min-height: 4rem;
    padding: var(--space-3);
    font-size: var(--text-md);
  }

  .config .field {
    flex: 1 1 8rem;
  }

  .select,
  .select select {
    width: 100%;
    min-width: 0;
  }

  .score {
    flex-basis: 100%;
    margin-inline-start: 0;
  }
}
</style>

