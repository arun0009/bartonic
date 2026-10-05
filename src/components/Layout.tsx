import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import InstallPrompt from './InstallPrompt'
import { LookupIcon, MapIcon, RoutesIcon } from './Icons'
import styles from './Layout.module.css'

const nav = [
  { to: '/routes', label: 'Routes', icon: RoutesIcon, match: (path: string) => path === '/routes' || path === '/add' || path.startsWith('/schedule/') },
  { to: '/lookup', label: 'Lookup', icon: LookupIcon, match: (path: string) => path === '/lookup' },
  { to: '/map', label: 'Map', icon: MapIcon, match: (path: string) => path === '/map' }
] as const

export default function Layout() {
  const location = useLocation()
  const favorites = useFavorites()
  const showRoutesBadge = favorites.length > 0 && location.pathname !== '/routes'

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <InstallPrompt />
      <nav className={styles.nav} aria-label="Main">
        {nav.map(({ to, label, icon: Icon, match }) => {
          const active = match(location.pathname)
          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={active ? styles.linkActive : styles.link}
              aria-current={active ? 'page' : undefined}
              end={to !== '/routes'}
            >
              <span className={styles.iconWrap}>
                <Icon size={22} />
                {to === '/routes' && showRoutesBadge && (
                  <span className={styles.badge} aria-hidden>
                    {favorites.length}
                  </span>
                )}
              </span>
              <span className={styles.label}>{label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
