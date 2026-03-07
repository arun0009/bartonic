import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useAdvisories } from '../hooks/useAdvisories'
import InstallPrompt from './InstallPrompt'
import styles from './Layout.module.css'

const nav = [
  { to: '/routes', label: 'Routes' },
  { to: '/add', label: 'Add' },
  { to: '/lookup', label: 'Lookup' },
  { to: '/map', label: 'Map' },
  { to: '/info', label: 'Info' }
] as const

export default function Layout() {
  const location = useLocation()
  const favorites = useFavorites()
  const { advisories } = useAdvisories()
  const badge = location.pathname === '/info' ? undefined : favorites.length
  const infoBadge = location.pathname === '/info' ? undefined : advisories.length

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <InstallPrompt />
      <nav className={styles.nav} aria-label="Main">
        {nav.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
            end={to !== '/routes'}
          >
            <span className={styles.label}>{label}</span>
            {to === '/routes' && badge !== undefined && badge > 0 && (
              <span className={styles.badge}>{badge}</span>
            )}
            {to === '/info' && infoBadge !== undefined && infoBadge > 0 && (
              <span className={styles.badge}>{Math.min(99, infoBadge)}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
