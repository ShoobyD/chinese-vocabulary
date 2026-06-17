import { ref } from 'vue'
import type { Word } from '@/data'

/** The word whose detail card is currently open (null = closed). Shared. */
const selected = ref<Word | null>(null)

export function useCard() {
  return {
    selected,
    open: (word: Word) => {
      selected.value = word
    },
    close: () => {
      selected.value = null
    },
  }
}
