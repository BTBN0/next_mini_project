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

export default async function ToursPage({ searchParams }: { searchParams: { q?: string; destination?: string } }) {
  const session = await getSession()

  const tours = await prisma.tour.findMany({
    include: { destination: true },
    where: {
      ...(searchParams.destination ? { destinationId: searchParams.destination } : {}),
      ...(searchParams.q ? {
        OR: [
          { title: { contains: searchParams.q } },
          { location: { contains: searchParams.q } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar user={session ? { name: session.name, role: session.role } : null} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 6 }}>Бүх аяллууд</h1>
          <p style={{ color: '#6b7280' }}>{tours.length} тур олдлоо</p>
        </div>

        {/* Search */}
        <form method="GET" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 10, maxWidth: 480 }}>
            <input name="q" defaultValue={searchParams.q} placeholder="Аяллын нэр эсвэл газраар хай..."
              style={{ flex: 1, padding: '11px 16px', borderRadius: 50, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, background: '#fff', outline: 'none' }} />
            <button type="submit" style={{ padding: '11px 24px', borderRadius: 50, border: 'none', background: '#1D9E75', color: '#fff', fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Хайх
            </button>
          </div>
        </form>

        {tours.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: 16 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 8 }}>Тур олдсонгүй</div>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Өөр түлхүүр үгээр хайж үзнэ үү</p>
            <Link href="/tours" style={{ padding: '10px 24px', borderRadius: 50, background: '#1D9E75', color: '#fff', fontWeight: 500, fontSize: 14 }}>
              Бүгдийг харах
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {tours.map((tour, i) => {
              const hasImage = !!tour.image
              return (
                <Link href={`/tours/${tour.id}`} key={tour.id} style={{ display: 'block', borderRadius: 18, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', textDecoration: 'none' }}>
                  {/* Image or gradient */}
                  <div style={{ height: 210, position: 'relative', background: hasImage ? '#000' : GRADIENTS[i % GRADIENTS.length], overflow: 'hidden' }}>
                    {hasImage ? (
                      <img src={tour.image!} alt={tour.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.3 }}>🌍</div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {tour.destination.country}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>💺 {tour.availableSeats}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6, color: '#111', lineHeight: 1.3 }}>{tour.title}</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tour.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12 }}>
                      <div>
                        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#1D9E75' }}>₮{tour.price.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}> / хүн</span>
                      </div>
                      <span style={{ fontSize: 13, color: '#1D9E75', fontWeight: 600 }}>Захиалах →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
