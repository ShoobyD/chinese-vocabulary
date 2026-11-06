<script setup lang="ts">
import { computed } from 'vue'
import { segment } from '@/data'
import type { Segment, Word } from '@/data'
import { useHanziTooltip } from '@/composables/useHanziTooltip'
import { useCard } from '@/composables/useCard'

// `nested`: rendered inside another control (a Browse tile). Segments keep
// their pointer hover/click but leave the tab order and the accessibility
// tree, so the tile stays the single keyboard target.
const props = defineProps<{ text: string; nested?: boolean }>()

const { show, hide } = useHanziTooltip()
const { open } = useCard()

// Break the text into the longest recorded sub-words; each known segment shows
// its own card on hover and opens it on click.
const segments = computed<Segment[]>(() => segment(props.text))

function onEnter(e: Event, word: Word) {
  const el = e.currentTarget as HTMLElement
  show(word, el.getBoundingClientRect())
}

function onActivate(word: Word) {
  hide()
  open(word)
}
</script>

<template>
  <span class="hanzi-text hanzi">
    <template v-for="(s, i) in segments" :key="i">
      <span
        v-if="s.word"
        class="seg known"
        :role="nested ? undefined : 'button'"
        :tabindex="nested ? undefined : 0"
        @mouseenter="onEnter($event, s.word)"
        @mouseleave="hide"
        @focus="onEnter($event, s.word)"
        @blur="hide"
        @click.stop="onActivate(s.word)"
        @keydown.enter.stop.prevent="onActivate(s.word)"
        @keydown.space.stop.prevent="onActivate(s.word)"
        >{{ s.text }}</span
      >
      <span v-else class="seg">{{ s.text }}</span>
    </template>
  </span>
</template>

<style scoped>
.hanzi-text {
  white-space: nowrap;
}

/* Known sub-words carry a fine dotted rule; it turns jade under the pointer
   (never a carving ink — those are reserved for tones). */
.seg.known {
  cursor: pointer;
  text-decoration: underline dotted var(--bone-deep);
  text-decoration-thickness: 0.06em;
  text-underline-offset: 0.18em;
  outline-offset: 2px;
  transition:
    color var(--dur-base) var(--ease-out),
    text-decoration-color var(--dur-base) var(--ease-out);
}

.seg.known:hover,
.seg.known:focus-visible {
  color: var(--jade-800);
  text-decoration-color: var(--jade-800);
}

/* Small gap between adjacent known segments so the dotted underlines read as
   separate units (e.g. 一家 · 老小). */
.seg.known + .seg.known {
  margin-inline-start: 0.12em;
}
</style>

