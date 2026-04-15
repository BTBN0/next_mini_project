import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import TourForm from '../TourForm'

export default async function NewTourPage() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const destinations = await prisma.destination.findMany({ orderBy: { name: 'asc' } })

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar user={{ name: session.name, role: session.role }} />
      <div style={{ maxWidth: 700, margin: '2rem auto', padding: '0 2rem' }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/admin" style={{ color: '#6b7280', fontSize: 14 }}>← Буцах</Link>
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, marginBottom: 24 }}>Шинэ тур нэмэх</h1>
        <TourForm destinations={destinations} />
      </div>
    </div>
  )
}
