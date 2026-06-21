import { computed, ref } from 'vue'
import { allWords, tags } from '@/data'
import type { Word } from '@/data'

/** Selected tag keys. Empty means "no filter" — the whole dataset. */
const selectedTags = ref<string[]>([])

/** Words in the current scope: all words, or those matching ANY selected tag. */
const scopedWords = computed<Word[]>(() => {
  if (selectedTags.value.length === 0) return allWords
  return allWords.filter((w) => w.tags.some((t) => selectedTags.value.includes(t)))
})

/** Add or remove a tag key from the selection. */
function toggleTag(key: string): void {
  const i = selectedTags.value.indexOf(key)
  if (i === -1) selectedTags.value.push(key)
  else selectedTags.value.splice(i, 1)
}

/** Clear the selection (back to showing all words). */
function clearTags(): void {
  selectedTags.value = []
}

export function useScope() {
  return {
    tags,
    selectedTags,
    scopedWords,
    toggleTag,
    clearTags,
  }
}
