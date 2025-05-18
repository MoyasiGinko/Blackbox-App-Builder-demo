"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import \* as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

// Initialize and handle the 3D model
useEffect(() => {
if (!canvasRef.current) return;

    setDebugMessage("Canvas found, setting up scene...");

    // Create scene with a visible background for debugging
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Slightly lighter than black for testing

    // Add stronger lights for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased from 0.5
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased from 1
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6e44ff, 3); // Increased from 2
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Add a second point light from another angle for better illumination
    const pointLight2 = new THREE.PointLight(0xff44aa, 2);
    pointLight2.position.set(3, -3, 3);
    scene.add(pointLight2);

    setDebugMessage("Lights added, setting up camera...");

    // Set up camera with farther z position for better view
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 16; // Increased for more zoomed out

    // Create renderer with better settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Set output color space for better color reproduction (Three.js r152+)
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
      // For older versions, you may set tone mapping as a fallback
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    // Add orbit controls with more sensible defaults
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true; // Enable zoom for debugging
    controls.enablePan = true; // Enable panning for debugging

    setDebugMessage("Camera and renderer set up, adding debug helpers...");

    // Add debugging helpers
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Create a visible default object to ensure scene is working
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4444ff,
      metalness: 0.5,
      roughness: 0.1,
    });
    const debugObject = new THREE.Mesh(geometry, material);
    scene.add(debugObject);

    setDebugMessage("Debug objects added, loading GLB model...");

    // Load the GLB model with better error handling
    let mixer: AnimationMixer | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/astronaut.glb", // Your model path
      (gltf: ModelLoadedEvent) => {
        console.log("GLB loaded successfully:", gltf);
        setDebugMessage(`GLB loaded, animations: ${gltf.animations.length}`);

        // Remove the debug object once model is loaded
        scene.remove(debugObject);

        const model = gltf.scene;
        scene.add(model);

        // Log model details
        console.log("Model added to scene");
        console.log("Children count:", model.children.length);

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        console.log("Model bounding box:", box);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Adjust position if needed
        model.position.y = 0; // May need adjustment based on your model

        // Scale model to fit the scene - try a larger scale
        const scalarSize = 3; // Increased from 2 to 3
        model.scale.set(scalarSize, scalarSize, scalarSize);

        // Add a light that follows the camera to ensure model is always lit
        const cameraLight = new THREE.PointLight(0xffffff, 1);
        camera.add(cameraLight);
        scene.add(camera);

        // Make model materials more visible
        model.traverse((object: THREE.Object3D) => {
          if ("material" in object) {
            const obj = object as unknown as {
              material: THREE.Material | THREE.Material[];
            };
            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  material.emissive.set(0x111111); // Slight self-illumination
                  material.needsUpdate = true;
                }
              });
            } else if (
              obj.material &&
              obj.material instanceof THREE.MeshStandardMaterial
            ) {
              obj.material.emissive.set(0x111111);
              obj.material.needsUpdate = true;
            }
          }
        });

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

    // Animation loop
    const clock = new THREE.Clock();

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

      // Slowly rotate model
      if (scene.children.length > 6 && modelLoaded) {
        // Adjusted for extra helpers
        const modelIndex = scene.children.findIndex(
          (child) =>
            child !== axesHelper &&
            child !== gridHelper &&
            !(child instanceof THREE.Light) &&
            !(child instanceof THREE.Camera)
        );

        if (modelIndex !== -1) {
          scene.children[modelIndex].rotation.y += 0.003;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
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
<div className="fixed inset-0 z-0">
<canvas ref={canvasRef} className="w-full h-full" />
{isLoading && (
<div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
<motion.div
animate={{ rotate: 360 }}
transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
className="w-16 h-16 border-t-2 border-blue-500 rounded-full mb-4"
/>
<div className="text-sm text-blue-300">{debugMessage}</div>
</div>
)}
</div>

      {/* Content */}
      <div className="relative z-10 min-h-screen pt-24 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-24 text-center text-sm opacity-60"
            >
              © 2025 Lusion Studio | All rights reserved | Creative digital
              experiences
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>

);
}
