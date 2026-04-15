'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavbarProps {
  user?: { name: string; role: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: 64,
      background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, color: '#085041', display: 'flex', alignItems: 'center', gap: 6 }}>
        ✦ <span style={{ color: '#1D9E75' }}>Nomad</span>ly
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/tours" style={{ padding: '8px 16px', borderRadius: 20, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>
          Аяллууд
        </Link>

        {user ? (
          <>
            <Link href="/dashboard" style={{ padding: '8px 16px', borderRadius: 20, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>
              Хяналтын самбар
            </Link>
            {user.role === 'ADMIN' && (
              <Link href="/admin" style={{ padding: '8px 16px', borderRadius: 20, fontSize: 14, color: '#1D9E75', fontWeight: 500 }}>
                Админ
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#E1F5EE', color: '#085041',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 13,
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} style={{
                padding: '8px 16px', borderRadius: 20, fontSize: 13,
                border: '1px solid rgba(0,0,0,0.08)', background: 'none',
                color: '#6b7280', cursor: 'pointer',
              }}>
                Гарах
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" style={{ padding: '8px 16px', borderRadius: 20, fontSize: 14, color: '#6b7280', fontWeight: 500, border: '1px solid rgba(0,0,0,0.08)' }}>
              Нэвтрэх
            </Link>
            <Link href="/register" style={{ padding: '8px 20px', borderRadius: 20, fontSize: 14, background: '#1D9E75', color: '#fff', fontWeight: 500 }}>
              Бүртгүүлэх
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
