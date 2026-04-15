import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const destinationId = searchParams.get('destination')

    const tours = await prisma.tour.findMany({
      include: { destination: true },
      where: {
        ...(destinationId ? { destinationId } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { location: { contains: q, mode: 'insensitive' } }] } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tours)
  } catch (error) {
    return NextResponse.json({ error: 'Сервер алдаа гарлаа' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Зөвшөөрөл байхгүй' }, { status: 403 })
    }

    const { title, description, price, location, availableSeats, destinationId } = await req.json()

    if (!title || !description || !price || !location || !destinationId) {
      return NextResponse.json({ error: 'Бүх шаардлагатай талбарыг бөглөнө үү' }, { status: 400 })
    }

    const tour = await prisma.tour.create({
      data: { title, description, price, location, availableSeats: availableSeats || 20, destinationId },
    })
    return NextResponse.json(tour, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Сервер алдаа гарлаа' }, { status: 500 })
  }
}
