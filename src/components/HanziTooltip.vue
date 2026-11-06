<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useHanziTooltip } from '@/composables/useHanziTooltip'
import ToneContour from './ToneContour.vue'

const { word, x, y, hide } = useHanziTooltip()

// The tooltip is fixed-positioned from a captured rect, so dismiss it if the
// page scrolls or resizes rather than letting it drift off its character.
onMounted(() => {
  window.addEventListener('scroll', hide, true)
  window.addEventListener('resize', hide)
})
onUnmounted(() => {
  window.removeEventListener('scroll', hide, true)
  window.removeEventListener('resize', hide)
})
</script>

<template>
  <Teleport to="body">
    <transition name="tip">
      <!-- A small tile that pops up above the character it explains. -->
      <div
        v-if="word"
        :key="word.id"
        class="tip"
        dir="rtl"
        :style="{ left: x + 'px', top: y + 'px' }"
      >
        <span class="tip-hanzi hanzi" lang="zh-Hans">{{ word.hanzi }}</span>
        <ToneContour :pinyin="word.pinyin" :hanzi="word.hanzi" playing />
        <span class="tip-pinyin pinyin" dir="ltr">{{ word.pinyin || '—' }}</span>
        <span class="tip-hebrew hebrew">{{ word.hebrew ?? '—' }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.tip {
  position: fixed;
  /* Anchor point is the top-center of the character; sit above it. Placement
     uses `translate` so `transform` stays free for the pop-in. */
  translate: -50% calc(-100% - 14px);
  z-index: 200; /* above the modal (overlay is z-index 100) */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  min-width: 5.5rem;
  padding: var(--space-3) var(--space-4) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--bone);
  color: var(--ink);
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1px var(--bone-shade),
    inset 0 -3px 0 var(--bone-shade),
    0 4px 0 var(--jade-800),
    0 6px 0 var(--jade-900),
    0 14px 24px rgba(7, 42, 34, 0.3);
}

/* Pointer notch, in the tile's jade edge colour. */
.tip::after {
  content: '';
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  translate: -50% 0;
  border: 7px solid transparent;
  border-top-color: var(--jade-900);
}

.tip-hanzi {
  font-size: 1.75rem;
  line-height: 1.15;
  color: var(--carve-red);
}

.tip-pinyin {
  font-size: var(--text-sm);
}

.tip-hebrew {
  font-size: var(--text-sm);
  font-weight: 600;
}

.tip-enter-active {
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-base) var(--ease-spring);
}

.tip-leave-active {
  transition: opacity var(--dur-fast) var(--ease-out);
}

.tip-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.94);
}

.tip-leave-to {
  opacity: 0;
}
</style>

