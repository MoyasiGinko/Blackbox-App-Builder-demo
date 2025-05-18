"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import \* as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Define types to fix TypeScript errors
type AnimationMixer = THREE.AnimationMixer;
type LoadingProgressEvent = {
loaded: number;
total: number;
};

interface ModelLoadedEvent extends GLTF {
scene: THREE.Group;
animations: THREE.AnimationClip[];
}

// Create custom material colors for different parts of the model
const createCustomMaterials = () => {
// Base materials with different colors
const materials = {
primary: new THREE.MeshStandardMaterial({
color: 0x6e44ff, // Purple
metalness: 0.7,
roughness: 0.2,
emissive: 0x3a1f99, // Darker purple for glow
emissiveIntensity: 0.5
}),
secondary: new THREE.MeshStandardMaterial({
color: 0xff44aa, // Pink
metalness: 0.6,
roughness: 0.3,
emissive: 0x99214f, // Darker pink for glow
emissiveIntensity: 0.5
}),
accent: new THREE.MeshStandardMaterial({
color: 0x44ffdd, // Cyan
metalness: 0.8,
roughness: 0.1,
emissive: 0x1db5a3, // Darker cyan for glow
emissiveIntensity: 0.6
}),
neon: new THREE.MeshStandardMaterial({
color: 0xffff00, // Yellow
metalness: 0.3,
roughness: 0.1,
emissive: 0xffff00, // Same yellow for strong glow
emissiveIntensity: 1.0
}),
metal: new THREE.MeshStandardMaterial({
color: 0xaaaacc, // Light blue-gray
metalness: 0.9,
roughness: 0.1,
envMapIntensity: 1.0
}),
dark: new THREE.MeshStandardMaterial({
color: 0x222233, // Dark blue-gray
metalness: 0.6,
roughness: 0.5
}),
floor: new THREE.MeshStandardMaterial({
color: 0x101020, // Very dark blue
metalness: 0.5,
roughness: 0.8,
emissive: 0x080810, // Slight emissive
emissiveIntensity: 0.2
}),
glass: new THREE.MeshPhysicalMaterial({
color: 0xffffff,
metalness: 0.0,
roughness: 0.0,
transmission: 0.9, // Glass transmission
transparent: true,
opacity: 0.3,
clearcoat: 1.0,
clearcoatRoughness: 0.1
})
};

return materials;
};

export default function Contact() {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [email, setEmail] = useState("");
const [isSubscribed, setIsSubscribed] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [modelLoaded, setModelLoaded] = useState(false);
const [debugMessage, setDebugMessage] = useState<string>("Initializing...");

// Scroll animations
const { scrollYProgress } = useScroll();
const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.7]);
const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -20]);

// Camera animation values based on scroll
const cameraX = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 15, 0, -15, 0]);
const cameraY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [2, 5, 8, 5, 2]);
const cameraZ = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [56, 40, 30, 40, 56]);

// Camera look-at target based on scroll
const lookAtX = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 5, 0, -5, 0, 0]);
const lookAtY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 2, 0]);
const lookAtZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, -3, 0]);

