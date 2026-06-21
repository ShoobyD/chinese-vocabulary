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
const tagsExpanded = ref(false)

const { tags, selectedTags, scopedWords, toggleTag, clearTags } = useScope()
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

      <div class="filters" :class="{ expanded: tagsExpanded }">
        <div class="tag-list">
          <button
            :class="['tag', { active: selectedTags.length === 0 }]"
            @click="clearTags"
          >
            הכול ({{ scopedWords.length }})
          </button>
          <button
            v-for="t in tags"
            :key="t.key"
            :class="['tag', { active: selectedTags.includes(t.key) }]"
            @click="toggleTag(t.key)"
          >
            {{ t.label }} ({{ t.count }})
          </button>
        </div>

        <button class="expand-btn" @click="tagsExpanded = !tagsExpanded">
          {{ tagsExpanded ? 'הצג פחות' : 'עוד תגיות…' }}
          <span v-if="!tagsExpanded && selectedTags.length" class="badge">{{ selectedTags.length }}</span>
        </button>
      </div>
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

.filters {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  flex: 1 1 100%;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  flex: 1;
  /* Collapsed: clip to a single row of chips. */
  max-height: 2rem;
  overflow: hidden;
}

.filters.expanded .tag-list {
  max-height: none;
}

.expand-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font: inherit;
  font-size: 0.85rem;
  white-space: nowrap;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
}

.expand-btn:hover {
  border-color: var(--accent);
  color: var(--text);
}

.badge {
  min-width: 1.2rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
}

.tag {
  font: inherit;
  font-size: 0.85rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.tag:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.tag.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
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
