import { ref } from 'vue'
import type { Word } from '@/data'

/**
 * A single shared Hanzi tooltip, rendered once (teleported to <body>) and
 * positioned with fixed coordinates from the hovered character's screen rect.
 * Living outside every card/scroll container means no ancestor can clip it.
 */
const word = ref<Word | null>(null)
const x = ref(0)
const y = ref(0)

export function useHanziTooltip() {
  return {
    word,
    x,
    y,
    show(w: Word, rect: DOMRect) {
      word.value = w
      x.value = rect.left + rect.width / 2 // horizontal center of the char
      y.value = rect.top // top edge; tooltip sits above it
    },
    hide() {
      word.value = null
    },
  }
}
