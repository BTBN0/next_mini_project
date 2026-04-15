'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Нууц үг таарахгүй байна'); return }
    if (form.password.length < 8) { setError('Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Бүртгэл амжилтгүй боллоо')
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
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>Шинэ бүртгэл үүсгэх</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Таны нэр</label>
            <input className="input-field" placeholder="Баяр Дорж" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">И-мэйл хаяг</label>
            <input type="email" className="input-field" placeholder="user@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Нууц үг</label>
            <input type="password" className="input-field" placeholder="Хамгийн багадаа 8 тэмдэгт" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Нууц үг давтах</label>
            <input type="password" className="input-field" placeholder="Нууц үгээ давтан оруулна уу" value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>

          {error && (
            <div style={{ color: '#E24B4A', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: '#FCEBEB', borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 13, borderRadius: 12, border: 'none',
            background: loading ? '#9FE1CB' : '#1D9E75', color: '#fff',
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 24 }}>
          Бүртгэл байна уу? <Link href="/login" style={{ color: '#1D9E75', fontWeight: 500 }}>Нэвтрэх</Link>
        </div>
      </div>
    </div>
  )
}
