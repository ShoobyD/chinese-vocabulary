<script setup lang="ts">
import { computed } from 'vue'
import { pinyinTones } from '@/utils'
import type { Tone } from '@/utils'

/**
 * Draws each syllable's tone as a short pitch contour in its carving ink,
 * in reading order. Lines are always visible; when `playing` turns on they
 * are redrawn one syllable after another (staggered by --tone-stagger).
 */
const props = withDefaults(
  defineProps<{ pinyin: string; hanzi: string; playing?: boolean; size?: 'sm' | 'lg' }>(),
  { playing: false, size: 'sm' },
)

// Pitch on a 0–18 box (top = high), after Chao's five-level tone letters.
const PATHS: Record<Tone, string> = {
  1: 'M3 4 L29 4', // 55 high flat
  2: 'M3 12 L29 4', // 35 rising
  3: 'M3 9 Q13 21 29 5', // 214 dipping
  4: 'M3 4 L29 15', // 51 falling
  0: 'M15 10 L17 10', // neutral: a short dot
}

const tones = computed(() => pinyinTones(props.pinyin, props.hanzi))
</script>

<template>
  <span
    v-if="tones"
    :class="['tones', `tones-${size}`, { playing }]"
    dir="ltr"
    aria-hidden="true"
  >
    <svg
      v-for="(t, i) in tones"
      :key="i"
      class="contour"
      viewBox="0 0 32 20"
      :style="{ '--i': i, '--tone-color': `var(--tone-${t})` }"
    >
      <path :d="PATHS[t]" :class="{ neutral: t === 0 }" />
    </svg>
  </span>
</template>

<style scoped>
.tones {
  display: inline-flex;
  justify-content: center;
  gap: 0.25rem;
}

.contour {
  overflow: visible;
}

.tones-sm .contour {
  width: 2.25rem;
  height: 1.4rem;
}

.tones-lg .contour {
  width: 3.5rem;
  height: 2.2rem;
}

.tones-lg {
  gap: 0.75rem;
}

path {
  fill: none;
  stroke: var(--tone-color);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 0;
}

path.neutral {
  stroke-width: 4;
}

.tones-lg path {
  stroke-width: 3;
}

.tones-lg path.neutral {
  stroke-width: 5;
}

.playing path {
  animation: draw var(--tone-draw) var(--ease-out) both;
  /* --tone-lead lets a parent hold the first stroke, e.g. until a flip lands. */
  animation-delay: calc(var(--tone-lead, 0ms) + var(--i) * var(--tone-stagger));
}

@media (prefers-reduced-motion: reduce) {
  .playing path {
    animation: none;
  }
}

@keyframes draw {
  from {
    stroke-dashoffset: 40;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>

