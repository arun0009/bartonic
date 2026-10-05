import type { Advisory } from '../types'

export type Urgency = 'calm' | 'soon' | 'leave' | 'none'

export function urgencyFromSeconds(
  left: number | null,
  leavingNow = false
): Urgency {
  if (leavingNow || (left != null && left <= 0)) return 'leave'
  if (left == null) return 'none'
  if (left <= 300) return 'soon'
  return 'calm'
}

const ALL_CLEAR = /no delays|no advisories/i

export function isActionableAdvisory(title: string, description: string): boolean {
  return !ALL_CLEAR.test(title) && !ALL_CLEAR.test(description)
}

export function getActionableAdvisories(advisories: Advisory[]): Advisory[] {
  return advisories.filter((item) => isActionableAdvisory(item.title, item.description))
}

export function snippetAtWord(text: string, max = 72): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  const cut = trimmed.slice(0, max)
  const at = cut.lastIndexOf(' ')
  return `${(at > 40 ? cut.slice(0, at) : cut).trim()}…`
}
