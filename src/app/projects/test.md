'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import \* as THREE from 'three'
import { useThree, Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Preload, MeshDistortMaterial, Text, Float } from '@react-three/drei'

// Sample project data with images
const projects = [
{
title: 'Devin AI',
tags: ['web', 'design', 'development', '3d'],
href: '/projects/devin_ai',
image: '/api/placeholder/600/400',
color: '#5D3FD3',
shape: 'sphere',
},
{
title: 'Porsche: Dream Machine',
tags: ['concept', '3D illustration', 'mograph', 'video'],
href: '/projects/porsche_dream_machine',
image: '/api/placeholder/600/400',
color: '#FF5733',
shape: 'torus',
},
{
title: 'Synthetic Human',
tags: ['web', 'design', 'development', '3d'],
href: '/projects/synthetic_human',
image: '/api/placeholder/600/400',
color: '#25CCF7',
shape: 'icosahedron',
},
{
title: 'DDD 2024',
tags: ['web', 'design', 'development', '3d'],
href: '/projects/ddd_2024',
image: '/api/placeholder/600/400',
color: '#55E6C1',
shape: 'octahedron',
},
{
title: 'Spaace - NFT Marketplace',
tags: ['web', 'design', 'development', '3d', 'web3'],
href: '/projects/spaace',
image: '/api/placeholder/600/400',
color: '#CAD3C8',
shape: 'sphere',
},
{
title: 'Choo Choo World',
tags: ['concept', 'web', 'game design', '3d'],
href: '/projects/choo_choo_world',
image: '/api/placeholder/600/400',
color: '#F8EFBA',
shape: 'torus',
},
{
title: 'Zero Tech',
tags: ['web', 'design', 'development', '3d'],
href: '/projects/zero_tech',
image: '/api/placeholder/600/400',
color: '#BDC581',
shape: 'sphere',
},
{
title: 'Meta: Spatial Fusion',
tags: ['api design', 'webgl', '3d'],
href: '/projects/spatial_fusion',
image: '/api/placeholder/600/400',
color: '#D6A2E8',
shape: 'dodecahedron',
},
{
title: 'Worldcoin Globe',
tags: ['web', 'design', 'development', '3d'],
href: '/projects/worldcoin',
image: '/api/placeholder/600/400',
color: '#1B9CFC',
shape: 'sphere',
},
{
title: 'Lusion Labs',
tags: ['concept', 'design', 'development', '3d'],
href: '/projects/lusion_labs',
image: '/api/placeholder/600/400',
color: '#6D214F',
shape: 'icosahedron',
},
{
title: 'My Little Storybook',
tags: ['AR', 'development', '3d'],
href: '/projects/my_little_story_book',
image: '/api/placeholder/600/400',
color: '#FD7272',
shape: 'tetrahedron',
},
{
title: 'Soda Experience',
tags: ['concept', 'design', 'development', '3d'],
href: '/projects/soda_experience',
image: '/api/placeholder/600/400',
color: '#2C3A47',
shape: 'torus',
},
{
title: 'Infinite Passerella',
tags: ['design', 'development', '3d'],
href: '/projects/infinite_passerella',
image: '/api/placeholder/600/400',
color: '#EAB543',
shape: 'sphere',
},
{
title: 'The Turn Of The Screw',
tags: ['development', '3D'],
href: '/projects/the_turn_of_the_screw',
image: '/api/placeholder/600/400',
color: '#A3CB38',
shape: 'octahedron',
},
{
title: 'Max Mara: Bearing Gifts',
tags: ['development', '3D'],
href: '/projects/maxmara_bearings_gifts',
image: '/api/placeholder/600/400',
color: '#F97F51',
shape: 'sphere',
},
]

