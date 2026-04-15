'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  tourId: string
  price: number
  availableSeats: number
}

export default function BookingForm({ tourId, price, availableSeats }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [people, setPeople] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const serviceFee = Math.round(price * 0.1)
  const vat = Math.round((price * people + serviceFee) * 0.1)
  const total = price * people + serviceFee + vat

  const handleBook = async () => {
    if (!date) { setError('Огноо сонгоно уу'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourId, bookingDate: date, peopleCount: people, totalPrice: total }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Захиалга амжилтгүй боллоо')
      }
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label className="label">Захиалгын огноо</label>
        <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label className="label">Хүний тоо</label>
        <select className="input-field" value={people} onChange={e => setPeople(Number(e.target.value))}>
          {Array.from({ length: Math.min(availableSeats, 10) }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n} хүн</option>
          ))}
        </select>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: '16px 0' }} />

      <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>₮{price.toLocaleString()} × {people} хүн</span>
          <span>₮{(price * people).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>Үйлчилгээний хураамж</span>
          <span>₮{serviceFee.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>ВАТ (10%)</span>
          <span>₮{vat.toLocaleString()}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 16 }}>
          <span>Нийт</span>
          <span style={{ color: '#1D9E75' }}>₮{total.toLocaleString()}</span>
        </div>
      </div>

      {error && <div style={{ color: '#E24B4A', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#FCEBEB', borderRadius: 8 }}>{error}</div>}

      <button onClick={handleBook} disabled={loading} style={{
        width: '100%', padding: 14, borderRadius: 12, border: 'none',
        background: loading ? '#9FE1CB' : '#1D9E75', color: '#fff',
        fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
      }}>
        {loading ? 'Захиалж байна...' : 'Одоо захиалах →'}
      </button>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 10 }}>🔒 Найдвартай захиалга</div>
    </div>
  )
}
