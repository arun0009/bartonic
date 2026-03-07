import { useAdvisories } from '../hooks/useAdvisories'
import styles from './Info.module.css'

export default function Info() {
  const { advisories, loading, error } = useAdvisories()
  const fallback =
    error != null
      ? [{ title: 'Service status', description: error }]
      : [{ title: 'Service status', description: 'No delays or advisories reported.' }]
  const list = advisories.length > 0 ? advisories : fallback

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Advisories</h1>
        <p className={styles.subtitle}>
          BART service alerts
        </p>
      </header>
      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : (
        <ul className={styles.list}>
          {list.map((a, i) => (
            <li key={i} className={styles.card}>
              <h2 className={styles.cardTitle}>{a.title}</h2>
              <p className={styles.cardDesc}>{a.description}</p>
            </li>
          ))}
        </ul>
      )}
      <footer className={styles.footer}>
        <p>Data from BART API. Not affiliated with BART.</p>
      </footer>
    </div>
  )
}
