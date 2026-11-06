<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useScope } from '@/composables/useScope'
import BrowseView from '@/components/BrowseView.vue'
import FlashcardsView from '@/components/FlashcardsView.vue'
import QuizView from '@/components/QuizView.vue'
import WordModal from '@/components/WordModal.vue'
import HanziTooltip from '@/components/HanziTooltip.vue'

type Mode = 'browse' | 'flashcards' | 'quiz' | 'edit'

// Editing is a dev-only tool: the component (and its button) are excluded from
// production builds — import.meta.env.DEV is statically false in prod, so the
// async import is tree-shaken away.
const isDev = import.meta.env.DEV
const EditView = isDev
  ? defineAsyncComponent(() => import('@/components/EditView.vue'))
  : null

const modes: { id: Mode; label: string }[] = [
  { id: 'browse', label: 'עיון וחיפוש' },
  { id: 'flashcards', label: 'כרטיסיות' },
  { id: 'quiz', label: 'בוחן' },
  ...(isDev ? [{ id: 'edit' as Mode, label: 'עריכה' }] : []),
]

const mode = ref<Mode>('browse')
const tagsExpanded = ref(false)

const { tags, selectedTags, scopedWords, toggleTag, clearTags } = useScope()
</script>

<template>
  <div class="app" dir="rtl">
    <header class="topbar">
      <div class="bar">
        <h1 class="brand">
          <span class="brand-tile hanzi" lang="zh-Hans" aria-hidden="true"><span>汉</span><span>语</span></span>
          <span class="brand-name">לימוד סינית</span>
        </h1>

        <nav class="modes" aria-label="מצב לימוד">
          <button
            v-for="m in modes"
            :key="m.id"
            type="button"
            :class="['mode-btn', { active: mode === m.id }]"
            :aria-pressed="mode === m.id"
            @click="mode = m.id"
          >
            {{ m.label }}
          </button>
        </nav>
      </div>

      <div class="filters" :class="{ expanded: tagsExpanded }">
        <div id="tag-list" class="tag-list" role="group" aria-label="סינון לפי תגית">
          <button
            type="button"
            :class="['tag', { active: selectedTags.length === 0 }]"
            :aria-pressed="selectedTags.length === 0"
            @click="clearTags"
          >
            הכול <span class="tag-count">{{ scopedWords.length }}</span>
          </button>
          <button
            v-for="t in tags"
            :key="t.key"
            type="button"
            :class="['tag', { active: selectedTags.includes(t.key) }]"
            :aria-pressed="selectedTags.includes(t.key)"
            @click="toggleTag(t.key)"
          >
            {{ t.label }} <span class="tag-count">{{ t.count }}</span>
          </button>
        </div>

        <button
          type="button"
          class="expand-btn"
          aria-controls="tag-list"
          :aria-expanded="tagsExpanded"
          @click="tagsExpanded = !tagsExpanded"
        >
          {{ tagsExpanded ? 'הצג פחות' : 'כל התגיות' }}
          <span v-if="!tagsExpanded && selectedTags.length" class="badge">{{ selectedTags.length }}</span>
          <svg class="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
        </button>
      </div>
    </header>

    <div class="table">
      <main class="content">
        <BrowseView v-if="mode === 'browse'" :words="scopedWords" />
        <FlashcardsView v-else-if="mode === 'flashcards'" :words="scopedWords" />
        <QuizView v-else-if="mode === 'quiz'" :words="scopedWords" />
        <component :is="EditView" v-else-if="EditView && mode === 'edit'" />
      </main>

      <footer class="credits">
        נבנה על ידי
        <a href="https://shoobyd.github.io/" target="_blank" rel="noopener noreferrer">ShoobyD</a>
        ·
        <a href="https://github.com/ShoobyD" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>

    <WordModal />
    <HanziTooltip />
  </div>
</template>

<style scoped>
.app {
  --content-max: 1120px;
  --gutter: clamp(1rem, 4vw, 3rem);
  --chip-h: 2.25rem;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--jade-800);
  color: var(--on-jade);
}

/* ---------- Header: the jade shell ---------- */

.topbar {
  width: 100%;
  max-width: calc(var(--content-max) + 2 * var(--gutter));
  margin: 0 auto;
  padding: var(--space-5) var(--gutter);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4) var(--space-6);
}

.brand {
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.1;
  color: var(--on-jade);
}

