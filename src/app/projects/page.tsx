"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Devin AI",
    tags: ["web", "design", "development", "3d"],
    href: "/projects/devin_ai",
    image: "/images/projects/p1.png",
    category: "tech",
  },
  {
    title: "Porsche: Dream Machine",
    tags: ["concept", "3D illustration", "mograph", "video"],
    href: "/projects/porsche_dream_machine",
    image: "/images/projects/p2.png",
    category: "automotive",
  },
  {
    title: "Synthetic Human",
    tags: ["web", "design", "development", "3d"],
    href: "/projects/synthetic_human",
    image: "/images/projects/p3.png",
    category: "design",
  },
  {
    title: "DDD 2024",
    tags: ["web", "design", "development", "3d"],
    href: "/projects/ddd_2024",
    image: "/images/projects/p4.png",
    category: "tech",
  },
  {
    title: "Spaace - NFT Marketplace",
    tags: ["web", "design", "development", "3d", "web3"],
    href: "/projects/spaace",
    image: "/images/projects/p1.png",
    category: "web3",
  },
  {
    title: "Choo Choo World",
    tags: ["concept", "web", "game design", "3d"],
    href: "/projects/choo_choo_world",
    image: "/images/projects/p2.png",
    category: "gaming",
  },
  {
    title: "Zero Tech",
    tags: ["web", "design", "development", "3d"],
    href: "/projects/zero_tech",
    image: "/images/projects/p3.png",
    category: "tech",
  },
  {
    title: "Meta: Spatial Fusion",
    tags: ["api design", "webgl", "3d"],
    href: "/projects/spatial_fusion",
    image: "/images/projects/p4.png",
    category: "tech",
  },
  {
    title: "Worldcoin Globe",
    tags: ["web", "design", "development", "3d"],
    href: "/projects/worldcoin",
    image: "/images/projects/p1.png",
    category: "web3",
  },
  {
    title: "Lusion Labs",
    tags: ["concept", "design", "development", "3d"],
    href: "/projects/lusion_labs",
    image: "/images/projects/p2.png",
    category: "tech",
  },
  {
    title: "My Little Storybook",
    tags: ["AR", "development", "3d"],
    href: "/projects/my_little_story_book",
    image: "/images/projects/p3.png",
    category: "entertainment",
  },
  {
    title: "Soda Experience",
    tags: ["concept", "design", "development", "3d"],
    href: "/projects/soda_experience",
    image: "/images/projects/p4.png",
    category: "lifestyle",
  },
];

type Project = {
  title: string;
  tags: string[];
  href: string;
  image: string;
  category: string;
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative overflow-hidden rounded-lg h-80 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Image
        fill
        priority
        src={project.image}
        alt={project.title}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ${
          isHovered ? "scale-105" : "scale-100"
        }`}
        draggable={false}
      />

      {/* Project link and overlay */}
      <Link href={project.href} className="block absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute bottom-0 left-0 p-5 w-full">
          <div className="flex justify-between items-end w-full">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-white transition-colors">
                {project.title}
              </h2>
            </div>
            <div className="text-2xl text-white transform transition-transform duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
              →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Filter component
type FilterSectionProps = {
  activeFilter: string;
  setActiveFilter: (category: string) => void;
  projects: Project[];
};

const FilterSection = ({
  activeFilter,
  setActiveFilter,
  projects,
}: FilterSectionProps) => {
  // Get unique categories
  const categories = ["all", ...new Set(projects.map((p) => p.category))];

  return (
    <div className="flex flex-wrap gap-4 mb-10">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            activeFilter === category
              ? "bg-white text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

// Main Projects component
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Filter projects based on active filter
  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="min-h-screen pt-24 container mx-auto px-4 pb-24 relative overflow-hidden">
      {/* Background gradient that follows mouse */}
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-60"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.15), transparent 80%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-16 text-center">
          PROJECTS
        </h1>

        <FilterSection
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          projects={projects}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
