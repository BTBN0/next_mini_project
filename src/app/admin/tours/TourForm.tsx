'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Destination { id: string; name: string; country: string }
interface TourFormProps {
  destinations: Destination[]
  initialData?: {
    id: string; title: string; description: string; price: number
    location: string; availableSeats: number; destinationId: string; image?: string | null
  }
}

export default function TourForm({ destinations, initialData }: TourFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    location: initialData?.location || '',
    availableSeats: initialData?.availableSeats?.toString() || '20',
    destinationId: initialData?.destinationId || (destinations[0]?.id || ''),
    image: initialData?.image || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = isEdit ? `/api/tours/${initialData!.id}` : '/api/tours'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          availableSeats: parseInt(form.availableSeats),
          image: form.image || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Алдаа гарлаа')
      }
      router.push('/admin')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Тур нэр</label>
          <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Бали 7 хоногийн Premium тур" required />
        </div>

        <div>
          <label className="label">Аяллын газар</label>
          <select className="input-field" value={form.destinationId} onChange={e => setForm({ ...form, destinationId: e.target.value })} required>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.name}, {d.country}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Байршил</label>
          <input className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="Бали, Индонези" required />
        </div>

        <div>
          <label className="label">Үнэ (₮)</label>
          <input type="number" className="input-field" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
            placeholder="890000" min="0" required />
        </div>

        <div>
          <label className="label">Боломжит суудал</label>
          <input type="number" className="input-field" value={form.availableSeats} onChange={e => setForm({ ...form, availableSeats: e.target.value })}
            min="1" required />
        </div>

        {/* Image URL field */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Зургийн URL (заавал биш)</label>
          <input className="input-field" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
            placeholder="https://example.com/image.jpg" type="url" />
          {form.image && (
            <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', height: 160, background: '#f0f0f0' }}>
              <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          )}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label className="label">Тайлбар</label>
          <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={5} placeholder="Аяллын дэлгэрэнгүй тайлбар..." required style={{ resize: 'vertical' }} />
        </div>
      </div>

      {error && (
        <div style={{ color: '#E24B4A', fontSize: 13, margin: '16px 0', padding: '8px 12px', background: '#FCEBEB', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Хадгалж байна...' : isEdit ? 'Өөрчлөлт хадгалах' : 'Тур нэмэх →'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Цуцлах</button>
      </div>
    </form>
  )
}
