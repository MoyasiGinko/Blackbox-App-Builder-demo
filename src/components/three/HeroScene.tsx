'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)

  useEffect(() => {
    if (!materialRef.current) return

    gsap.to(materialRef.current, {
      distort: 0.4,
      duration: 2,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true
    })
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    // Rotate the mesh slowly
    meshRef.current.rotation.y += 0.001
    meshRef.current.rotation.x += 0.001

    // Make it follow the mouse
    const mouse = new THREE.Vector2(
      (state.mouse.x * state.viewport.width) / 2,
      (state.mouse.y * state.viewport.height) / 2
    )
    meshRef.current.position.x += (mouse.x - meshRef.current.position.x) * 0.05
    meshRef.current.position.y += (mouse.y - meshRef.current.position.y) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#ffffff"
        roughness={0.1}
        metalness={0.8}
        distort={0.2}
        speed={2}
      />
    </mesh>
  )
}
