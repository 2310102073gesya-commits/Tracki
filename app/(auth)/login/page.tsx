'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      if (isLogin) {
        const res = await login(formData)
        if (res?.error) setError(res.error)
      } else {
        const res = await signup(formData)
        if (res?.error) setError(res.error)
      }
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError(err.message || 'Terjadi kesalahan')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'linear-gradient(135deg,var(--pink),var(--blue))', borderRadius: '12px', color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>T</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700 }}>Tracki Syariah</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Kelola rezeki dengan amanah</div>
          </div>

          {error && (
            <div style={{ background: 'var(--red-dim)', color: 'var(--red)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(239,68,68,.2)' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email</label>
              <input name="email" type="email" required className="form-input" placeholder="nama@email.com" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input name="password" type="password" required className="form-input" placeholder="Minimal 6 karakter" minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--muted)' }}>
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(null); }} style={{ color: 'var(--pink)', fontWeight: 600, textDecoration: 'none' }}>
              {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
