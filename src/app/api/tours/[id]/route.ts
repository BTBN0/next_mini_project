import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const tour = await prisma.tour.findUnique({ where: { id: params.id }, include: { destination: true } })
  if (!tour) return NextResponse.json({ error: 'Тур олдсонгүй' }, { status: 404 })
  return NextResponse.json(tour)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Зөвшөөрөл байхгүй' }, { status: 403 })
  }
  try {
    const data = await req.json()
    const tour = await prisma.tour.update({ where: { id: params.id }, data })
    return NextResponse.json(tour)
  } catch {
    return NextResponse.json({ error: 'Тур олдсонгүй' }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Зөвшөөрөл байхгүй' }, { status: 403 })
  }
  try {
    await prisma.tour.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Тур олдсонгүй' }, { status: 404 })
  }
}
