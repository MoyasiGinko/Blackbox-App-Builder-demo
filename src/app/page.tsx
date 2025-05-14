'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroScene from '@/components/three/HeroScene'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })

    tl.to('.hero-text', {
      y: -100,
      opacity: 0,
      stagger: 0.1,
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen">
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-10" />
        <Canvas className="absolute inset-0">
          <HeroScene />
          <Environment preset="city" />
        </Canvas>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text text-4xl md:text-6xl lg:text-8xl font-bold mb-6"
          >
            Beyond Visions
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-text text-2xl md:text-4xl lg:text-6xl font-light mb-12"
          >
            Within Reach
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-text max-w-2xl text-base md:text-lg lg:text-xl opacity-80"
          >
            Lusion is a digital production studio that brings your ideas to life through visually
            captivating designs and interactive experiences.
          </motion.p>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-8">
            Connecting Ideals to Uniquely Crafted Experiences
          </h2>
          <p className="text-base md:text-lg lg:text-xl opacity-80">
            At Lusion, we don't follow trends for the sake of it. We believe in a different approach
            that's centered around you, your audience, and the art of creating a memorable,
            personalized experience.
          </p>
        </div>
      </div>
    </div>
  )
}
