"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Sample team data
const teamMembers = [
  {
    id: "001",
    name: "Edan Kwan",
    title: "Cofounder & Creative Director",
    bio: "With over 15 years of experience in digital design and creative direction, Edan has led award-winning projects for global brands.",
    image: "/api/placeholder/400/480",
  },
  {
    id: "002",
    name: "Alex Rivera",
    title: "Technical Director",
    bio: "Specializing in WebGL and real-time graphics, Alex brings technical expertise to create innovative digital experiences.",
    image: "/api/placeholder/400/480",
  },
  {
    id: "003",
    name: "Maya Chen",
    title: "Lead Designer",
    bio: "Maya combines UX principles with cutting-edge visual design to create intuitive and beautiful digital interfaces.",
    image: "/api/placeholder/400/480",
  },
];

// Sample project data
const featuredProjects = [
  {
    title: "Immersive Brand Experience",
    client: "Global Tech Company",
    description: "An interactive 3D showcase highlighting product innovation",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Digital Art Installation",
    client: "Contemporary Museum",
    description:
      "A reactive environment responding to visitor movement and sound",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Web-based Product Configurator",
    client: "Luxury Automotive Brand",
    description: "Real-time 3D visualization tool for customizing vehicles",
    thumbnail: "/api/placeholder/600/400",
  },
];

const expertiseAreas = [
  {
    title: "Strategy",
    items: [
      "Experience Strategy",
      "Technology Strategy",
      "Creative Direction",
      "Discovery",
      "Research",
    ],
  },
  {
    title: "Creative",
    items: [
      "Art Direction",
      "UX/UI Design",
      "Motion Design",
      "Game Design",
      "Illustration",
    ],
  },
  {
    title: "Tech",
    items: [
      "WebGL Development",
      "Web Development",
      "Unity/Unreal",
      "Interactive Installations",
      "VR/AR",
    ],
  },
  {
    title: "Production",
    items: [
      "Procedural Modeling",
      "3D Asset Creation",
      "3D Asset Optimization",
      "Animation",
      "3D Pipeline",
    ],
  },
];

// WebGL Background component
const WebGLBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current; // Copy ref value

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountNode.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;

      // Color
      colors[i] = Math.random() * 0.5 + 0.5;
      colors[i + 1] = Math.random() * 0.5 + 0.5;
      colors[i + 2] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particleSystem);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particleSystem.rotation.x += 0.0003;
      particleSystem.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountNode?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0" />
  );
};

// Team member card component
type TeamMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
};

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col md:flex-row gap-6 mb-16"
    >
      <div className="w-full md:w-1/3">
        <Image
          width={400}
          height={480}
          priority
          src={member.image}
          alt={member.name}
          className="w-full h-64 object-cover rounded"
        />
      </div>
      <div className="w-full md:w-2/3">
        <h3 className="text-xl font-bold mb-1">{member.id}</h3>
        <h4 className="text-xl mb-2">{member.name}</h4>
        <p className="text-lg opacity-80 mb-4">{member.title}</p>
        <p className="text-base opacity-80">{member.bio}</p>
      </div>
    </motion.div>
  );
};

// Project card component
type Project = {
  title: string;
  client: string;
  description: string;
  thumbnail: string;
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group cursor-pointer"
    >
      <div className="overflow-hidden rounded mb-4">
        <Image
          width={600}
          height={400}
          priority
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>
      <h4 className="text-lg font-bold mb-1">{project.title}</h4>
      <p className="text-base opacity-70 mb-2">{project.client}</p>
      <p className="text-sm opacity-80">{project.description}</p>
    </motion.div>
  );
};

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    if (!containerRef.current) return;

    const expertiseSections = gsap.utils.toArray(".expertise-section");

    expertiseSections.forEach((section) => {
      gsap.from(section as Element, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: section as Element,
          start: "top center+=100",
          end: "bottom center",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* WebGL Background */}
      <WebGLBackground />

      {/* Main content */}
      <div
        ref={containerRef}
        className="relative z-10 min-h-screen pt-24 pb-32"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="container mx-auto px-4"
        >
          {/* Hero section */}
          <motion.div style={{ y }} className="text-center mb-32">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6"
            >
              WE ARE
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-4xl lg:text-6xl font-light mb-16"
            >
              A CREATIVE
              <br />
              PRODUCTION STUDIO
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto opacity-80"
            >
              A world wide team of experienced and skilled professionals who
              bring a wide range of talents and perspectives to each project. We
              combine technology, design, and storytelling to create memorable
              digital experiences.
            </motion.p>
          </motion.div>

          {/* About section */}
          <div className="mb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16"
            >
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  Our Approach
                </h3>
                <p className="text-base md:text-lg opacity-80">
                  As a result of our diverse experience, we are able to think
                  creatively and find new solutions to problems, providing
                  clients with memorable, purpose-driven experiences that cut
                  through the noise and connect where it matters.
                </p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  Our Vision
                </h3>
                <p className="text-base md:text-lg opacity-80">
                  We believe in pushing the boundaries of what&#39;s possible in
                  digital experiences. By combining cutting-edge technology with
                  human-centered design, we create work that engages, inspires,
                  and delivers measurable results.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Team section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Team</h2>
            <div className="space-y-8">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </motion.div>

          {/* Expertise section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Our Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
              {expertiseAreas.map((area) => (
                <div key={area.title} className="expertise-section">
                  <h3 className="text-xl md:text-2xl font-bold mb-8">
                    {area.title}
                  </h3>
                  <ul className="space-y-4">
                    {area.items.map((item) => (
                      <li
                        key={item}
                        className="text-base md:text-lg opacity-80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured projects */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
