"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Define shape types for our particles
type ShapeType =
  | "circle"
  | "triangle"
  | "square"
  | "pentagon"
  | "hexagon"
  | "cross"
  | "bowtie"
  | "rectangle";

// Component for the call-to-action section with WebGL background
export default function CallToActionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);
  const [isScrollVisible, setIsScrollVisible] = useState(false);

  // Create WebGL particles scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#f8fafc"); // Light background color

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle group
    const particles = new THREE.Group();
    particlesRef.current = particles;
    scene.add(particles);

    // Colors for shapes
    const colors = [
      "#ff3333", // red
      "#33ff33", // green
      "#3333ff", // blue
      "#ffff33", // yellow
      "#ff33ff", // magenta
      "#33ffff", // cyan
      "#000000", // black
      "#666666", // dark gray
      "#cccccc", // light gray
    ];

    // Helper function to create a random shape
    const createShape = (type: ShapeType, color: string, size: number) => {
      let geometry: THREE.BufferGeometry;

      switch (type) {
        case "circle":
          geometry = new THREE.CircleGeometry(size, 32);
          break;
        case "triangle":
          geometry = new THREE.CircleGeometry(size, 3);
          break;
        case "square":
          geometry = new THREE.PlaneGeometry(size * 2, size * 2);
          break;
        case "pentagon":
          geometry = new THREE.CircleGeometry(size, 5);
          break;
        case "hexagon":
          geometry = new THREE.CircleGeometry(size, 6);
          break;
        case "cross":
          // Create a cross shape using a custom shape
          const crossShape = new THREE.Shape();
          const crossWidth = size * 0.5;
          crossShape.moveTo(-crossWidth, -crossWidth * 3);
          crossShape.lineTo(crossWidth, -crossWidth * 3);
          crossShape.lineTo(crossWidth, -crossWidth);
          crossShape.lineTo(crossWidth * 3, -crossWidth);
          crossShape.lineTo(crossWidth * 3, crossWidth);
          crossShape.lineTo(crossWidth, crossWidth);
          crossShape.lineTo(crossWidth, crossWidth * 3);
          crossShape.lineTo(-crossWidth, crossWidth * 3);
          crossShape.lineTo(-crossWidth, crossWidth);
          crossShape.lineTo(-crossWidth * 3, crossWidth);
          crossShape.lineTo(-crossWidth * 3, -crossWidth);
          crossShape.lineTo(-crossWidth, -crossWidth);
          crossShape.closePath();
          geometry = new THREE.ShapeGeometry(crossShape);
          break;
        case "bowtie":
          // Create a bowtie shape using a custom shape
          const bowtieShape = new THREE.Shape();
          bowtieShape.moveTo(-size, -size);
          bowtieShape.lineTo(size, size);
          bowtieShape.lineTo(-size, size);
          bowtieShape.lineTo(size, -size);
          bowtieShape.closePath();
          geometry = new THREE.ShapeGeometry(bowtieShape);
          break;
        case "rectangle":
          geometry = new THREE.PlaneGeometry(size * 3, size);
          break;
        default:
          geometry = new THREE.CircleGeometry(size, 32);
      }

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        side: THREE.DoubleSide,
      });

      return new THREE.Mesh(geometry, material);
    };

    // Add particles
    const shapeTypes: ShapeType[] = [
      "circle",
      "triangle",
      "square",
      "pentagon",
      "hexagon",
      "cross",
      "bowtie",
      "rectangle",
    ];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const shapeType =
        shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 0.05 + Math.random() * 0.15;

      const shape = createShape(shapeType, color, size);

      // Random position across the entire viewport
      shape.position.x = (Math.random() - 0.5) * 20;
      shape.position.y = (Math.random() - 0.5) * 10;
      shape.position.z = (Math.random() - 0.5) * 5;

      // Random rotation
      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;
      shape.rotation.z = Math.random() * Math.PI;

      // Add random movement data
      shape.userData = {
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        speedZ: (Math.random() - 0.5) * 0.005,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
      };

      particles.add(shape);
    }

    // Animation function
    const animate = () => {
      if (!particlesRef.current) return;

      // Update each particle
      particlesRef.current.children.forEach((particle) => {
        // Move particle
        particle.position.x += particle.userData.speedX;
        particle.position.y += particle.userData.speedY;
        particle.position.z += particle.userData.speedZ;

        // Add slight rotation
        particle.rotation.z += particle.userData.rotationSpeed;

        // Wrap around if particle goes out of bounds
        if (particle.position.x > 10) particle.position.x = -10;
        if (particle.position.x < -10) particle.position.x = 10;
        if (particle.position.y > 5) particle.position.y = -5;
        if (particle.position.y < -5) particle.position.y = 5;
      });

      // Render the scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Show scroll indicator after delay
    const scrollTimer = setTimeout(() => {
      setIsScrollVisible(true);
    }, 1500);

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameIdRef.current);
      clearTimeout(scrollTimer);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }

      if (particlesRef.current) {
        particlesRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            }
          }
        });
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Plus Icons */}
        <div className="absolute top-8 left-8">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12H19"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="absolute top-8 right-8">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12H19"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Main Heading */}
        <div className="text-center px-4">
          <h2 className="uppercase text-gray-600 tracking-wide text-center mb-4">
            IS YOUR BIG IDEA READY TO GO WILD?
          </h2>
          <h1 className="text-6xl md:text-8xl font-bold text-black mb-2">
            Let&#39;s work
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold text-black">
            together!
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
            isScrollVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-white py-3 px-6 rounded-full shadow-md flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12L12 19L5 12"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="uppercase text-gray-600 text-sm font-medium">
              Continue to scroll
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12L12 19L5 12"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
