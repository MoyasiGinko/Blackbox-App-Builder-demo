"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
// Import using dynamic import patterns to avoid TS errors during SSR
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Define proper types for the component props
interface SkyBackgroundProps {
  onLoadingChange?: (loading: boolean) => void;
}

export default function SkyBackground({ onLoadingChange }: SkyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js setup
    const scene = new THREE.Scene();

    // Create a camera with good parameters for a background scene
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Create renderer with appropriate settings for a background
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Fix for deprecated outputEncoding property
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Add lighting to properly illuminate the sky scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 10, 5);
    scene.add(directionalLight);

    // Add sky dome with gradient for fallback
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec3 topColor = vec3(0.1, 0.12, 0.18); // Dark blue
        vec3 bottomColor = vec3(0.5, 0.3, 0.5); // Purple
        float h = normalize(vWorldPosition).y;
        vec3 skyColor = mix(bottomColor, topColor, max(0.0, h));
        gl_FragColor = vec4(skyColor, 1.0);
      }
    `;

    const skyGeo = new THREE.SphereGeometry(400, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // Load the GLB model
    const loader = new GLTFLoader();
    if (onLoadingChange) onLoadingChange(true);

    loader.load(
      "/3d/sky-scene.glb", // Replace with the actual path to your GLB file
      (gltf) => {
        const skyScene = gltf.scene;

        // Initial setup for the sky model
        skyScene.scale.set(100, 100, 100); // Scale to encompass the scene
        skyScene.position.y = 0;
        scene.add(skyScene);

        // Notify that loading is complete
        if (onLoadingChange) onLoadingChange(false);

        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
          const elapsedTime = clock.getElapsedTime();

          // Subtle rotation for the sky
          skyScene.rotation.y = elapsedTime * 0.05;

          // Render the scene
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        };

        animate();
      },
      (xhr) => {
        // Loading progress callback
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        // Error callback
        console.error("An error occurred while loading the model:", error);
        if (onLoadingChange) onLoadingChange(false);
      }
    );

    // Handle window resize
    const handleResize = () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);

      // Dispose of Three.js resources
      renderer.dispose();
      if (skyDome) {
        skyDome.geometry.dispose();
        skyDome.material.dispose();
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();

          if (object.material) {
            // Handle materials (arrays or single)
            if (Array.isArray(object.material)) {
              object.material.forEach(disposeTextures);
            } else {
              disposeTextures(object.material);
            }
          }
        }
      });
    };
  }, [onLoadingChange]);

  // Helper function to dispose textures
  const disposeTextures = (material: THREE.Material) => {
    // Check if the material has a map property (using type assertion)
    const matWithMap = material as
      | THREE.MeshStandardMaterial
      | THREE.MeshBasicMaterial;

    // Dispose all material properties that could be textures
    if (matWithMap.map) matWithMap.map.dispose();

    // Additional texture properties
    const standardMat = material as THREE.MeshStandardMaterial;
    if (standardMat.normalMap) standardMat.normalMap.dispose();
    if (standardMat.roughnessMap) standardMat.roughnessMap.dispose();
    if (standardMat.metalnessMap) standardMat.metalnessMap.dispose();
    if (standardMat.emissiveMap) standardMat.emissiveMap.dispose();
    if (standardMat.aoMap) standardMat.aoMap.dispose();

    // Finally dispose the material itself
    material.dispose();
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      id="sky-background-canvas"
    />
  );
}
