"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  useGLTF,
  useAnimations,
  Text,
  Float,
  MeshTransmissionMaterial,
  PerspectiveCamera,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Sample data for engineering projects
const PROJECTS = [
  {
    id: 1,
    title: "WebGL Performance Optimization",
    description:
      "Techniques for rendering complex 3D scenes with high frame rates on web browsers using advanced WebGL optimization patterns.",
    tags: ["WebGL", "Performance", "JavaScript", "Shaders"],
    image: "/images/labs/webgl-opt.jpg", // Placeholder
    date: "May 2025",
    progress: 85,
    color: "#6e44ff",
  },
  {
    id: 2,
    title: "Real-time Collaboration Engine",
    description:
      "Building a distributed system for real-time collaborative editing with conflict resolution and offline-first capabilities.",
    tags: ["WebSockets", "CRDT", "Distributed Systems", "IndexedDB"],
    image: "/images/labs/collab-engine.jpg", // Placeholder
    date: "April 2025",
    progress: 92,
    color: "#ff44aa",
  },
  {
    id: 3,
    title: "WebGPU Compute Shaders",
    description:
      "Exploring the next generation of GPU-powered computing in the browser with WebGPU compute shaders.",
    tags: ["WebGPU", "WGSL", "Parallel Computing", "Graphics"],
    image: "/images/labs/webgpu.jpg", // Placeholder
    date: "March 2025",
    progress: 76,
    color: "#44ffdd",
  },
  {
    id: 4,
    title: "Edge Runtime Frameworks",
    description:
      "Developing framework components that seamlessly run at the edge for improved global performance and reduced latency.",
    tags: ["Edge Computing", "Serverless", "CDN", "Web Performance"],
    image: "/images/labs/edge-runtime.jpg", // Placeholder
    date: "February 2025",
    progress: 98,
    color: "#ffcc44",
  },
  {
    id: 5,
    title: "Machine Learning Model Compression",
    description:
      "Techniques for deploying large ML models to resource-constrained environments like browsers and mobile devices.",
    tags: ["TensorFlow.js", "Model Optimization", "Quantization", "WebNN"],
    image: "/images/labs/ml-compression.jpg", // Placeholder
    date: "January 2025",
    progress: 65,
    color: "#44aaff",
  },
  {
    id: 6,
    title: "Reactive State Management Patterns",
    description:
      "Exploring novel approaches to manage complex application state with minimal boilerplate and maximum performance.",
    tags: ["State Management", "Reactivity", "Immutability", "JavaScript"],
    image: "/images/labs/state-management.jpg", // Placeholder
    date: "December 2024",
    progress: 70,
    color: "#ff6644",
  },
];

// Research areas with updated developer/engineer focus
const TECH_AREAS = [
  {
    title: "Frontend Performance",
    description:
      "Solving complex performance bottlenecks in modern web applications through innovative rendering techniques and optimization strategies.",
    topics: [
      "JavaScript Engine Optimization",
      "Web Vitals Enhancement",
      "Bundle Size Reduction",
      "Runtime Performance",
    ],
    icon: "⚡",
    color: "#6e44ff",
  },
  {
    title: "3D & WebGL",
    description:
      "Pushing the boundaries of 3D graphics on the web with advanced rendering techniques and interactive experiences.",
    topics: [
      "Scene Graph Optimization",
      "Custom Shader Development",
      "WebGPU Migration",
      "3D Asset Optimization",
    ],
    icon: "🔮",
    color: "#ff44aa",
  },
  {
    title: "Developer Tooling",
    description:
      "Building next-generation tools that improve developer experience and productivity across the software development lifecycle.",
    topics: [
      "Build Systems",
      "Static Analysis",
      "Code Generation",
      "Developer Experience",
    ],
    icon: "🛠️",
    color: "#44ffdd",
  },
  {
    title: "Distributed Systems",
    description:
      "Engineering resilient and scalable systems that solve complex coordination and consistency challenges.",
    topics: [
      "Edge Computing",
      "Real-time Synchronization",
      "Consensus Algorithms",
      "Distributed Databases",
    ],
    icon: "🌐",
    color: "#ffcc44",
  },
];

// 3D Model component
function TechModel() {
  const modelRef = useRef();
  const gltf = useGLTF("/3d/falling_astro.glb"); // This is a placeholder path - you'll need a real model
  const { actions, names } = useAnimations(gltf.animations, modelRef);

  useEffect(() => {
    // Start the main animation if it exists
    if (names.length > 0) {
      actions[names[0]]?.play();
    }
  }, [actions, names]);

  useFrame((state) => {
    // Add some gentle rotation even if the model has no animations
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} scale={2} position={[0, -6, 0]} />
    </group>
  );
}

