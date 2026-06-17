<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCard } from '@/composables/useCard'
import WordCard from './WordCard.vue'

const { selected, open, close } = useCard()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="selected" class="overlay" @click.self="close">
        <div class="dialog" role="dialog" aria-modal="true">
          <button class="close" aria-label="סגירה" @click="close">×</button>
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
  background: rgb(0 0 0 / 45%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.dialog {
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow: auto;
  background: var(--surface);
  border-radius: 16px;
  padding: 2rem 1.5rem 1.5rem;
  box-shadow: 0 12px 40px rgb(0 0 0 / 25%);
}

.close {
  position: absolute;
  top: 0.5rem;
  inset-inline-start: 0.5rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  font-size: 1.4rem;
  line-height: 1;
}

.close:hover {
  background: var(--bg);
  color: var(--text);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
