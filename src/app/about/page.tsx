'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sections = gsap.utils.toArray('.expertise-section')
    
    sections.forEach((section: any) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: section,
          start: 'top center+=100',
          end: 'bottom center',
          scrub: 1,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const expertiseAreas = [
    {
      title: 'Strategy',
      items: [
        'Experience Strategy',
        'Technology Strategy',
        'Creative Direction',
        'Discovery',
        'Research',
      ],
    },
    {
      title: 'Creative',
      items: [
        'Art Direction',
        'UX/UI Design',
        'Motion Design',
        'Game Design',
        'Illustration',
      ],
    },
    {
      title: 'Tech',
      items: [
        'WebGL Development',
        'Web Development',
        'Unity/Unreal',
        'Interactive Installations',
        'VR/AR',
      ],
    },
    {
      title: 'Production',
      items: [
        'Procedural Modeling',
        '3D Asset Creation',
        '3D Asset Optimization',
        'Animation',
        '3D Pipeline',
      ],
    },
  ]

  return (
    <div ref={containerRef} className="min-h-screen pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-32">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            WE ARE
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-light mb-16">
            A CREATIVE
            <br />
            PRODUCTION STUDIO
          </h2>
          <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto opacity-80">
            A world wide team of experienced and skilled professionals who bring a wide range of talents
            and perspectives to a project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-32">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4">001</h3>
            <h4 className="text-lg md:text-xl mb-2">Edan Kwan</h4>
            <p className="text-base md:text-lg opacity-80">Cofounder & Creative Director</p>
          </div>
          <div>
            <p className="text-base md:text-lg opacity-80">
              As a result of our diverse experience, we are able to think creatively and find new
              solutions to problems, providing clients with memorable, purpose-driven experiences that
              cut through the noise and connect where it matters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {expertiseAreas.map((area, index) => (
            <div key={area.title} className="expertise-section">
              <h3 className="text-xl md:text-2xl font-bold mb-8">{area.title}</h3>
              <ul className="space-y-4">
                {area.items.map((item) => (
                  <li key={item} className="text-base md:text-lg opacity-80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
