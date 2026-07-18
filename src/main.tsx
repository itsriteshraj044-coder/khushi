import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminDashboard } from './pages/AdminDashboard'

/** Route on the URL hash: <site>/#admin → dashboard, everything else → the site. */
function isAdminRoute(): boolean {
  return window.location.hash.replace(/^#\/?/, '').toLowerCase().startsWith('admin')
}

function Root() {
  const [admin, setAdmin] = useState(isAdminRoute())
  useEffect(() => {
    const onHash = () => setAdmin(isAdminRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return admin ? <AdminDashboard /> : <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
