'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0', width: '100%',
      fontSize: 14, color: '#E24B4A', background: 'none', border: 'none', cursor: 'pointer',
    }}>
      🚪 Гарах
    </button>
  )
}
