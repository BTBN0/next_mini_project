'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Нэвтрэх амжилтгүй боллоо')
      router.push('/dashboard')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '2rem' }}>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#085041' }}>
            ✦ <span style={{ color: '#1D9E75' }}>Nomad</span>ly
          </Link>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>Тавтай морилно уу, аяллаа үргэлжлүүлэцгээе</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">И-мэйл хаяг</label>
            <input type="email" className="input-field" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Нууц үг</label>
            <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {error && <div style={{ color: '#E24B4A', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: '#FCEBEB', borderRadius: 8 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: loading ? '#9FE1CB' : '#1D9E75', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Нэвтэрж байна...' : 'Нэвтрэх →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
          Бүртгэл байхгүй юу? <Link href="/register" style={{ color: '#1D9E75', fontWeight: 500 }}>Бүртгүүлэх</Link>
        </div>

        <div style={{ marginTop: 20, padding: '1rem', background: '#f8f9fa', borderRadius: 10, fontSize: 12, color: '#6b7280' }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Тест бүртгэл:</div>
          <div>Admin: admin@nomadly.mn / admin123</div>
          <div>User: bayar@nomadly.mn / user123</div>
        </div>
      </div>
    </div>
  )
}
