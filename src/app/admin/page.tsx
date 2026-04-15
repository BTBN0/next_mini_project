import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import LogoutButton from '@/components/ui/LogoutButton'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'ADMIN') redirect('/dashboard')

  const [userCount, tourCount, bookingCount, users, tours, bookings] = await Promise.all([
    prisma.user.count(),
    prisma.tour.count(),
    prisma.booking.count(),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.tour.findMany({ include: { destination: true }, orderBy: { createdAt: 'desc' } }),
    prisma.booking.findMany({
      include: { user: true, tour: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  const totalRevenue = await prisma.booking.aggregate({
    where: { status: 'CONFIRMED' },
    _sum: { totalPrice: true },
  })

  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Батлагдсан',
    PENDING: 'Хүлээгдэж буй',
    CANCELLED: 'Цуцлагдсан',
  }

  return (
    <div>
      <Navbar user={{ name: session.name, role: session.role }} />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#fff', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '1.5rem 0', flexShrink: 0 }}>
          <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#E6F1FB', color: '#0C447C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{session.name}</div>
            <span className="badge badge-blue" style={{ marginTop: 4 }}>ADMIN</span>
          </div>

          {[
            { href: '/admin', label: 'Тойм', icon: '📊', active: true },
            { href: '/admin/tours/new', label: 'Тур нэмэх', icon: '➕' },
            { href: '/dashboard', label: 'User хэсэг', icon: '🏠' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 1.5rem',
              fontSize: 14, color: item.active ? '#085041' : '#6b7280', fontWeight: item.active ? 500 : 400,
              background: item.active ? '#E1F5EE' : 'none',
              borderRight: item.active ? '2px solid #1D9E75' : 'none',
            }}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}

          <div style={{ padding: '0 1.5rem', marginTop: 16 }}>
            <LogoutButton />
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, marginBottom: 4 }}>Админ хяналтын самбар</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Бүх системийн мэдээлэл</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Нийт хэрэглэгч', value: userCount, color: '#1D9E75' },
              { label: 'Нийт тур', value: tourCount, color: '#BA7517' },
              { label: 'Захиалга', value: bookingCount, color: '#378ADD' },
              { label: 'Орлого', value: `₮${((totalRevenue._sum.totalPrice || 0) / 1000000).toFixed(1)}M`, color: '#D85A30' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#f8f9fa', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <Section title="Хэрэглэгчид">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Нэр', 'И-мэйл', 'Роль', 'Огноо'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E1F5EE', color: '#085041', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{user.email}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-blue' : 'badge-green'}`}>{user.role}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      {new Date(user.createdAt).toLocaleDateString('mn-MN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Tours Table */}
          <Section title="Tourууд" action={<Link href="/admin/tours/new" className="btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}>+ Шинэ тур</Link>}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Тур', 'Газар', 'Үнэ', 'Суудал', 'Үйлдэл'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tours.map(tour => (
                  <tr key={tour.id}>
                    <td style={{ padding: '12px', fontWeight: 500, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{tour.title}</td>
                    <td style={{ padding: '12px', color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{tour.destination.country}</td>
                    <td style={{ padding: '12px', color: '#1D9E75', fontWeight: 500, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>₮{tour.price.toLocaleString()}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{tour.availableSeats}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/admin/tours/${tour.id}/edit`} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, border: '1px solid #378ADD', color: '#0C447C', background: '#E6F1FB' }}>Засах</Link>
                        <DeleteTourButton tourId={tour.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Bookings Table */}
          <Section title="Захиалгууд">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Хэрэглэгч', 'Тур', 'Огноо', 'Дүн', 'Төлөв'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{booking.user.name}</td>
                    <td style={{ padding: '12px', color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{booking.tour.title}</td>
                    <td style={{ padding: '12px', color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>{new Date(booking.bookingDate).toLocaleDateString('mn-MN')}</td>
                    <td style={{ padding: '12px', color: '#1D9E75', fontWeight: 500, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>₮{booking.totalPrice.toLocaleString()}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <span className={`badge status-${booking.status}`}>{statusLabels[booking.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </main>
      </div>
    </div>
  )
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20 }}>{title}</h2>
        {action}
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function DeleteTourButton({ tourId }: { tourId: string }) {
  return (
    <form action={`/api/tours/${tourId}`} method="POST">
      <input type="hidden" name="_method" value="DELETE" />
      <button type="submit" style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, border: '1px solid #E24B4A', color: '#791F1F', background: '#FCEBEB', cursor: 'pointer' }}>
        Устгах
      </button>
    </form>
  )
}
