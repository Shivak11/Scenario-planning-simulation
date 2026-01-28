import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Strategic Futures Lab',
  description: 'AI-powered scenario planning simulation for strategic decision-making',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-navy-50">
        {children}
      </body>
    </html>
  )
}
