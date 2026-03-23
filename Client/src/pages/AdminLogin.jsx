import { useState } from 'react'
import supabase from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // verify role after login
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Access denied. Admins only.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
      <div style={{
        background: '#16213e',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #0f3460'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛠️</div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>Admin Access</h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Canteen Credits Dashboard</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              background: '#0f3460', color: 'white', border: '1px solid #1a4a8a',
              borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '14px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              background: '#0f3460', color: 'white', border: '1px solid #1a4a8a',
              borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '14px'
            }}
          />

          {error && (
            <div style={{ background: '#2d1b1b', border: '1px solid #ff4444', color: '#ff6666', padding: '12px 16px', borderRadius: '12px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              background: '#E23744', color: 'white', border: 'none',
              borderRadius: '12px', padding: '14px', fontWeight: '600',
              fontSize: '16px', cursor: 'pointer', opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Verifying...' : 'Login as Admin →'}
          </button>
        </div>
      </div>
    </div>
  )
}