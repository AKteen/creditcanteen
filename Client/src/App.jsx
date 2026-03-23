import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import supabase from './lib/supabase'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

export default function App() {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchRole(session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        setLoading(true)
        fetchRole(session.user.id)
      }
      else {
        setRole(null)
        setLoading(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function fetchRole(userId) {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('fetchRole error:', error)
      setRole('student')
    } else {
      console.log('ROLE FETCHED:', data?.role)
      setRole(data?.role || 'student')
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5F5' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍱</div>
        <p style={{ color: '#E23744', fontWeight: '600' }}>Loading...</p>
      </div>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        {/* student login */}
        <Route path="/" element={
          !session ? <Login /> :
          role === 'student' ? <Navigate to="/dashboard" /> :
          <Navigate to="/admin" />
        } />

        {/* secret admin login */}
        <Route path="/admin-login" element={
          session && role === 'admin' ? <Navigate to="/admin" /> : <AdminLogin />
        } />

        {/* student dashboard */}
        <Route path="/dashboard" element={
          !session ? <Navigate to="/" /> :
          role === 'student' ? <Dashboard session={session} /> :
          <Navigate to="/admin" />
        } />

        {/* admin panel */}
        <Route path="/admin" element={
          !session ? <Navigate to="/admin-login" /> :
          role === 'admin' ? <Admin session={session} /> :
          <Navigate to="/dashboard" />
        } />
      </Routes>
    </BrowserRouter>
  )
}