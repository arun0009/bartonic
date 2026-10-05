import { describe, expect, it } from 'vitest'
import { suggestDowntownDestination } from '../lib/stationSuggestions'
import {
  getActionableAdvisories,
  isActionableAdvisory,
  snippetAtWord,
  urgencyFromSeconds
} from '../lib/urgency'

describe('suggestDowntownDestination', () => {
  it('sends everyone except Embarcadero to Embarcadero', () => {
    expect(suggestDowntownDestination('DUBL')).toBe('EMBR')
    expect(suggestDowntownDestination('embr')).toBe('MONT')
  })
})

describe('urgencyFromSeconds', () => {
  it('treats 5:00 as soon and 5:01 as calm', () => {
    expect(urgencyFromSeconds(301)).toBe('calm')
    expect(urgencyFromSeconds(300)).toBe('soon')
    expect(urgencyFromSeconds(1)).toBe('soon')
    expect(urgencyFromSeconds(0)).toBe('leave')
    expect(urgencyFromSeconds(12, true)).toBe('leave')
    expect(urgencyFromSeconds(null)).toBe('none')
  })
})

describe('advisory copy', () => {
  it('hides all-clear boilerplate', () => {
    expect(isActionableAdvisory('Service status', 'No delays or advisories reported.')).toBe(false)
    expect(
      getActionableAdvisories([
        { title: 'Service status', description: 'No delays or advisories reported.' },
        { title: 'Service advisory', description: 'Expect 30-minute delays tonight between Millbrae and Daly City.' }
      ])
    ).toHaveLength(1)
  })

  it('cuts snippets on a word boundary', () => {
    const text = 'Expect 30-minute delays starting at 9pm each night on Sunday-Thursday for riders traveling between Millbrae'
    const snippet = snippetAtWord(text, 72)
    expect(snippet.endsWith('…')).toBe(true)
    expect(snippet.length).toBeLessThanOrEqual(73)
    expect(snippet.includes(' ')).toBe(true)
  })
})
