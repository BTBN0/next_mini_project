import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'

const GRADIENTS = [
  'linear-gradient(160deg,#04342C,#1D9E75)',
  'linear-gradient(160deg,#042C53,#378ADD)',
  'linear-gradient(160deg,#4B1528,#D4537E)',
  'linear-gradient(160deg,#412402,#BA7517)',
  'linear-gradient(160deg,#085041,#5DCAA5)',
  'linear-gradient(160deg,#4A1B0C,#D85A30)',
]

export default async function HomePage() {
  const session = await getSession()
  const tours = await prisma.tour.findMany({
    include: { destination: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })
  const destinations = await prisma.destination.findMany({
    include: { _count: { select: { tours: true } } },
    take: 4,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(160deg,#04342C 0%,#0F6E56 50%,#1D9E75 100%)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: '#9FE1CB', marginBottom: 16 }}>✦ дэлхийг нээн илрүүл</p>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(36px,5vw,60px)', color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
          Аяллын <em style={{ color: '#5DCAA5', fontStyle: 'italic' }}>мөрөөдлөө</em><br />биелүүлэх цаг
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: 18, fontWeight: 300, marginBottom: 40 }}>Шилдэг аяллын газруудыг нэг дороос захиалаарай</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tours" style={{ padding: '14px 32px', borderRadius: 50, background: '#fff', color: '#085041', fontWeight: 600, fontSize: 15 }}>
            Аяллуудыг харах →
          </Link>
          {!session && (
            <Link href="/register" style={{ padding: '14px 32px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 500, fontSize: 15, background: 'rgba(255,255,255,0.1)' }}>
              Нэгдэх
            </Link>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[['2,400+', 'Аяллын газар'], ['48K+', 'Хэрэглэгч'], ['98%', 'Сэтгэл ханамж']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: '#fff' }}>{num}</div>
              <div style={{ fontSize: 12, color: '#9FE1CB', fontWeight: 300 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOURS */}
      <section style={{ padding: '3rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28 }}>Шилдэг аяллууд</h2>
          <Link href="/tours" style={{ fontSize: 14, color: '#1D9E75', fontWeight: 500 }}>Бүгдийг харах →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {tours.map((tour, i) => {
            const hasImage = !!tour.image
            return (
              <Link href={`/tours/${tour.id}`} key={tour.id} style={{ display: 'block', borderRadius: 18, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ height: 190, position: 'relative', background: hasImage ? '#000' : GRADIENTS[i % GRADIENTS.length], overflow: 'hidden' }}>
                  {hasImage ? (
                    <img src={tour.image!} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.2 }}>🌍</div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
                  <span style={{ position: 'absolute', bottom: 12, left: 14, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#fff' }}>
                    {tour.destination.country}
                  </span>
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#111' }}>{tour.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>📍 {tour.location}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: '#1D9E75' }}>₮{tour.price.toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}> / хүн</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>💺 {tour.availableSeats}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section style={{ padding: '1rem 2rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, marginBottom: 24 }}>Аяллын газрууд</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {destinations.map((dest, i) => (
            <Link href={`/tours?destination=${dest.id}`} key={dest.id} style={{
              borderRadius: 16, display: 'block', overflow: 'hidden',
              background: dest.image ? '#000' : GRADIENTS[i % GRADIENTS.length],
              padding: '2.5rem 1.5rem 1.5rem', color: '#fff', position: 'relative', minHeight: 160,
            }}>
              {dest.image && <img src={dest.image} alt={dest.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />}
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 4 }}>{dest.name}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>{dest.country}</div>
                <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6 }}>{dest._count.tours} тур</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
