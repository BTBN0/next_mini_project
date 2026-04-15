'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  user: { name: string; email: string; image: string; bio: string; phone: string }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'info' | 'password'>('info')
  const [form, setForm] = useState({ name: user.name, image: user.image, bio: user.bio, phone: user.phone })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setSuccess('Профайл амжилттай шинэчлэгдлээ!')
      router.refresh()
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { setError('Нууц үг таарахгүй байна'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setSuccess('Нууц үг амжилттай солигдлоо!')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        {([['info', 'Мэдээлэл засах'], ['password', 'Нууц үг солих']] as const).map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setError(''); setSuccess('') }} style={{
            padding: '1rem 1.5rem', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            background: 'none', fontFamily: 'DM Sans, sans-serif',
            color: tab === key ? '#085041' : '#6b7280',
            borderBottom: tab === key ? '2px solid #1D9E75' : '2px solid transparent',
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem' }}>
        {success && <div style={{ background: '#E1F5EE', color: '#085041', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16, fontWeight: 500 }}>✓ {success}</div>}
        {error && <div style={{ background: '#FCEBEB', color: '#791F1F', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

        {tab === 'info' ? (
          <form onSubmit={handleInfo}>
            {/* Avatar preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '1rem', background: '#f8f9fa', borderRadius: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: form.image ? '#000' : 'linear-gradient(135deg,#1D9E75,#085041)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {form.image
                  ? <img src={form.image} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = '' }} />
                  : <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#fff' }}>{form.name.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Профайл зургийн URL</label>
                <input className="input-field" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/photo.jpg" type="url" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Нэр</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Утасны дугаар</label>
                <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+976 9999 9999" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Өөрийн тухай</label>
                <textarea className="input-field" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={3} placeholder="Аяллын талаарх сонирхол, туршлагаа бичнэ үү..." style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Хадгалж байна...' : 'Мэдээлэл хадгалах'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
              <div>
                <label className="label">Одоогийн нууц үг</label>
                <input type="password" className="input-field" value={pwForm.currentPassword}
                  onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required placeholder="••••••••" />
              </div>
              <div>
                <label className="label">Шинэ нууц үг</label>
                <input type="password" className="input-field" value={pwForm.newPassword}
                  onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required placeholder="Хамгийн багадаа 8 тэмдэгт" />
              </div>
              <div>
                <label className="label">Шинэ нууц үг давтах</label>
                <input type="password" className="input-field" value={pwForm.confirm}
                  onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required placeholder="••••••••" />
              </div>
              <div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Солиж байна...' : 'Нууц үг солих'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