// Neural network-inspired background
const NeuralNetworkBackground = () => {
const particlesRef = useRef()
const linesRef = useRef()

useEffect(() => {
// Create scene
const scene = new THREE.Scene()

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Append to DOM
    const container = document.getElementById('neural-background')
    container.appendChild(renderer.domElement)

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    // Create particles
    const particleCount = 150
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = []

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = (Math.random() - 0.5) * 50
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 50
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 20

      particleSpeeds.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.01
      })
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    )

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.7
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // Create lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x1a86ff,
      transparent: true,
      opacity: 0.15
    })

    const lines = new THREE.Group()
    scene.add(lines)
    linesRef.current = lines

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate)

      // Update particle positions
      const positions = particleGeometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        positions[i3] += particleSpeeds[i].x
        positions[i3 + 1] += particleSpeeds[i].y
        positions[i3 + 2] += particleSpeeds[i].z

        // Boundary check and bounce
        if (Math.abs(positions[i3]) > 25) particleSpeeds[i].x *= -1
        if (Math.abs(positions[i3 + 1]) > 25) particleSpeeds[i].y *= -1
        if (Math.abs(positions[i3 + 2]) > 10) particleSpeeds[i].z *= -1
      }

      particleGeometry.attributes.position.needsUpdate = true

      // Update connections
      while (lines.children.length) {
        lines.remove(lines.children[0])
      }

      const threshold = 6

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const p1 = {
          x: positions[i3],
          y: positions[i3 + 1],
          z: positions[i3 + 2]
        }

        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3
          const p2 = {
            x: positions[j3],
            y: positions[j3 + 1],
            z: positions[j3 + 2]
          }

          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.y - p2.y, 2) +
            Math.pow(p1.z - p2.z, 2)
          )

          if (distance < threshold) {
            const lineOpacity = 1 - (distance / threshold)
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(p1.x, p1.y, p1.z),
              new THREE.Vector3(p2.x, p2.y, p2.z)
            ])

            const line = new THREE.Line(
              lineGeometry,
              new THREE.LineBasicMaterial({
                color: 0x1a86ff,
                transparent: true,
                opacity: lineOpacity * 0.4
              })
            )

            lines.add(line)
          }
        }
      }

      // Slow rotation of entire system
      particles.rotation.y += 0.0005
      lines.rotation.y += 0.0005

      renderer.render(scene, camera)
    }

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }

}, [])

return <div id="neural-background" className="fixed top-0 left-0 w-full h-full z-0" />
}

// Morphing 3D object component
const MorphingShape = ({ shape, color, hovering }) => {
const meshRef = useRef()
const speedFactor = useRef(Math.random() \* 0.5 + 0.3)

// Create shape based on type
let geometry

switch (shape) {
case 'sphere':
geometry = new THREE.SphereGeometry(1, 32, 32)
break
case 'torus':
geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 32)
break
case 'icosahedron':
geometry = new THREE.IcosahedronGeometry(1, 0)
break
case 'dodecahedron':
geometry = new THREE.DodecahedronGeometry(1, 0)
break
case 'octahedron':
geometry = new THREE.OctahedronGeometry(1, 0)
break
case 'tetrahedron':
geometry = new THREE.TetrahedronGeometry(1, 0)
break
default:
geometry = new THREE.SphereGeometry(1, 32, 32)
}

useFrame((state) => {
if (!meshRef.current) return

    const time = state.clock.getElapsedTime()

    // Rotation animation
    meshRef.current.rotation.x = Math.sin(time * speedFactor.current) * 0.3
    meshRef.current.rotation.y = Math.cos(time * speedFactor.current * 0.8) * 0.4

    // Scale based on hover state
    meshRef.current.scale.setScalar(
      hovering ? 1.2 + Math.sin(time * 4) * 0.05 : 1 + Math.sin(time * 2) * 0.05
    )

})

return (
<mesh ref={meshRef} geometry={geometry}>
<MeshDistortMaterial
color={color}
speed={hovering ? 5 : 2}
distort={hovering ? 0.6 : 0.3}
radius={1}
roughness={0.2}
metalness={0.8}
/>
</mesh>
)
}

// Project card with 3D object
const ProjectCard = ({ project, index }) => {
const [hovered, setHovered] = useState(false)
const springConfig = { stiffness: 150, damping: 15 }
const x = useMotionValue(0)
const y = useMotionValue(0)

const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), springConfig)
const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), springConfig)

const handleMouseMove = (e) => {
const rect = e.currentTarget.getBoundingClientRect()
const centerX = rect.left + rect.width / 2
const centerY = rect.top + rect.height / 2
x.set(e.clientX - centerX)
y.set(e.clientY - centerY)
}

return (
<motion.div
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: index * 0.1 }}
className="relative h-full" >
<motion.div
style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000
        }}
