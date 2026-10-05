import type { Advisory } from '../types'
import { getActionableAdvisories, snippetAtWord } from '../lib/urgency'
import styles from './AdvisoryStrip.module.css'

interface AdvisoryStripProps {
  advisories: Advisory[]
  onOpen: () => void
}

export default function AdvisoryStrip({ advisories, onOpen }: AdvisoryStripProps) {
  const actionable = getActionableAdvisories(advisories)
  if (actionable.length === 0) return null

  const first = actionable[0]
  const extra = actionable.length - 1
  const snippet = snippetAtWord(first.description)
  const label = extra > 0 ? `${first.title} · ${snippet} · +${extra} more` : `${first.title} · ${snippet}`

  return (
    <button
      type="button"
      className={styles.strip}
      onClick={onOpen}
      aria-label={`BART advisories: ${first.title}. ${actionable.length} alert${actionable.length === 1 ? '' : 's'}. Opens advisories.`}
    >
      <span className={styles.body}>{label}</span>
      <span className={styles.more}>All alerts</span>
      <span className={styles.chevron} aria-hidden>
        ›
      </span>
    </button>
  )
}
