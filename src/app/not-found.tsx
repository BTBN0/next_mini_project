import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 80, color: '#1D9E75', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, marginBottom: 12 }}>Хуудас олдсонгүй</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>Та хайж буй хуудас байхгүй эсвэл шилжсэн байна.</p>
        <Link href="/" style={{ padding: '12px 28px', borderRadius: 50, background: '#1D9E75', color: '#fff', fontWeight: 500, fontSize: 15 }}>
          Нүүр хуудас руу буцах →
        </Link>
      </div>
    </div>
  )
}
