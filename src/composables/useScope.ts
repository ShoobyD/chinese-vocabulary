import { computed, ref } from 'vue'
import { allWords, groups } from '@/data'
import type { Word } from '@/data'

const ALL = 'all' as const

/** Selected group id, or 'all' for the whole dataset. Shared across modes. */
const selectedGroupId = ref<string>(ALL)

/** Words in the current scope (all words, or the selected group's words). */
const scopedWords = computed<Word[]>(() => {
  if (selectedGroupId.value === ALL) return allWords
  const group = groups.find((g) => g.id === selectedGroupId.value)
  return group ? group.words : allWords
})

export function useScope() {
  return {
    ALL,
    groups,
    selectedGroupId,
    scopedWords,
  }
}
