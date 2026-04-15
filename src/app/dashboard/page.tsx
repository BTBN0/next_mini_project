import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import LogoutButton from '@/components/ui/LogoutButton'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const bookings = await prisma.booking.findMany({
    where: { userId: session.userId },
    include: { tour: { include: { destination: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length
  const pending = bookings.filter(b => b.status === 'PENDING').length
  const totalSpent = bookings.filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + b.totalPrice, 0)

  const statusColors: Record<string, string> = {
    CONFIRMED: 'status-CONFIRMED',
    PENDING: 'status-PENDING',
    CANCELLED: 'status-CANCELLED',
  }
  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Батлагдсан',
    PENDING: 'Хүлээгдэж буй',
    CANCELLED: 'Цуцлагдсан',
  }

  const cardColors = [
    'linear-gradient(135deg,#04342C,#1D9E75)',
    'linear-gradient(135deg,#042C53,#378ADD)',
    'linear-gradient(135deg,#4B1528,#D4537E)',
    'linear-gradient(135deg,#412402,#BA7517)',
  ]

  return (
    <div>
      <Navbar user={{ name: session.name, role: session.role }} />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#fff', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '1.5rem 0', flexShrink: 0 }}>
          <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#E1F5EE', color: '#085041', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{session.name}</div>
            <span className="badge badge-green" style={{ marginTop: 4 }}>USER</span>
          </div>

          {[
            { href: '/dashboard', label: 'Хяналтын самбар', icon: '🏠', active: true },
            { href: '/tours', label: 'Аяллууд', icon: '🗺️' },
            { href: '/dashboard/profile', label: 'Профайл', icon: '👤' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 1.5rem',
              fontSize: 14, color: item.active ? '#085041' : '#6b7280', fontWeight: item.active ? 500 : 400,
              background: item.active ? '#E1F5EE' : 'none',
              borderRight: item.active ? '2px solid #1D9E75' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
            </Link>
          ))}

          <div style={{ padding: '0 1.5rem', marginTop: 16 }}>
            <LogoutButton />
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, marginBottom: 4 }}>
            Сайн байна уу, {session.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Таны аяллын мэдээлэл энд байна</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Нийт захиалга', value: bookings.length, color: '#1D9E75' },
              { label: 'Зарцуулсан дүн', value: `₮${(totalSpent / 1000000).toFixed(1)}M`, color: '#BA7517' },
              { label: 'Хүлээгдэж буй', value: pending, color: '#D85A30' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20 }}>Миний захиалгууд</h2>
            <Link href="/tours" className="btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>+ Шинэ захиалга</Link>
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Захиалга байхгүй байна</div>
              <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>Аяллаа эхлүүлж мөрөөдлөө биелүүлцгээе!</div>
              <Link href="/tours" className="btn-primary">Аяллуудыг харах →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map((booking, i) => (
                <div key={booking.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 10, background: cardColors[i % cardColors.length], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{booking.tour.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {new Date(booking.bookingDate).toLocaleDateString('mn-MN')} • {booking.peopleCount} хүн
                    </div>
                  </div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#1D9E75', marginRight: 12 }}>
                    ₮{booking.totalPrice.toLocaleString()}
                  </div>
                  <span className={`badge ${statusColors[booking.status]}`}>
                    {statusLabels[booking.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
