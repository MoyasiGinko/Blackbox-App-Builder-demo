'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'

// This component contains the 3D elements and will be used inside the Canvas
function ProgressBar({ progress }: { progress: number }) {
  const barRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (barRef.current) {
      // Scale the bar width based on progress
      barRef.current.scale.x = progress / 100
    }
  })

  return (
    <mesh ref={barRef} position={[-0.5, 0, 0]}>
      <planeGeometry args={[1, 0.1]} />
      <meshBasicMaterial color="#00ff99" />
    </mesh>
  )
}

export default function LoadingBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    // Animate progress from 0 to 100 over 2 seconds
    gsap.to({}, {
      duration: 2,
      onUpdate: function() {
        setProgress(this.progress() * 100)
      },
      onComplete: function() {
        setProgress(100)
      }
    })
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 100] }} style={{ height: '100%', width: '100%' }}>
        <ProgressBar progress={progress} />
      </Canvas>
    </div>
  )
}