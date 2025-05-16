'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ProjectBox({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      // Simple rotation animation
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x += 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    tl.to(containerRef.current, {
      y: -200,
      ease: 'power1.out',
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section ref={containerRef} className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4 py-24">
      <h2 className="text-4xl font-bold mb-12">Projects</h2>
      <div className="w-full max-w-6xl h-96 relative">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <ProjectBox position={[-2.5, 0, 0]} color="#ff0055" />
          <ProjectBox position={[0, 0, 0]} color="#00ff99" />
          <ProjectBox position={[2.5, 0, 0]} color="#0055ff" />
        </Canvas>
      </div>
      <p className="max-w-3xl mt-12 text-center text-lg opacity-80">
        Explore some of our featured projects, each crafted with attention to detail and innovative design.
      </p>
    </section>
  )
}
