<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useCard } from '@/composables/useCard'
import WordCard from './WordCard.vue'

const { selected, open, close } = useCard()

const closeBtn = ref<HTMLButtonElement | null>(null)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

// Move focus into the dialog when it opens, so keyboard users land on it.
watch(
  () => selected.value !== null,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    closeBtn.value?.focus()
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="selected" class="overlay" @click.self="close">
        <div class="dialog" role="dialog" aria-modal="true" aria-label="פרטי המילה">
          <button ref="closeBtn" type="button" class="close" aria-label="סגירה" @click="close">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" /></svg>
          </button>
          <WordCard :word="selected" @select="open" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: rgba(7, 42, 34, 0.6);
}

/* The dialog is one large tile: bone face resting on its jade back. */
.dialog {
  position: relative;
  width: 100%;
  max-width: 28rem;
  max-height: calc(100vh - 3rem);
  overflow: auto;
  overscroll-behavior: contain;
  padding: var(--space-7) var(--space-5) var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--bone);
  color: var(--ink);
  box-shadow:
    inset 0 -5px 0 var(--bone-shade),
    0 10px 0 var(--jade-700),
    0 14px 0 var(--jade-950),
    0 32px 60px rgba(0, 0, 0, 0.35);
}

.close {
  position: absolute;
  top: var(--space-3);
  /* RTL page: the inline end is the top-left corner, away from the content start. */
  inset-inline-end: var(--space-3);
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-muted);
  transition:
    background-color var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out);
}

.close svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.close:hover {
  background: var(--felt);
  color: var(--ink);
}

/* Enter: the backdrop fades while the tile rises and settles. */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}

.modal-enter-active .dialog {
  transition: transform var(--dur-slow) var(--ease-spring);
}

.modal-leave-active .dialog {
  transition: transform var(--dur-base) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .dialog {
  transform: translateY(24px) scale(0.96);
}

.modal-leave-to .dialog {
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 640px) {
  .dialog {
    padding: var(--space-7) var(--space-4) var(--space-5);
  }
}
</style>

