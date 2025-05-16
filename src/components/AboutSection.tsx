'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    tl.to(videoRef.current, {
      scale: 1.1,
      ease: 'power1.out',
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-24"
    >
      <h2 className="text-4xl font-bold mb-12">About Us</h2>
      <video
        ref={videoRef}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
        className="w-full max-w-4xl rounded-lg shadow-lg"
        muted
        loop
        playsInline
      />
      <p className="max-w-3xl mt-12 text-center text-lg opacity-80">
        We create immersive digital experiences that blend art and technology. Our video morphs
        dynamically as you scroll, showcasing our innovative approach.
      </p>
    </section>
  )
}
