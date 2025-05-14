'use client'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function ExperimentalScene() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!meshRef.current) return

    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.1}
        metalness={0.8}
        wireframe
      />
    </mesh>
  )
}

export default function Labs() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            LABS
          </h1>
          <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto opacity-80">
            Welcome to our experimental playground where we push the boundaries of digital experiences
            and explore new possibilities in interactive design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="aspect-square relative">
            <Canvas className="absolute inset-0">
              <ExperimentalScene />
              <Environment preset="studio" />
            </Canvas>
          </div>
          <div className="flex flex-col justify-center p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Experimental WebGL</h2>
            <p className="text-base md:text-lg opacity-80">
              Exploring the possibilities of real-time 3D graphics in the browser using WebGL and
              Three.js. These experiments help us push the boundaries of what's possible in web-based
              3D experiences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="bg-white bg-opacity-5 p-6 rounded-lg"
            >
              <h3 className="text-lg md:text-xl font-bold mb-4">Research Area {i}</h3>
              <ul className="space-y-2 opacity-80">
                <li>Advanced Shading</li>
                <li>Physics Simulations</li>
                <li>Particle Systems</li>
                <li>Real-time Effects</li>
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