// Initialize and handle the 3D model
useEffect(() => {
if (!canvasRef.current) return;

    // Create refs for camera animation
    let currentCamera: THREE.PerspectiveCamera;
    let currentControls: OrbitControls;
    let currentScene: THREE.Scene;

    setDebugMessage("Canvas found, setting up scene...");

    // Create scene with a visible background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark background
    currentScene = scene;

    // Create a simple fog effect
    scene.fog = new THREE.Fog(0x111111, 20, 100);

    // Create lighting system
    // Main ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add multiple directional lights from different angles
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Add point lights with different colors for visual interest
    const pointLight1 = new THREE.PointLight(0x6e44ff, 3);
    pointLight1.position.set(0, 3, 0);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff44aa, 2);
    pointLight2.position.set(3, -3, 3);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x44ffdd, 2);
    pointLight3.position.set(-3, 2, -3);
    pointLight3.castShadow = true;
    scene.add(pointLight3);

    setDebugMessage("Lights added, setting up camera...");

    // Set up camera with good initial position
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 56);
    camera.lookAt(0, 0, 0);
    currentCamera = camera;

    // Create renderer with high quality settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set color space for better visual quality
    if (
      "setOutputColorSpace" in renderer &&
      typeof (
        renderer as THREE.WebGLRenderer & {
          setOutputColorSpace?: (colorSpace: THREE.ColorSpace) => void;
        }
      ).setOutputColorSpace === "function"
    ) {
      (
        renderer as THREE.WebGLRenderer & {
          setOutputColorSpace?: (colorSpace: THREE.ColorSpace) => void;
        }
      ).setOutputColorSpace?.(THREE.SRGBColorSpace);
    } else {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
    }

    // Setup post-processing for glow effects
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Add bloom effect for glow
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,    // strength
      0.3,    // radius
      0.2     // threshold
    );
    composer.addPass(bloomPass);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.target.set(0, 0, 0);
    currentControls = controls;

    // Create a temporary placeholder object
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4444ff,
      metalness: 0.5,
      roughness: 0.1,
    });
    const debugObject = new THREE.Mesh(geometry, material);
    scene.add(debugObject);

    setDebugMessage("Debug objects added, loading GLB model...");

    // Create custom materials that will be applied to the model
    const customMaterials = createCustomMaterials();

    // Load the GLB model
    let mixer: AnimationMixer | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/3d/neon_stage.glb",
      (gltf: ModelLoadedEvent) => {
        console.log("GLB loaded successfully:", gltf);
        setDebugMessage(`GLB loaded, animations: ${gltf.animations.length}`);

        // Remove the debug object
        scene.remove(debugObject);

        const model = gltf.scene;

        // Apply custom materials based on mesh names or position
        let meshCount = 0;
        model.traverse((object: THREE.Object3D) => {
          if (object instanceof THREE.Mesh) {
            meshCount++;

            // Get object properties to help with material assignment
            const name = object.name.toLowerCase();
            const position = object.position.clone();
            const size = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
            const volume = size.x * size.y * size.z;

            // Apply different materials based on object characteristics
            let assignedMaterial: THREE.Material | null = null;

            // Assign by name if possible
            if (name.includes('floor') || name.includes('ground') || position.y < -2) {
              assignedMaterial = customMaterials.floor;
            } else if (name.includes('light') || name.includes('neon') || name.includes('glow')) {
              assignedMaterial = customMaterials.neon;
            } else if (name.includes('glass') || name.includes('window')) {
              assignedMaterial = customMaterials.glass;
            } else if (name.includes('metal') || name.includes('frame')) {
              assignedMaterial = customMaterials.metal;
            }

            // If no name-based assignment, use position and size
            if (!assignedMaterial) {
              // Large objects at the bottom are likely floor/base
              if (volume > 100 && position.y < 0) {
                assignedMaterial = customMaterials.floor;
              }
              // Very small objects might be decorative elements
              else if (volume < 1) {
                assignedMaterial = customMaterials.accent;
              }
              // Tall vertical objects
              else if (size.y > size.x * 3 && size.y > size.z * 3) {
                assignedMaterial = customMaterials.secondary;
              }
              // Default to primary material with slight randomness
              else {
                // Use math to create a deterministic but varied assignment
                const hash = object.uuid.charCodeAt(0) + object.uuid.charCodeAt(1);
                const materialIndex = hash % 3;

                if (materialIndex === 0) {
                  assignedMaterial = customMaterials.primary;
                } else if (materialIndex === 1) {
                  assignedMaterial = customMaterials.secondary;
                } else {
                  assignedMaterial = customMaterials.accent;
                }
              }
            }

            // Apply the selected material
            if (assignedMaterial) {
              object.material = assignedMaterial;
              object.castShadow = true;
              object.receiveShadow = true;
            }
          }
        });

        console.log(`Applied custom materials to ${meshCount} meshes`);

        // Add model to scene
        scene.add(model);

        // Center and position the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // Center horizontally
        model.position.y = -3;      // Position lower vertically

        // Scale the model appropriately
        const scalarSize = 3;
        model.scale.set(scalarSize, scalarSize, scalarSize);

        // Add a light that follows the camera
        const cameraLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(cameraLight);
        scene.add(camera);

        // Set up animations if they exist
        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          const clips = gltf.animations;

          // Play all animations
          clips.forEach((clip: THREE.AnimationClip) => {
            const action = mixer!.clipAction(clip);
            action.play();
          });

          setDebugMessage(`Playing ${clips.length} animations`);
        } else {
          setDebugMessage("Model loaded, no animations found");
        }

        setModelLoaded(true);
        setIsLoading(false);
      },
      (xhr: LoadingProgressEvent) => {
        const loadingProgress = (xhr.loaded / xhr.total) * 100;
        setDebugMessage(`Loading model: ${loadingProgress.toFixed(2)}%`);
        console.log(`Loading model: ${loadingProgress.toFixed(2)}% loaded`);
      },
      (error: unknown) => {
        console.error("Error loading model:", error);
        setDebugMessage(
          `Error loading model: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );

        // Keep the debug object visible if model fails to load
        setIsLoading(false);
      }
    );

    // Set up animation loop
    const clock = new THREE.Clock();
    let isUserInteracting = false;
    let interactionTimeout: NodeJS.Timeout | null = null;

    // Set up scroll-based camera animation
    const handleScroll = () => {
      if (isUserInteracting) return;

      // Update camera position based on current scroll values
      currentCamera.position.x = cameraX.get();
      currentCamera.position.y = cameraY.get();
      currentCamera.position.z = cameraZ.get();

      // Update look-at target
      currentControls.target.set(lookAtX.get(), lookAtY.get(), lookAtZ.get());
      currentControls.update();
    };

    // Handle user interaction with controls
    const handleUserInteraction = () => {
      isUserInteracting = true;

      // Clear any existing timeout
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }

      // Set a timeout to resume scroll-based camera after user stops interacting
      interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 2000); // 2 seconds without interaction to resume scroll control
    };

    // Add event listeners for detecting user interaction
    renderer.domElement.addEventListener('mousedown', handleUserInteraction);
    renderer.domElement.addEventListener('touchstart', handleUserInteraction);

    // Add scroll event listener
    scrollYProgress.onChange(handleScroll);

    const animate = () => {
      requestAnimationFrame(animate);

      // Update debug object rotation if model hasn't loaded
      if (!modelLoaded) {
        debugObject.rotation.x += 0.01;
        debugObject.rotation.y += 0.01;
      }

      // Update mixer for animations
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // Slowly rotate model for better presentation
      if (scene.children.length > 5 && modelLoaded) {
        // Find the model in the scene
        const modelIndex = scene.children.findIndex(
          (child) =>
            !(child instanceof THREE.Light) &&
            !(child instanceof THREE.Camera) &&
            child !== debugObject
        );

        if (modelIndex !== -1) {
          scene.children[modelIndex].rotation.y += 0.003;
        }
      }

      // Update controls and render
      controls.update();

      // Use composer instead of renderer for post-processing
      composer.render();
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup resources on unmount
    return () => {
      window.removeEventListener("resize", handleResize);

      console.log("Cleaning up Three.js resources");
      scene.children.forEach((object) => {
        scene.remove(object);

        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      composer.dispose();
      controls.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps

}, []);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
// Here you would typically send the email to your API
console.log("Subscribing email:", email);
setIsSubscribed(true);
setEmail("");

    // Reset the subscription status after 5 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);

};

return (
<div className="min-h-screen relative overflow-hidden bg-black text-white">
{/_ 3D Background _/}
<div className="w-full fixed inset-0 bottom-0">
<canvas ref={canvasRef} className="w-full h-full" />
</div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm">
          <div className="bg-black/80 p-4 rounded-lg border border-purple-500 text-white">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{debugMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 min-h-[200vh] pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mb-20 mx-auto"
            style={{ opacity: headerOpacity, y: headerY }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Let&apos;s work
              <br />
              together!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-purple-300">
                  Location
                </h2>
                <Link
                  href="https://goo.gl/maps/x9evc1NxZocjrM947"
                  target="_blank"
                  className="block text-base md:text-lg opacity-80 hover:opacity-100 transition-opacity"
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Suite 2<br />
                    9 Marsh Street
                    <br />
                    Bristol, BS1 4AA
                    <br />
                    United Kingdom
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-purple-300">
                  Get in touch
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg mb-2">
                      General enquiries
                    </h3>
                    <Link
                      href="mailto:hello@lusion.co"
                      className="text-base md:text-lg opacity-80 hover:opacity-100 transition-opacity group"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="inline-block"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        hello@lusion.co
                        <span className="block h-0.5 w-0 group-hover:w-full bg-purple-400 transition-all duration-300"></span>
                      </motion.span>
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg mb-2">New business</h3>
                    <Link
                      href="mailto:business@lusion.co"
                      className="text-base md:text-lg opacity-80 hover:opacity-100 transition-opacity group"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="inline-block"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        business@lusion.co
                        <span className="block h-0.5 w-0 group-hover:w-full bg-purple-400 transition-all duration-300"></span>
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16 bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-8 text-purple-300">
                Social
              </h2>
              <div className="flex flex-wrap gap-8">
                {[
                  { name: "Twitter / X", url: "https://twitter.com/lusionltd" },
                  {
                    name: "Instagram",
                    url: "https://www.instagram.com/lusionltd",
                  },
                  {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/lusionltd",
                  },
                  { name: "Dribbble", url: "https://dribbble.com/lusion" },
                  {
                    name: "Behance",
                    url: "https://www.behance.net/lusionstudio",
                  },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Link
                      href={social.url}
                      target="_blank"
                      className="text-lg opacity-80 hover:opacity-100 group"
                    >
                      {social.name}
                      <span className="block h-0.5 w-0 group-hover:w-full bg-purple-400 transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-8 text-purple-300">
                Newsletter
              </h2>
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-lg text-green-400"
                >
                  Thanks for subscribing! We&apos;ll be in touch soon.
                </motion.div>
              ) : (
                <form className="max-w-md" onSubmit={handleSubmit}>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/5 border-b border-white/30 focus:border-purple-400 focus:outline-none transition-colors text-base md:text-lg placeholder:text-white/50 rounded-t-lg"
                      required
                    />
                    <motion.button
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 opacity-60 hover:opacity-100 transition-opacity bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center animate-bounce">
          <p className="mb-2 text-sm">Scroll to explore</p>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>

);
}
