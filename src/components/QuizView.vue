<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Word } from '@/data'
import { looseEqual, normalizePinyin, sample, shuffle } from '@/utils'

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
</script>

<template>
  <section class="quiz">
    <div class="config">
      <label>
        כיוון:
        <select v-model="direction">
          <option v-for="d in directions" :key="d.id" :value="d">{{ d.label }}</option>
        </select>
      </label>
      <label>
        סוג:
        <select v-model="quizType">
          <option value="mc">רב־ברירה</option>
          <option value="typed">הקלדה</option>
        </select>
      </label>
      <span class="score">ניקוד: {{ score }} / {{ answered }}</span>
    </div>

    <p v-if="eligible.length === 0" class="empty">
      אין מספיק מילים עם השדות הדרושים לכיוון זה.
    </p>

    <div v-else-if="finished" class="done">
      <p class="done-title">סיימת! 🎉</p>
      <p class="score-big">{{ score }} / {{ answered }}</p>
      <button class="btn primary" @click="start">מבחן חדש</button>
    </div>

    <div v-else-if="current" class="question">
      <div class="counter">שאלה {{ qIndex + 1 }} / {{ queue.length }}</div>

      <div :class="['prompt', { hebrew: direction.prompt === 'hebrew', hanzi: direction.prompt === 'hanzi' }]">
        {{ field(current, direction.prompt) }}
      </div>

      <!-- Multiple choice -->
      <div v-if="quizType === 'mc'" class="options">
        <button
          v-for="opt in options"
          :key="opt"
          :class="[
            'option',
            {
              hebrew: direction.answer === 'hebrew',
              hanzi: direction.answer === 'hanzi',
              correct: submitted && isCorrect(opt),
              wrong: submitted && picked === opt && !isCorrect(opt),
            },
          ]"
          :disabled="submitted"
          @click="pick(opt)"
        >
          {{ opt }}
        </button>
      </div>

      <!-- Typed -->
      <form v-else class="typed" @submit.prevent="submitTyped">
        <input
          v-model="typedAnswer"
          :class="['answer-input', { hebrew: direction.answer === 'hebrew' }]"
          :disabled="submitted"
          :dir="direction.answer === 'hebrew' ? 'rtl' : 'ltr'"
          placeholder="הקלידו תשובה…"
          autofocus
        />
        <button v-if="!submitted" class="btn primary" type="submit">בדיקה</button>
      </form>

      <div v-if="submitted" class="feedback">
        <p v-if="quizType === 'typed' || picked !== null">
          <span v-if="isCorrect(quizType === 'typed' ? typedAnswer : picked ?? '')" class="good">
            נכון! ✔
          </span>
          <span v-else class="bad">
            לא נכון. התשובה: <strong>{{ correctAnswer }}</strong>
          </span>
        </p>
        <button class="btn primary" @click="nextQuestion">הבא ›</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quiz {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.config {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.config select {
  font: inherit;
  margin-inline-start: 0.4rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
}

.score {
  margin-inline-start: auto;
  color: var(--muted);
}

.counter {
  color: var(--muted);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.prompt {
  text-align: center;
  font-size: 2.5rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.option {
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  text-align: center;
}

.option:not(:disabled):hover {
  border-color: var(--accent);
}

.option.correct {
  background: #e6f4ea;
  border-color: var(--good);
  color: var(--good);
}

.option.wrong {
  background: #fdecea;
  border-color: var(--bad);
  color: var(--bad);
}

.typed {
  display: flex;
  gap: 0.5rem;
}

.answer-input {
  flex: 1;
  font: inherit;
  font-size: 1.2rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.feedback {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.good {
  color: var(--good);
  font-weight: 600;
}

.bad {
  color: var(--bad);
}

.btn {
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.done {
  text-align: center;
  padding: 2rem 0;
}

.done-title {
  font-size: 1.5rem;
}

.score-big {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0 1.5rem;
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 2rem 0;
}
</style>