onMouseMove={handleMouseMove}
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => {
setHovered(false)
x.set(0)
y.set(0)
}}
whileHover={{ z: 20 }}
className="h-full" >
<Link href={project.href} className="block h-full">
<div className="bg-black bg-opacity-40 backdrop-blur-sm border border-white/10 p-4 rounded-xl overflow-hidden h-full transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-blue-500/10 relative">
{/_ 3D canvas _/}
<div className="absolute -top-8 -right-8 w-32 h-32 opacity-80">
<Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
<ambientLight intensity={0.4} />
<directionalLight position={[10, 10, 5]} intensity={0.8} />
<Suspense fallback={null}>
<MorphingShape
                    shape={project.shape}
                    color={project.color}
                    hovering={hovered}
                  />
</Suspense>
<Preload all />
</Canvas>
</div>

            {/* Project image */}
            <div className="relative mb-4 overflow-hidden rounded-lg w-full aspect-video">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1.1 }}
                animate={{ scale: hovered ? 1.15 : 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Project info */}
            <div>
              <motion.h2
                className="text-xl font-bold mb-2 text-white/90"
                animate={{ x: hovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.title}
              </motion.h2>

              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>

)
}

// AI assistant floating element
const AIAssistant = () => {
const [visible, setVisible] = useState(false)
const [pulsing, setPulsing] = useState(true)

useEffect(() => {
// Show assistant after a delay
const timer = setTimeout(() => {
setVisible(true)
}, 3000)

    return () => clearTimeout(timer)

}, [])

return (
<motion.div
className="fixed bottom-6 right-6 z-50"
initial={{ opacity: 0, scale: 0.8, y: 20 }}
animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
        y: visible ? 0 : 20
      }}
transition={{ duration: 0.5 }} >
<motion.div
className="relative w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
animate={{
          boxShadow: pulsing
            ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 12px rgba(59, 130, 246, 0)']
            : '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
transition={{
          boxShadow: {
            duration: 2,
            repeat: pulsing ? Infinity : 0,
            repeatType: 'loop'
          }
        }}
onClick={() => setPulsing(false)} >
<svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
<path
            d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4ZM12 14C16.4183 14 20 15.7909 20 18V20H4V18C4 15.7909 7.58172 14 12 14Z"
            fill="currentColor"
          />
</svg>
</motion.div>
</motion.div>
)
}

// Main component
export default function Projects() {
const [loading, setLoading] = useState(true)
const [filter, setFilter] = useState('all')

useEffect(() => {
// Simulate loading time
const timer = setTimeout(() => {
setLoading(false)
}, 1500)

    return () => clearTimeout(timer)

}, [])

// Filter projects based on selected filter
const filteredProjects = filter === 'all'
? projects
: projects.filter(project => project.tags.includes(filter))

// Available tags for filtering
const allTags = ['all', ...new Set(projects.flatMap(project => project.tags))]

return (
<div className="relative min-h-screen bg-black text-white overflow-hidden">
{/_ Neural network background _/}
<NeuralNetworkBackground />

      {/* Loading overlay */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 1 : 0, pointerEvents: loading ? 'auto' : 'none' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["25%", "25%", "50%", "50%", "25%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
          className="w-16 h-16 bg-blue-500"
        />
      </motion.div>

      {/* AI floating assistant */}
      <AIAssistant />

      {/* Main content */}
      <div className="min-h-screen pt-24 pb-16 container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Header with title animation */}
          <motion.div
            className="mb-16 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                PROJECTS
              </span>
            </h1>

            {/* Floating particles around title */}
            <Canvas className="absolute inset-0 -z-10 pointer-events-none">
              <ambientLight intensity={0.5} />
              <Float
                speed={4}
                rotationIntensity={1}
                floatIntensity={2}
              >
                <Text
                  fontSize={1.2}
                  color="#ffffff"
                  position={[0, 0, 0]}
                  opacity={0.05}
                >
                  PROJECTS
                </Text>
              </Float>
            </Canvas>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="mb-12 overflow-x-auto py-2 scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex gap-2 min-w-max px-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${
                    filter === tag
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/70'
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-white/60">No projects found with this filter.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>

)
}
