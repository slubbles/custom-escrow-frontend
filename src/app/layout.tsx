import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/contexts/Providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TokenSale Platform - Multi-Project Token Sales',
  description: 'Launch and invest in token sales across multiple projects. Advanced marketplace with AI-powered discovery.',
  keywords: 'token sale, crypto, blockchain, Solana, investment, presale, marketplace',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}