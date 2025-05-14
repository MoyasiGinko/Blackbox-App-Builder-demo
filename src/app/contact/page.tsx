'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Contact() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-16 text-center">
            Let's work<br />together!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-8">Location</h2>
              <Link 
                href="https://goo.gl/maps/x9evc1NxZocjrM947"
                target="_blank"
                className="block text-base md:text-lg opacity-80 hover:opacity-100 transition-opacity"
              >
                Suite 2<br />
                9 Marsh Street<br />
                Bristol, BS1 4AA<br />
                United Kingdom
              </Link>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-8">Get in touch</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base md:text-lg mb-2">General enquiries</h3>
                  <Link 
                    href="mailto:hello@lusion.co"
                    className="text-base md:text-lg opacity-80 hover:opacity-100 transition-opacity"
                  >
                    hello@lusion.co
                  </Link>
                </div>
                <div>
                  <h3 className="text-base md:text-lg mb-2">New business</h3>
                  <Link 
                    href="mailto:business@lusion.co"
                    className="text-base md:text-lg opacity-80 hover:opacity-100 transition-opacity"
                  >
                    business@lusion.co
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold mb-8">Social</h2>
            <div className="flex flex-wrap gap-8">
              <Link 
                href="https://twitter.com/lusionltd"
                target="_blank"
                className="text-lg opacity-80 hover:opacity-100"
              >
                Twitter / X
              </Link>
              <Link 
                href="https://www.instagram.com/lusionltd"
                target="_blank"
                className="text-lg opacity-80 hover:opacity-100"
              >
                Instagram
              </Link>
              <Link 
                href="https://www.linkedin.com/company/lusionltd"
                target="_blank"
                className="text-lg opacity-80 hover:opacity-100"
              >
                LinkedIn
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-8">Newsletter</h2>
            <form className="max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-transparent border-b border-white/30 focus:border-white focus:outline-none transition-colors text-base md:text-lg placeholder:text-white/50"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path 
                      d="M5 12H19M19 12L12 5M19 12L12 19" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
