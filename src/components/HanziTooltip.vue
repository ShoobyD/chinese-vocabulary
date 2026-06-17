<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useHanziTooltip } from '@/composables/useHanziTooltip'

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
      <div
        v-if="word"
        class="tip"
        dir="rtl"
        :style="{ left: x + 'px', top: y + 'px' }"
      >
        <span class="tip-hanzi hanzi">{{ word.hanzi }}</span>
        <span class="tip-pinyin pinyin">{{ word.pinyin || '—' }}</span>
        <span class="tip-hebrew hebrew">{{ word.hebrew ?? '—' }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.tip {
  position: fixed;
  /* anchor point is the top-center of the character; sit above it */
  transform: translate(-50%, calc(-100% - 8px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.55rem 0.8rem;
  background: #2a2a2a;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgb(0 0 0 / 25%);
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
  /* above the modal (overlay is z-index 100) so card tooltips show on top */
  z-index: 200;
}

.tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #2a2a2a;
}

.tip-hanzi {
  font-size: 1.6rem;
  line-height: 1.1;
}

.tip-pinyin {
  font-size: 0.95rem;
  color: #ffd9d0;
  font-style: italic;
}

.tip-hebrew {
  font-size: 1rem;
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.1s ease;
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}
</style>
