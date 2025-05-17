"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CTASection from "./CTA";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function SmoothScrollContainer() {
  // Create refs for the main sections with proper typing
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const contactFooterRef = useRef<HTMLDivElement>(null);

  // Use Framer Motion's scroll hooks for smooth animation
  const { scrollY } = useScroll();

  // State to store the offset where the sliding should begin
  const [slideStartOffset, setSlideStartOffset] = useState<number>(0);
  // State to track if component is mounted and ready
  const [isReady, setIsReady] = useState<boolean>(false);

  // Calculate where the slide should start (after CTA section)
  useEffect(() => {
    const updateSlideStartPosition = () => {
      if (!ctaSectionRef.current) return;

      // The slide starts when the CTA section bottom would reach viewport bottom
      const ctaHeight = ctaSectionRef.current.offsetHeight;

      // Set the absolute scroll position where sliding should begin
      setSlideStartOffset(ctaHeight);

      // Mark component as ready once we have valid measurements
      if (!isReady) setIsReady(true);
    };

    // Initial calculation
    updateSlideStartPosition();

    // Set up a MutationObserver to detect content changes that affect height
    if (ctaSectionRef.current) {
      const observer = new MutationObserver(updateSlideStartPosition);
      observer.observe(ctaSectionRef.current, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });

      // Clean up the observer on unmount
      return () => observer.disconnect();
    }

    // Recalculate on resize for responsive behavior
    window.addEventListener("resize", updateSlideStartPosition);
    return () => {
      window.removeEventListener("resize", updateSlideStartPosition);
    };
  }, [isReady]);

  // Calculate the sliding progress based on scroll position with error handling
  const slideRangeMultiplier = 3; // Higher = slower/more gradual slide

  // Transform scroll position to slide progress value (0 to 1)
  const slideProgress = useTransform(scrollY, (value) => {
    // Safety checks to prevent NaN or calculations with invalid values
    if (!isReady || !containerRef.current || slideStartOffset <= 0) return 0;

    const viewportHeight = window.innerHeight;
    // Ensure we have a minimum slide distance to prevent division by zero
    const totalSlideDistance = Math.max(
      viewportHeight * slideRangeMultiplier,
      100
    );

    // No movement until we reach the start offset
    if (value < slideStartOffset) return 0;

    // Calculate progress from 0 to 1 over the extended slide distance
    const progress = Math.min(
      (value - slideStartOffset) / totalSlideDistance,
      1
    );

    return progress;
  });

  // Use spring physics for extra smooth animation
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
      {isReady && (
        <motion.div
          ref={contactFooterRef}
          style={{
            y: contactY,
          }}
          className="relative z-20"
          aria-hidden={!isReady} // Accessibility improvement
        >
          <div className="bg-transparent">
            <ContactSection />
          </div>
          <Footer />
        </motion.div>
      )}

      {/* Fallback while measuring - prevents flash of unstyled content */}
      {!isReady && (
        <div className="invisible">
          <div className="bg-transparent">
            <ContactSection />
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