/* The mark: a small upright tile carving 汉 over 语. */
.brand-tile {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 3.5rem;
  border-radius: var(--radius-sm);
  background: var(--bone);
  color: var(--carve-red);
  font-size: 1.1rem;
  line-height: 1.15;
  box-shadow:
    var(--tile-face-edge),
    0 4px 0 var(--jade-700),
    0 6px 0 var(--jade-950),
    0 10px 14px rgba(0, 0, 0, 0.28);
}

/* Segmented tabs sunk into a darker jade well. */
.modes {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  border-radius: var(--radius-md);
  background: var(--jade-900);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.mode-btn {
  min-height: 2.75rem;
  padding: 0 var(--space-5);
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--on-jade-muted);
  font-size: var(--text-md);
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-spring);
}

.mode-btn:hover {
  background: var(--jade-700);
  color: var(--on-jade);
}

.mode-btn.active {
  background: var(--bone);
  color: var(--ink);
  box-shadow: inset 0 -3px 0 var(--bone-shade), 0 2px 0 var(--jade-950);
}

.mode-btn:active {
  transform: translateY(1px);
}

.mode-btn:focus-visible,
.tag:focus-visible,
.expand-btn:focus-visible {
  outline-color: var(--bone);
}

/* ---------- Tag filters ---------- */

.filters {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.tag-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem var(--space-2);
  /* Collapsed: one row of chips, with room for the selected chip's tile edge. */
  max-height: calc(var(--chip-h) + 6px);
  overflow: hidden;
}

.filters.expanded .tag-list {
  max-height: none;
}

.tag {
  min-height: var(--chip-h);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 0.875rem;
  border: 1px solid var(--jade-700);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--on-jade);
  font-size: var(--text-sm);
  white-space: nowrap;
  transition:
    background-color var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-spring);
}

.tag-count {
  color: var(--on-jade-muted);
  font-variant-numeric: tabular-nums;
}

.tag:hover {
  background: var(--jade-700);
  border-color: var(--jade-700);
}

/* Selected: the chip becomes a small bone tile resting on jade. */
.tag.active {
  background: var(--bone);
  border-color: var(--bone);
  color: var(--ink);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 var(--bone-shade), 0 3px 0 var(--jade-950);
  transform: translateY(-1px);
}

.tag.active .tag-count {
  color: var(--ink-muted);
}

.tag:active {
  transform: translateY(1px);
  box-shadow: none;
}

.expand-btn {
  flex: 0 0 auto;
  min-height: var(--chip-h);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--on-jade-muted);
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
  transition:
    color var(--dur-base) var(--ease-out),
    background-color var(--dur-base) var(--ease-out);
}

.expand-btn:hover {
  color: var(--on-jade);
  background: var(--jade-900);
}

.chevron {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform var(--dur-base) var(--ease-out);
}

.filters.expanded .chevron {
  transform: rotate(180deg);
}

.badge {
  min-width: 1.375rem;
  padding: 0 0.375rem;
  border-radius: 999px;
  background: var(--bone);
  color: var(--ink);
  font-size: var(--text-xs);
  font-weight: 700;
  line-height: 1.375rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* ---------- The felt table ---------- */

.table {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--felt);
  color: var(--text);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: inset 0 6px 14px rgba(7, 42, 34, 0.14);
}

.content {
  flex: 1;
  width: 100%;
  max-width: calc(var(--content-max) + 2 * var(--gutter));
  margin: 0 auto;
  padding: var(--space-6) var(--gutter);
}

.credits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-5) var(--gutter) var(--space-6);
  color: var(--ink-muted);
  font-size: var(--text-sm);
}

.credits a {
  color: var(--jade-800);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color var(--dur-base) var(--ease-out);
}

.credits a:hover {
  text-decoration-color: currentColor;
}

/* ---------- Phones ---------- */

@media (max-width: 640px) {
  .app {
    --chip-h: 2.75rem;
  }

  .topbar {
    padding-top: var(--space-4);
    gap: var(--space-4);
  }

  .brand {
    font-size: var(--text-lg);
  }

  .brand-tile {
    width: 2.125rem;
    height: 3rem;
    font-size: 0.95rem;
  }

  .modes {
    width: 100%;
  }

  .mode-btn {
    flex: 1;
    padding: 0 var(--space-2);
  }

  .content {
    padding-top: var(--space-5);
  }
}
</style>

