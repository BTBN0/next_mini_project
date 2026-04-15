import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import BookingForm from './BookingForm'

const GRADIENT_COLORS = [
  'linear-gradient(160deg,#04342C 0%,#1D9E75 100%)',
  'linear-gradient(160deg,#042C53 0%,#378ADD 100%)',
  'linear-gradient(160deg,#4B1528 0%,#D4537E 100%)',
  'linear-gradient(160deg,#412402 0%,#BA7517 100%)',
  'linear-gradient(160deg,#085041 0%,#5DCAA5 100%)',
  'linear-gradient(160deg,#4A1B0C 0%,#D85A30 100%)',
]

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    include: { destination: true },
  })
  if (!tour) notFound()

  const colorIndex = tour.title.length % GRADIENT_COLORS.length
  const hasImage = !!tour.image

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />

      {/* Hero */}
      <div style={{
        height: 380, position: 'relative', overflow: 'hidden',
        background: hasImage ? '#000' : GRADIENT_COLORS[colorIndex],
        display: 'flex', alignItems: 'flex-end',
      }}>
        {hasImage && (
          <img src={tour.image!} alt={tour.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        )}
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

        <Link href="/tours" style={{
          position: 'absolute', top: 20, left: 20,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 20, border: '1px solid rgba(255,255,255,0.3)',
        }}>←</Link>

        <div style={{ position: 'relative', padding: '2rem', width: '100%' }}>
          <div style={{
            display: 'inline-block', background: '#D85A30', color: '#fff',
            borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600, marginBottom: 10,
          }}>
            📍 {tour.destination.country}
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(24px,4vw,40px)', color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
            {tour.title}
          </h1>
          <div style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.85)', fontSize: 14, flexWrap: 'wrap' }}>
            <span>📍 {tour.location}</span>
            <span>💺 {tour.availableSeats} суудал үлдсэн</span>
            <span>⭐ 4.9 үнэлгээ</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div>
          {/* About */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 12 }}>Аяллын тухай</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: 15 }}>{tour.description}</p>
          </div>

          {/* Highlights */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 16 }}>Багцад орсон зүйлс</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['🏨', '5 одтой зочид буудал'],
                ['🍳', 'Өдөр бүр өглөөний цай'],
                ['🎯', 'Мэргэжлийн хөтөч'],
                ['🚌', 'Трансфер үйлчилгээ'],
                ['🛡️', 'Аялалын даатгал'],
                ['📸', 'Гэрэл зургийн тур'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, padding: '10px 12px', background: '#f8f9fa', borderRadius: 10 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div style={{ background: '#E1F5EE', borderRadius: 12, padding: '1rem 1.25rem' }}>
            <div style={{ fontWeight: 600, color: '#085041', marginBottom: 4 }}>💡 Анхаарах зүйл</div>
            <div style={{ fontSize: 13, color: '#0F6E56' }}>Захиалга хийхийн өмнө нэвтэрсэн байх шаардлагатай. Захиалсны дараа имэйлээр баталгаажуулалт ирнэ.</div>
          </div>
        </div>

        {/* Booking card */}
        <div>
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '1.5rem', position: 'sticky', top: 80 }}>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 38, color: '#085041' }}>
              ₮{tour.price.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>нэг хүнд / ВАТ багтсан</div>

            {session ? (
              <BookingForm tourId={tour.id} price={tour.price} availableSeats={tour.availableSeats} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Захиалга хийхийн тулд нэвтэрнэ үү</div>
                <Link href={`/login?redirect=/tours/${tour.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}>
                  Нэвтрэх →
                </Link>
                <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '11px 24px', borderRadius: 50, border: '1px solid rgba(0,0,0,0.08)', fontSize: 14, fontWeight: 500, color: '#374151' }}>
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
