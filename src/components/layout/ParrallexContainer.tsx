"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CTASection from "./CTA";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function SmoothScrollContainer() {
  // Create refs for the main sections
  const containerRef = useRef(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const contactFooterRef = useRef(null);

  // Use Framer Motion's scroll hooks for smooth animation
  const { scrollY } = useScroll();

  // State to store the offset where the sliding should begin
  const [slideStartOffset, setSlideStartOffset] = useState(0);

  // Calculate where the slide should start (after CTA section)
  useEffect(() => {
    const updateSlideStartPosition = () => {
      if (!ctaSectionRef.current) return;

      // The slide starts when the CTA section bottom would reach viewport bottom
      // We need to calculate this absolute scroll position
      const ctaHeight = ctaSectionRef.current.offsetHeight;

      // Set the absolute scroll position where sliding should begin
      setSlideStartOffset(ctaHeight);
    };

    // Initial calculation
    updateSlideStartPosition();

    // Recalculate on resize
    window.addEventListener("resize", updateSlideStartPosition);

    return () => {
      window.removeEventListener("resize", updateSlideStartPosition);
    };
  }, []);

  // Calculate the sliding progress based on scroll position
  // Use a much larger scroll range for slower animation (4x viewport height)
  const slideRangeMultiplier = 3; // Higher = slower/more gradual slide

  // Transform scroll position to slide progress value (0 to 1)
  const slideProgress = useTransform(
    scrollY,
    // Input range: from slideStartOffset to slideStartOffset + (viewportHeight * multiplier)
    (value) => {
      if (!containerRef.current || slideStartOffset === 0) return 0;

      const viewportHeight = window.innerHeight;
      const totalSlideDistance = viewportHeight * slideRangeMultiplier;

      // No movement until we reach the start offset
      if (value < slideStartOffset) return 0;

      // Calculate progress from 0 to 1 over the extended slide distance
      const progress = Math.min(
        (value - slideStartOffset) / totalSlideDistance,
        1
      );

      return progress;
    }
  );

  // Use spring physics for extra smooth animation
  // These settings make it extremely smooth
  const smoothSlideProgress = useSpring(slideProgress, {
    stiffness: 40, // Lower = smoother (default is 100)
    damping: 20, // Higher = more damping (default is 10)
    mass: 1.5, // Higher = more inertia (default is 1)
    restDelta: 0.001, // Smaller = more precise animation
  });

  // Transform the progress (0-1) to the Y position percentage (100%-0%)
  const contactY = useTransform(smoothSlideProgress, [0, 1], ["100%", "0%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* CTA Section - completely fixed/sticky at the top */}
      <div
        ref={ctaSectionRef}
        className="sticky top-0 left-0 w-full h-screen z-10"
      >
        <CTASection />
      </div>

      {/* Contact+Footer Section with Framer Motion for smooth sliding */}
      <motion.div
        ref={contactFooterRef}
        style={{
          y: contactY,
        }}
        className="relative z-20"
      >
        <div className="bg-transparent">
          <ContactSection />
        </div>
        <Footer />
      </motion.div>
    </div>
  );
}
