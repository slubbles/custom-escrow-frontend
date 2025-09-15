import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/contexts/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Snarbles - $SNRB Token Sale',
  description: 'Join the Snarbles ecosystem with $SNRB tokens. Access exclusive NFT creation tools across Solana and Algorand networks.',
  keywords: 'Snarbles, SNRB, token sale, NFT tools, Solana, Algorand, blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cream-50 to-forest-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}