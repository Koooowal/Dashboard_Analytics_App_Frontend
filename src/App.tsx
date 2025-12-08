import { Routes, Route } from 'react-router-dom'
import { Layout } from '@components/layout'
import {
  Dashboard,
  Analytics,
  Sales,
  Users,
  Reports,
  Performance,
  Settings,
  Help,
} from './pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="sales" element={<Sales />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="performance" element={<Performance />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  )
}

export default App
