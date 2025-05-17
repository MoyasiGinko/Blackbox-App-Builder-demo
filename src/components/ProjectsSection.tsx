"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectProps {
  title: string;
  category: string[];
  image: string;
  index: number;
}

const Project = ({ title, category, image, index }: ProjectProps) => {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="overflow-hidden bg-gray-100 rounded-lg">
        <div className="relative h-[400px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-all duration-700 hover:scale-105"
          />
        </div>
      </div>
      <div className="mt-2">
        <div className="flex gap-1 flex-wrap text-xs uppercase tracking-wider mb-1">
          {category.map((cat, idx) => (
            <span key={idx} className="text-gray-500">
              {cat}
              {idx < category.length - 1 ? " • " : ""}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  const projects = [
    {
      title: "Devin AI",
      category: ["WEB", "DESIGN", "DEVELOPMENT", "3D"],
      image: "/images/projects/p1.png",
    },
    {
      title: "Porsche: Dream Machine",
      category: ["CONCEPT", "3D ILLUSTRATION", "MOGRAPH", "VIDEO"],
      image: "/images/projects/p2.png",
    },
    {
      title: "Virtual Humans",
      category: ["3D", "CHARACTER", "ANIMATION"],
      image: "/images/projects/p3.png",
    },
    {
      title: "Meta Quest 3",
      category: ["VR", "INTERACTIVE", "3D"],
      image: "/images/projects/p4.png",
    },
  ];

  return (
    <section ref={sectionRef} className="px-6 py-24 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {projects.map((project, index) => (
            <Project
              key={index}
              title={project.title}
              category={project.category}
              image={project.image}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
