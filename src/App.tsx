import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import MyRoutes from './pages/MyRoutes'

const AddRoute = lazy(() => import('./pages/AddRoute'))
const QuickLookup = lazy(() => import('./pages/QuickLookup'))
const Map = lazy(() => import('./pages/Map'))
const Info = lazy(() => import('./pages/Info'))
const RouteSchedule = lazy(() => import('./pages/RouteSchedule'))

function PageFallback() {
  return <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</div>
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/routes" replace />} />
            <Route path="routes" element={<MyRoutes />} />
            <Route path="add" element={<AddRoute />} />
            <Route path="lookup" element={<QuickLookup />} />
            <Route path="map" element={<Map />} />
            <Route path="info" element={<Info />} />
            <Route path="schedule/:origin/:destination" element={<RouteSchedule />} />
          </Route>
          <Route path="*" element={<Navigate to="/routes" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
