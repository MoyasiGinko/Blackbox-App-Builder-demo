import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Layout from '@/components/layout/Layout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lusion - Digital Production Studio',
  description: 'We help brands create digital experiences that connect with their audience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
