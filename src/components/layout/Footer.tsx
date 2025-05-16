'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const pageOrder = ['/', '/about', '/projects', '/contact']

export default function Footer() {
  const router = useRouter()
  const footerRef = useRef<HTMLDivElement>(null)
  const scrollTriggered = useRef(false)

  useEffect(() => {
    if (!footerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnterBack: () => {
        scrollTriggered.current = false
      },
      onLeave: () => {
        if (!scrollTriggered.current) {
          scrollTriggered.current = true
          // Determine current path and next path
          const currentPath = window.location.pathname
          const currentIndex = pageOrder.indexOf(currentPath)
          const nextIndex = (currentIndex + 1) % pageOrder.length
          const nextPath = pageOrder[nextIndex]

          // Animate footer fade out and navigate
          gsap.to(footerRef.current, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              router.push(nextPath)
            },
          })
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [router])

  return (
    <motion.footer
      ref={footerRef}
      className="w-full bg-gray-900 text-white py-12 flex flex-col items-center justify-center relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl w-full px-6 flex justify-between items-center">
        <div className="text-sm uppercase tracking-widest">Keep Scrolling to Learn More</div>
        <div className="flex items-center space-x-2 cursor-pointer select-none">
          <span className="uppercase tracking-widest">Next Page</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </motion.footer>
  )
}
