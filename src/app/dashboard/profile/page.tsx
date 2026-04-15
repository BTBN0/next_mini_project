import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import LogoutButton from '@/components/ui/LogoutButton'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, image: true, bio: true, phone: true, createdAt: true, _count: { select: { bookings: true } } },
  })
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar user={{ name: session.name, role: session.role }} />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#fff', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '1.5rem 0', flexShrink: 0 }}>
          <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: user.image ? '#000' : '#E1F5EE', overflow: 'hidden', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.image
                ? <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#085041', fontWeight: 600, fontSize: 14 }}>{user.name.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
            <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: '#E1F5EE', color: '#085041' }}>USER</span>
          </div>

          {[
            { href: '/dashboard', label: 'Хяналтын самбар', icon: '🏠' },
            { href: '/tours', label: 'Аяллууд', icon: '🗺️' },
            { href: '/dashboard/profile', label: 'Профайл', icon: '👤', active: true },
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
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, marginBottom: 4 }}>Миний профайл</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>Хувийн мэдээллээ шинэчлэх</p>

          {/* Profile header card */}
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '1.5rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: user.image ? '#000' : 'linear-gradient(135deg,#1D9E75,#085041)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.image
                ? <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#fff' }}>{user.name.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22 }}>{user.name}</div>
              <div style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }}>{user.email}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13 }}>
                <span style={{ color: '#1D9E75', fontWeight: 500 }}>✈️ {user._count.bookings} захиалга</span>
                <span style={{ color: '#6b7280' }}>📅 {new Date(user.createdAt).toLocaleDateString('mn-MN')}-аас гишүүн</span>
              </div>
            </div>
          </div>

          <ProfileForm user={{
            name: user.name,
            email: user.email,
            image: user.image || '',
            bio: user.bio || '',
            phone: user.phone || '',
          }} />
        </main>
      </div>
    </div>
  )
}
