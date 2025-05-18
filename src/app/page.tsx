"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "@/components/three/HeroScene";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
// import ContactSection from "@/components/ContactSection";
import Link from "next/link";
import ImmersiveVideoScroll from "@/components/VideoScroll";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "50% top",
        scrub: 1,
      },
    });

    heroTl.to(".hero-text", {
      y: -100,
      opacity: 0,
      stagger: 0.1,
    });

    if (introRef.current) {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      introTl.fromTo(
        ".intro-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1 }
      );
    }

    return () => {
      heroTl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* Hero Section */}
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
            className="hero-text text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-50 via-blue-50 to-blue-100"
          >
            Aniverse Studio
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-text text-2xl md:text-4xl lg:text-6xl font-light mb-12"
          >
            A New Era of Digital Experiences
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-text max-w-2xl text-base md:text-lg lg:text-xl opacity-80 mb-12"
          >
            Lusion is a digital production studio that brings your ideas to life
            through visually captivating designs and interactive experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-text flex flex-col sm:flex-row gap-4"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-[#44ffdd] text-black font-medium rounded-lg hover:bg-[#44ffdd]/90 transition-colors"
              >
                Get in Touch
              </motion.button>
            </Link>
            <Link href="/work">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                View Our Work
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg
                className="w-6 h-6 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Intro Section */}
      <div
        ref={introRef}
        className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-b from-black to-[#0a0a0a]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="intro-text text-3xl md:text-4xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-blue-100">
            Connecting Ideals to Uniquely Crafted Experiences
          </h2>
          <p className="intro-text text-base md:text-lg lg:text-xl opacity-80 mb-16">
            At Lusion, we don't follow trends for the sake of it. We believe in
            a different approach that's centered around you, your audience, and
            the art of creating a memorable, personalized experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Design",
                icon: (
                  <svg
                    className="w-8 h-8 mb-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7,14.94L13.06,8.88L15.12,10.94L9.06,17H7V14.94M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M16.7,9.35L15.7,10.35L13.65,8.3L14.65,7.3C14.86,7.08 15.21,7.08 15.42,7.3L16.7,8.58C16.92,8.79 16.92,9.14 16.7,9.35M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                ),
                description:
                  "Crafting visually stunning interfaces that communicate your brand's unique story.",
              },
              {
                title: "Development",
                icon: (
                  <svg
                    className="w-8 h-8 mb-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" />
                  </svg>
                ),
                description:
                  "Building robust, high-performance digital experiences with cutting-edge technology.",
              },
              {
                title: "Innovation",
                icon: (
                  <svg
                    className="w-8 h-8 mb-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z" />
                  </svg>
                ),
                description:
                  "Pushing boundaries with experimental approaches and emerging technologies.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="intro-text p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition-all text-center"
              >
                <div className="flex justify-center text-[#44ffdd]">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About, Projects, Testimonials and Contact Sections */}
      <AboutSection />
      <ProjectsSection />
      <ImmersiveVideoScroll />
    </div>
  );
}
