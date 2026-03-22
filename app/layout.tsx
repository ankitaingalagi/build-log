import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Build Log',
  description: 'A public wall where people post what they shipped.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body style={{ minHeight: '100vh', background: 'var(--background)' }}>{children}</body>
    </html>
  )
}
