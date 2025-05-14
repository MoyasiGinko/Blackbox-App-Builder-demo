'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Devin AI',
    tags: ['web', 'design', 'development', '3d'],
    href: '/projects/devin_ai',
  },
  {
    title: 'Porsche: Dream Machine',
    tags: ['concept', '3D illustration', 'mograph', 'video'],
    href: '/projects/porsche_dream_machine',
  },
  {
    title: 'Synthetic Human',
    tags: ['web', 'design', 'development', '3d'],
    href: '/projects/synthetic_human',
  },
  {
    title: 'DDD 2024',
    tags: ['web', 'design', 'development', '3d'],
    href: '/projects/ddd_2024',
  },
  {
    title: 'Spaace - NFT Marketplace',
    tags: ['web', 'design', 'development', '3d', 'web3'],
    href: '/projects/spaace',
  },
  {
    title: 'Choo Choo World',
    tags: ['concept', 'web', 'game design', '3d'],
    href: '/projects/choo_choo_world',
  },
  {
    title: 'Zero Tech',
    tags: ['web', 'design', 'development', '3d'],
    href: '/projects/zero_tech',
  },
  {
    title: 'Meta: Spatial Fusion',
    tags: ['api design', 'webgl', '3d'],
    href: '/projects/spatial_fusion',
  },
  {
    title: 'Worldcoin Globe',
    tags: ['web', 'design', 'development', '3d'],
    href: '/projects/worldcoin',
  },
  {
    title: 'Lusion Labs',
    tags: ['concept', 'design', 'development', '3d'],
    href: '/projects/lusion_labs',
  },
  {
    title: 'My Little Storybook',
    tags: ['AR', 'development', '3d'],
    href: '/projects/my_little_story_book',
  },
  {
    title: 'Soda Experience',
    tags: ['concept', 'design', 'development', '3d'],
    href: '/projects/soda_experience',
  },
  {
    title: 'Infinite Passerella',
    tags: ['design', 'development', '3d'],
    href: '/projects/infinite_passerella',
  },
  {
    title: 'The Turn Of The Screw',
    tags: ['development', '3D'],
    href: '/projects/the_turn_of_the_screw',
  },
  {
    title: 'Max Mara: Bearing Gifts',
    tags: ['development', '3D'],
    href: '/projects/maxmara_bearings_gifts',
  },
]

export default function Projects() {
  return (
    <div className="min-h-screen pt-24 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-16 text-center">PROJECTS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(({ title, tags, href }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link href={href}>
                <div className="group border border-white/20 p-6 rounded-lg hover:bg-white/5 transition-all duration-300">
                  <h2 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-white transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm md:text-base opacity-60 group-hover:opacity-80 transition-opacity">
                    {tags.join(' • ')}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
