<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useEditor } from '@/composables/useEditor'

const {
  words,
  tags,
  dirty,
  saving,
  saveError,
  markDirty,
  addWord,
  removeWord,
  toggleWordTag,
  renameTag,
  addTag,
  removeTag,
  exportText,
  saveToFile,
} = useEditor()

// New-tag form fields.
const newTagKey = ref('')
const newTagLabel = ref('')

function submitNewTag() {
  addTag(newTagKey.value, newTagLabel.value)
  newTagKey.value = ''
  newTagLabel.value = ''
}

// Transient "Copied!" / "Downloaded" hint next to the export buttons.
const exportHint = ref('')
let hintTimer: ReturnType<typeof setTimeout> | undefined

function flashHint(text: string) {
  exportHint.value = text
  clearTimeout(hintTimer)
  hintTimer = setTimeout(() => (exportHint.value = ''), 2000)
}

async function copyText() {
  try {
    await navigator.clipboard.writeText(exportText())
    flashHint('הועתק ✔')
  } catch {
    flashHint('ההעתקה נכשלה')
  }
}

function downloadText() {
  const blob = new Blob([exportText()], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(url)
  flashHint('הורד ✔')
}

// Warn before leaving with unsaved changes (matches WordModal's listener style).
function onBeforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) e.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>

<template>
  <section class="edit" dir="rtl">
    <div class="toolbar">
      <button class="btn primary" :disabled="saving" @click="saveToFile">
        {{ saving ? 'שומר…' : 'שמירה ל־data.json' }}
      </button>
      <button class="btn" @click="copyText">העתקה</button>
      <button class="btn" @click="downloadText">הורדה</button>

      <span v-if="exportHint" class="hint ok">{{ exportHint }}</span>
      <span v-if="saveError" class="hint err">שגיאה: {{ saveError }}</span>
      <span v-else-if="dirty" class="hint">יש שינויים שלא נשמרו</span>

      <span class="spacer" />
      <span class="dev-note">מצב פיתוח בלבד</span>
    </div>

    <!-- Tags: edit labels, add, remove. -->
    <div class="panel">
      <h2 class="panel-title">תגיות</h2>
      <ul class="tag-list">
        <li v-for="t in tags" :key="t.key" class="tag-row">
          <span class="tag-key" dir="ltr">{{ t.key }}</span>
          <input
            :value="t.label"
            class="cell"
            placeholder="תווית"
            @input="renameTag(t.key, ($event.target as HTMLInputElement).value)"
          />
          <span class="tag-count">{{ t.count }}</span>
          <button class="btn danger small" @click="removeTag(t.key)">×</button>
        </li>
      </ul>

      <form class="new-tag" dir="ltr" @submit.prevent="submitNewTag">
        <input v-model="newTagKey" class="cell" placeholder="key (e.g. animals)" />
        <input v-model="newTagLabel" class="cell hebrew" dir="rtl" placeholder="תווית" />
        <button class="btn small" type="submit">+ תגית</button>
      </form>
    </div>

    <!-- Words: one editable row each, with tag toggles. -->
    <div class="panel">
      <h2 class="panel-title">מילים ({{ words.length }})</h2>

      <div class="row head-row" dir="ltr">
        <span>汉字</span>
        <span>Pīnyīn</span>
        <span>עברית</span>
        <span></span>
      </div>

      <div v-for="word in words" :key="word.id" class="word">
        <div class="row" dir="ltr">
          <input v-model="word.hanzi" class="cell hanzi" @input="markDirty" />
          <input v-model="word.pinyin" class="cell" @input="markDirty" />
          <input v-model="word.hebrew" class="cell hebrew" dir="rtl" @input="markDirty" />
          <button class="btn danger small" @click="removeWord(word)">×</button>
        </div>
        <ul class="chips">
          <li
            v-for="t in tags"
            :key="t.key"
            :class="['chip', { on: word.tags.includes(t.key) }]"
            @click="toggleWordTag(word, t.key)"
          >
            {{ t.label }}
          </li>
        </ul>
      </div>

      <button class="btn small add" @click="addWord">+ מילה</button>
    </div>
  </section>
</template>

<style scoped>
.edit {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.spacer {
  flex: 1;
}

.dev-note {
  color: var(--muted);
  font-size: 0.8rem;
}

.hint {
  font-size: 0.85rem;
  color: var(--muted);
}

.hint.ok {
  color: var(--good);
}

.hint.err {
  color: var(--bad);
}

.panel {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.tag-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tag-row {
  display: grid;
  grid-template-columns: 12rem 1fr auto auto;
  align-items: center;
  gap: 0.6rem;
}

.tag-key {
  color: var(--muted);
  font-size: 0.85rem;
  font-family: ui-monospace, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-count {
  color: var(--muted);
  font-size: 0.8rem;
  min-width: 2rem;
  text-align: center;
}

.new-tag {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  border-top: 1px solid var(--border);
  padding-top: 0.6rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  align-items: center;
  gap: 0.6rem;
}

.head-row {
  color: var(--muted);
  font-size: 0.8rem;
  padding: 0 0.2rem;
}

.word {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

.cell {
  font: inherit;
  padding: 0.4rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  min-width: 0;
}

.cell.hanzi {
  font-size: 1.3rem;
}

.chips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.chip {
  font-size: 0.78rem;
  padding: 0.15rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  color: var(--muted);
  cursor: pointer;
}

.chip:hover {
  border-color: var(--accent);
}

.chip.on {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.btn {
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  border-color: var(--accent);
}

.btn:disabled {
  opacity: 0.6;
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.btn.danger {
  color: var(--bad);
}

.btn.danger:hover {
  border-color: var(--bad);
}

.btn.small {
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
}

.add {
  align-self: flex-start;
}
</style>