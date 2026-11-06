<script setup lang="ts">
import { computed } from 'vue'
import { pinyinSyllables } from '@/utils'

/**
 * Pinyin with each syllable inked in its tone's carving colour, matching the
 * tone contours (1 red, 2 green, 3 blue, 4 black, neutral muted). Separators
 * keep the surrounding ink. Falls back to plain text when the syllables don't
 * line up with the Hanzi.
 */
const props = defineProps<{ pinyin: string; hanzi: string }>()

const parts = computed(() => pinyinSyllables(props.pinyin, props.hanzi))
</script>

<template>
  <span class="pinyin-text" dir="ltr">
    <template v-if="parts">
      <span
        v-for="(p, i) in parts"
        :key="i"
        :class="{ syl: p.tone !== null }"
        :style="p.tone !== null ? { color: `var(--tone-${p.tone})` } : undefined"
        >{{ p.text }}</span
      >
    </template>
    <template v-else>{{ pinyin || '—' }}</template>
  </span>
</template>

<style scoped>
.pinyin-text {
  unicode-bidi: isolate;
}
</style>

