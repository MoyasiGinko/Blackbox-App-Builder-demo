"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Sample project data
const PROJECTS = [
  {
    id: 1,
    title: "Neon Genesis",
    client: "Cyberdyne Systems",
    category: "Interactive Experience",
    image: "/images/projects/p1.png",
    color: "#6e44ff",
  },
  {
    id: 2,
    title: "Luminous Flow",
    client: "Oceanic Airlines",
    category: "Web Development",
    image: "/images/projects/p2.png",
    color: "#ff44aa",
  },
  {
    id: 3,
    title: "Ethereal Pulse",
    client: "Massive Dynamics",
    category: "Digital Installation",
    image: "/images/projects/p3.png",
    color: "#44ffdd",
  },
  {
    id: 4,
    title: "Quantum Shift",
    client: "Aperture Science",
    category: "Virtual Reality",
    image: "/images/projects/p4.png",
    color: "#ffcc44",
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100]);

  return (
    <motion.div
      ref={sectionRef}
      style={{ opacity, y }}
      className="py-24 px-4 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-left text-4xl md:text-6xl lg:text-7xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-blue-50 leading-tight"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-sm text-right text-sm md:text-base opacity-80"
          >
            Explore a selection of our most impactful work showcasing our
            approach to design and interactive development
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative overflow-hidden rounded-xl aspect-[4/3]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <div
                  className="w-12 h-1 mb-4 rounded-full opacity-80 transition-all duration-300 group-hover:w-24"
                  style={{ background: project.color }}
                />
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {project.title}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm opacity-80">
                  <span>{project.client}</span>
                  <span className="hidden md:block">•</span>
                  <span>{project.category}</span>
                </div>

                <div className="mt-6 overflow-hidden">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-sm group/link"
                    >
                      <span className="group-hover/link:underline">
                        View Project
                      </span>
                      <svg
                        className="w-4 h-4 transform transition-transform group-hover/link:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Link href="/work">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                View All Projects
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
