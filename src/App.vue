<script setup lang="ts">
import { ref } from 'vue'
import { useScope } from '@/composables/useScope'
import BrowseView from '@/components/BrowseView.vue'
import FlashcardsView from '@/components/FlashcardsView.vue'
import QuizView from '@/components/QuizView.vue'
import WordModal from '@/components/WordModal.vue'
import HanziTooltip from '@/components/HanziTooltip.vue'

type Mode = 'browse' | 'flashcards' | 'quiz'

const modes: { id: Mode; label: string }[] = [
  { id: 'browse', label: 'עיון וחיפוש' },
  { id: 'flashcards', label: 'כרטיסיות' },
  { id: 'quiz', label: 'בוחן' },
]

const mode = ref<Mode>('browse')

const { ALL, groups, selectedGroupId, scopedWords } = useScope()
</script>

<template>
  <div class="app" dir="rtl">
    <header class="topbar">
      <h1 class="title"><span class="hanzi">汉语</span> · לימוד סינית</h1>

      <nav class="modes">
        <button
          v-for="m in modes"
          :key="m.id"
          :class="['mode-btn', { active: mode === m.id }]"
          @click="mode = m.id"
        >
          {{ m.label }}
        </button>
      </nav>

      <label class="scope">
        קבוצה:
        <select v-model="selectedGroupId">
          <option :value="ALL">הכול ({{ scopedWords.length }})</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">
            {{ g.title }} ({{ g.words.length }})
          </option>
        </select>
      </label>
    </header>

    <main class="content">
      <BrowseView v-if="mode === 'browse'" :words="scopedWords" />
      <FlashcardsView v-else-if="mode === 'flashcards'" :words="scopedWords" />
      <QuizView v-else :words="scopedWords" />
    </main>

    <footer class="credits">
      נבנה על ידי
      <a href="https://shoobyd.github.io/" target="_blank" rel="noopener noreferrer">ShoobyD</a>
      ·
      <a href="https://github.com/ShoobyD" target="_blank" rel="noopener noreferrer">GitHub</a>
    </footer>

    <WordModal />
    <HanziTooltip />
  </div>
</template>

<style scoped>
.app {
  max-width: 920px;
  margin: 0 auto;
  padding: 1rem;
}

.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.title {
  margin: 0;
  font-size: 1.3rem;
  flex: 1 1 100%;
}

.modes {
  display: flex;
  gap: 0.5rem;
}

.mode-btn {
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
}

.mode-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.scope {
  margin-inline-start: auto;
  color: var(--muted);
  font-size: 0.9rem;
}

.scope select {
  font: inherit;
  margin-inline-start: 0.4rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
}

.credits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.85rem;
}

.credits a {
  color: var(--accent);
  text-decoration: none;
}

.credits a:hover {
  text-decoration: underline;
}
</style>