// Card component for projects
function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
    >
      <div className="aspect-video w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br"
          style={{
            background: `linear-gradient(135deg, ${project.color}40 0%, ${project.color}10 100%)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
            <div className="text-4xl">{project.id}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold group-hover:text-[#44ffdd] transition-colors">
            {project.title}
          </h3>
          <span className="text-sm px-2 py-1 bg-white/10 rounded-full">
            {project.date}
          </span>
        </div>

        <p className="text-base opacity-80 mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Development Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${project.progress}%`,
                background: project.color,
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/labs/${project.id}`}
          className="inline-flex items-center gap-2 text-sm group"
        >
          <span className="group-hover:underline">View Project</span>
          <svg
            className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
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
      </div>
    </motion.div>
  );
}

// Technology area component
function TechArea({ area, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex gap-4 items-start mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ background: `${area.color}30` }}
        >
          {area.icon}
        </div>
        <h3 className="text-xl md:text-2xl font-bold">{area.title}</h3>
      </div>

      <p className="opacity-80 mb-6">{area.description}</p>

      <div className="space-y-2">
        {area.topics.map((topic, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: area.color }}
            />
            <span>{topic}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Newsletter subscription component
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");

    // Reset after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-xl border border-white/10"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Join Our Developer Community
        </h2>
        <p className="opacity-80 mb-8">
          Subscribe to our newsletter to get early access to our projects,
          technical insights, and invitations to beta testing.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-lg text-green-400 mb-4"
          >
            Thanks for subscribing! We'll keep you updated on our latest
            projects and releases.
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 focus:border-[#44ffdd] focus:outline-none rounded-lg text-base"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-[#44ffdd] text-black font-medium rounded-lg hover:bg-[#44ffdd]/90 transition-colors"
            >
              Subscribe
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

// Tech Visualization Scene
function TechVisualizationScene() {
  return (
    <>
      {/* Main light sources */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#ff44aa" intensity={0.5} />

      {/* 3D Model */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <TechModel />
      </Float>

      {/* Environment & lighting */}
      <Environment preset="city" />

      {/* Camera positioning */}
      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={50} />
    </>
  );
}

export default function Labs() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  return (
    <div className="min-h-screen pt-24 pb-24 bg-black text-white overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Hero section */}
        <motion.div
          style={{ scale, opacity, y }}
          className="relative text-center mb-48 max-w-4xl mx-auto pt-12"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-50 via-blue-50 to-red-50">
            LABS
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-80 mb-12">
            Our development playground where we push the limits of what's
            possible with web technologies and build tomorrow's digital
            experiences.
          </p>

          {/* 3D Visualization */}
          <div className="md:h-[600px] h-[50vh] w-full mb-12">
            <Canvas dpr={[1, 2]} className="rounded-xl border border-white/10">
              <TechVisualizationScene />
            </Canvas>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white/70"
          >
            <svg
              className="w-6 h-6"
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

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Building the Future of <br />
            <span className="text-[#44ffdd]">Web Technology</span>
          </h2>
          <p className="text-xl opacity-80 mb-8">
            At our Labs, we dedicate time and resources to experimental projects
            that push the boundaries of what's possible in modern web
            development.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {[
              { number: "35+", label: "Open Source Projects" },
              { number: "120k+", label: "GitHub Stars" },
              { number: "8", label: "Tech Frameworks" },
              { number: "42", label: "Dev Tools" },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-[#ff44aa] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base opacity-70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Current Projects */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Current Projects
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Our latest engineering projects pushing the boundaries of web
              technology and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>

        {/* Technology Areas */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Technology Areas
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Our engineering team works across multiple disciplines to solve
              complex technical challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TECH_AREAS.map((area, index) => (
              <TechArea key={index} area={area} index={index} />
            ))}
          </div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Engineering Team
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              The brilliant minds behind our innovative projects and open-source
              tools.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Lead Engineer",
                image: "/images/team/team1.jpg",
              },
              {
                name: "Maya Williams",
                role: "Full-Stack Developer",
                image: "/images/team/team2.jpg",
              },
              {
                name: "Sam Rodriguez",
                role: "WebGL Specialist",
                image: "/images/team/team3.jpg",
              },
              {
                name: "Jamie Kim",
                role: "Performance Engineer",
                image: "/images/team/team4.jpg",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group"
              >
                <div className="aspect-square bg-white/10 rounded-xl overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v. 062c0 2.385 1.693 4.377 3.946 4.83a4.935 4.935 0 01-2.224.084c.63 1.963 2.445 3.394 4.6 3.434a9.87 9.87 0 01-6.102 2.1c-.396 0-.787-.023-1.17-.067a13.93 13.93 0 007.548 2.211c9.057 0 14-7.496 14-13.986l-.017-.635A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <Image
                    fill
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm opacity-80">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </div>
  );
}
