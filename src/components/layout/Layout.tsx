'use client'

import { ReactNode } from 'react'
import Navigation from './Navigation'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Navigation />
      {/* Add left margin for larger screens for the sidebar */}
      <motion.main
        className="pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
