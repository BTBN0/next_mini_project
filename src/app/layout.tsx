import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nomadly — Travel Booking SaaS',
  description: 'Дэлхийн шилдэг аяллын газруудыг нэг дороос захиалаарай',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  )
}
