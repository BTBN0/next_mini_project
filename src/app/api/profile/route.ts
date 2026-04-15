import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, image: true, bio: true, phone: true, createdAt: true },
  })
  if (!user) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 })

  try {
    const { name, image, bio, phone, currentPassword, newPassword } = await req.json()

    // If changing password, verify current
    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: 'Одоогийн нууц үгээ оруулна уу' }, { status: 400 })
      const user = await prisma.user.findUnique({ where: { id: session.userId } })
      const valid = await bcrypt.compare(currentPassword, user!.password)
      if (!valid) return NextResponse.json({ error: 'Одоогийн нууц үг буруу байна' }, { status: 400 })
      if (newPassword.length < 8) return NextResponse.json({ error: 'Нууц үг 8-аас дээш тэмдэгт байх ёстой' }, { status: 400 })
    }

    const updateData: any = { name, image: image || null, bio: bio || null, phone: phone || null }
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, image: true, bio: true, phone: true },
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Сервер алдаа гарлаа' }, { status: 500 })
  }
}
