import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })
    }

    const { tourId, bookingDate, peopleCount, totalPrice } = await req.json()

    if (!tourId || !bookingDate || !peopleCount || !totalPrice) {
      return NextResponse.json({ error: 'Бүх талбарыг бөглөнө үү' }, { status: 400 })
    }

    const tour = await prisma.tour.findUnique({ where: { id: tourId } })
    if (!tour) return NextResponse.json({ error: 'Тур олдсонгүй' }, { status: 404 })
    if (tour.availableSeats < peopleCount) {
      return NextResponse.json({ error: 'Хангалттай суудал байхгүй байна' }, { status: 400 })
    }

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          userId: session.userId,
          tourId,
          bookingDate: new Date(bookingDate),
          peopleCount,
          totalPrice,
          status: 'PENDING',
        },
      }),
      prisma.tour.update({
        where: { id: tourId },
        data: { availableSeats: { decrement: peopleCount } },
      }),
    ])

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Сервер алдаа гарлаа' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

    const where = session.role === 'ADMIN' ? {} : { userId: session.userId }
    const bookings = await prisma.booking.findMany({
      where,
      include: { tour: { include: { destination: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Сервер алдаа гарлаа' }, { status: 500 })
  }
}
