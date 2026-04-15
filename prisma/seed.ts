import { PrismaClient, Role, BookingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nomadly.mn' },
    update: {},
    create: { name: 'Admin', email: 'admin@nomadly.mn', password: adminPassword, role: Role.ADMIN },
  })

  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'bayar@nomadly.mn' },
    update: {},
    create: { name: 'Баяр Дорж', email: 'bayar@nomadly.mn', password: userPassword, role: Role.USER },
  })

  // Destinations with images
  const bali = await prisma.destination.upsert({
    where: { id: 'dest-bali' },
    update: {},
    create: {
      id: 'dest-bali',
      name: 'Бали',
      country: 'Индонези',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      description: 'Бурханы арал гэгддэг, байгаль, соёл, духовность нь зэрэгцэн оршдог арал.',
    },
  })

  const paris = await prisma.destination.upsert({
    where: { id: 'dest-paris' },
    update: {},
    create: {
      id: 'dest-paris',
      name: 'Парис',
      country: 'Франц',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      description: 'Гэрлийн хот. Урлаг, соёл, хоол хүнс, архитектурын гайхамшигт хот.',
    },
  })

  const tokyo = await prisma.destination.upsert({
    where: { id: 'dest-tokyo' },
    update: {},
    create: {
      id: 'dest-tokyo',
      name: 'Токио',
      country: 'Япон',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      description: 'Орчин үеийн технологи болон эртний уламжлал хослосон хот.',
    },
  })

  const dubai = await prisma.destination.upsert({
    where: { id: 'dest-dubai' },
    update: {},
    create: {
      id: 'dest-dubai',
      name: 'Дубай',
      country: 'АНЭУ',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      description: 'Цөлийн дунд босоод зогссон хамгийн орчин үеийн хотуудын нэг.',
    },
  })

  const maldives = await prisma.destination.upsert({
    where: { id: 'dest-maldives' },
    update: {},
    create: {
      id: 'dest-maldives',
      name: 'Мальдив',
      country: 'Мальдив арлууд',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
      description: 'Далайн гайхамшигт арлуудад тайван амрах хамгийн тохиромжтой газар.',
    },
  })

  // Tours with real Unsplash images
  const tour1 = await prisma.tour.upsert({
    where: { id: 'tour-bali-7' },
    update: {},
    create: {
      id: 'tour-bali-7',
      title: 'Бали 7 хоногийн Premium тур',
      description: 'Балийн гайхалшгүй байгаль, соёл, хоол хүнс, темплүүдийг 7 хоногт туршаарай. Убуд хотын ширэнгэн ой, Семиньяк эргийн тэнгис, Тегаллаланг цахиур тариалангийн газраар зочилно.',
      price: 890000,
      location: 'Бали, Индонези',
      availableSeats: 12,
      destinationId: bali.id,
      image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    },
  })

  await prisma.tour.upsert({
    where: { id: 'tour-bali-3' },
    update: {},
    create: {
      id: 'tour-bali-3',
      title: 'Бали 3 хоногийн Express тур',
      description: 'Богино хугацаанд Балийн хамгийн шилдэг газруудыг үзнэ. Темпл, рисийн тариалан, эрэг.',
      price: 450000,
      location: 'Бали, Индонези',
      availableSeats: 20,
      destinationId: bali.id,
      image: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=800&q=80',
    },
  })

  await prisma.tour.upsert({
    where: { id: 'tour-paris-5' },
    update: {},
    create: {
      id: 'tour-paris-5',
      title: 'Парис 5 хоногийн соёлын тур',
      description: 'Эйфелийн цамхаг, Лувр музей, Монмартр дүүрэг зэрэг алдарт газруудаар аялна.',
      price: 1250000,
      location: 'Парис, Франц',
      availableSeats: 8,
      destinationId: paris.id,
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    },
  })

  await prisma.tour.upsert({
    where: { id: 'tour-tokyo-6' },
    update: {},
    create: {
      id: 'tour-tokyo-6',
      title: 'Токио 6 хоногийн хотын тур',
      description: 'Шинжүку, Акихабара, Асакуса зэрэг Токиогийн онцгой дүүргүүдийг туршина.',
      price: 1100000,
      location: 'Токио, Япон',
      availableSeats: 15,
      destinationId: tokyo.id,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    },
  })

  await prisma.tour.upsert({
    where: { id: 'tour-dubai-4' },
    update: {},
    create: {
      id: 'tour-dubai-4',
      title: 'Дубай 4 хоногийн Luxury тур',
      description: 'Бурж Халифа, цөлийн сафари, дэлхийн хамгийн том худалдааны төвүүдийг үзнэ.',
      price: 1450000,
      location: 'Дубай, АНЭУ',
      availableSeats: 10,
      destinationId: dubai.id,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    },
  })

  await prisma.tour.upsert({
    where: { id: 'tour-maldives-5' },
    update: {},
    create: {
      id: 'tour-maldives-5',
      title: 'Мальдив 5 хоногийн Honeymoon тур',
      description: 'Усан дээрх бунгало, шумбалт, далайн үзэсгэлэнтэй нарны жаргалтай хамт мартагдашгүй амралт.',
      price: 1800000,
      location: 'Мальдив арлууд',
      availableSeats: 6,
      destinationId: maldives.id,
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    },
  })

  // Sample booking
  await prisma.booking.upsert({
    where: { id: 'booking-1' },
    update: {},
    create: {
      id: 'booking-1',
      userId: user.id,
      tourId: tour1.id,
      status: BookingStatus.CONFIRMED,
      bookingDate: new Date('2025-06-15'),
      peopleCount: 2,
      totalPrice: 1780000,
    },
  })

  console.log('✅ Seed амжилттай!')
  console.log('👤 Admin: admin@nomadly.mn / admin123')
  console.log('👤 User:  bayar@nomadly.mn  / user123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
