import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@components/layout'
import { ErrorBoundary, PageLoader } from '@/components/ui'

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const Sales = lazy(() => import('./pages/Sales').then(m => ({ default: m.Sales })))
const Users = lazy(() => import('./pages/Users').then(m => ({ default: m.Users })))
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })))
const Performance = lazy(() => import('./pages/Performance').then(m => ({ default: m.Performance })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Help = lazy(() => import('./pages/Help').then(m => ({ default: m.Help })))

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader message="Loading Dashboard..." />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<PageLoader message="Loading Analytics..." />}>
                <Analytics />
              </Suspense>
            }
          />
          <Route
            path="sales"
            element={
              <Suspense fallback={<PageLoader message="Loading Sales..." />}>
                <Sales />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<PageLoader message="Loading Users..." />}>
                <Users />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<PageLoader message="Loading Reports..." />}>
                <Reports />
              </Suspense>
            }
          />
          <Route
            path="performance"
            element={
              <Suspense fallback={<PageLoader message="Loading Performance..." />}>
                <Performance />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoader message="Loading Settings..." />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="help"
            element={
              <Suspense fallback={<PageLoader message="Loading Help..." />}>
                <Help />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
