"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { motion } from "framer-motion";

const pageOrder = ["/", "/about", "/projects", "/contact"];

export default function Footer() {
  const router = useRouter();
  const footerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const isNavigating = useRef(false);

  // Add cooldown state instead of navigationTriggered ref
  const [isCooldown, setIsCooldown] = useState(false);

  // Add a state to track the countdown seconds
  const [cooldownSeconds, setCooldownSeconds] = useState(5);

  // Track progress and timing
  const lastScrollTime = useRef(Date.now());
  const decreaseInterval = useRef<NodeJS.Timeout | null>(null);
  const decreaseRate = 0.15; // How much progress decreases per second when not scrolling
  const increaseAmount = 0.05; // How much progress increases per scroll event

  // Set up cooldown timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // If we're in cooldown, start the countdown
    if (isCooldown) {
      setCooldownSeconds(5); // Reset to 5 seconds when cooldown starts

      intervalId = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Reset the countdown when not in cooldown
      setCooldownSeconds(5);
    }

    // Clean up interval when cooldown ends or component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCooldown]);

  useEffect(() => {
    if (!footerRef.current || !progressBarRef.current) return;

    // Start the progress decrease interval
    const startDecreaseInterval = () => {
      // Clear any existing interval first
      if (decreaseInterval.current) {
        clearInterval(decreaseInterval.current);
      }

      // Create new interval that runs every 100ms
      decreaseInterval.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastScroll = currentTime - lastScrollTime.current;

        // If it's been more than 300ms since last scroll, start decreasing
        // But only if we're not in cooldown and not navigating
        if (
          timeSinceLastScroll > 300 &&
          progress > 0 &&
          !isNavigating.current &&
          !isCooldown
        ) {
          // Calculate how much to decrease (based on time since last update)
          const decreaseAmount = decreaseRate * (timeSinceLastScroll / 1000);

          // Update progress with a minimum of 0
          const newProgress = Math.max(0, progress - decreaseAmount);
          setProgress(newProgress);

          // Update progress bar width
          gsap.to(progressBarRef.current, {
            width: `${newProgress * 100}%`,
            duration: 0.1,
            backgroundColor:
              newProgress < 0.5
                ? "#3B82F6"
                : newProgress < 0.8
                ? "#10B981"
                : "#EF4444",
          });

          // Reset lastScrollTime to current time to make decrease smoother
          lastScrollTime.current = currentTime;
        }
      }, 100);
    };

    // Start the decrease interval immediately
    startDecreaseInterval();

    // Handle wheel events for the entire document
    const handleWheel = (e: WheelEvent) => {
      // Check if we're at the bottom of the page
      const isAtBottom =
        window.innerHeight + Math.round(window.scrollY) >=
        document.body.offsetHeight - 10; // 10px tolerance

      // Only process wheel events when at the bottom and scrolling down
      // Also check if we're in cooldown
      if (isAtBottom && e.deltaY > 0 && !isNavigating.current && !isCooldown) {
        e.preventDefault(); // Prevent actual scroll

        // Update last scroll time
        lastScrollTime.current = Date.now();

        // Increase progress based on scroll intensity
        const scrollIntensity = Math.min(1, Math.abs(e.deltaY) / 100);
        const progressIncrease = increaseAmount * scrollIntensity;

        // Update progress with a maximum of 1
        const newProgress = Math.min(1, progress + progressIncrease);
        setProgress(newProgress);

        // Update progress bar width
        gsap.to(progressBarRef.current, {
          width: `${newProgress * 100}%`,
          duration: 0.1,
          backgroundColor:
            newProgress < 0.5
              ? "#3B82F6"
              : newProgress < 0.8
              ? "#10B981"
              : "#EF4444",
        });

        // Check if we've reached the threshold to navigate
        if (newProgress >= 1 && !isNavigating.current && !isCooldown) {
          isNavigating.current = true;
          setIsCooldown(true); // This will trigger the countdown effect

          // Clear the decrease interval
          if (decreaseInterval.current) {
            clearInterval(decreaseInterval.current);
            decreaseInterval.current = null;
          }

          // Determine next page
          const currentPath = window.location.pathname;
          const currentIndex = pageOrder.indexOf(currentPath);
          const nextIndex = (currentIndex + 1) % pageOrder.length;
          const nextPath = pageOrder[nextIndex];

          // Navigate after seeing completed progress for a brief delay
          setTimeout(() => {
            router.push(nextPath);
          }, 400);

          // Set up 5-second cooldown - after this time, reset everything
          setTimeout(() => {
            setProgress(0);
            isNavigating.current = false;
            setIsCooldown(false); // This will clear the countdown effect

            // Reset progress bar appearance
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, {
                width: "0%",
                backgroundColor: "#3B82F6", // Blue color
              });
            }

            // Restart the decrease interval
            startDecreaseInterval();
          }, 5000); // 5-second cooldown
        }
      }
    };

    // Add event listener with passive: false to allow preventDefault
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (decreaseInterval.current) {
        clearInterval(decreaseInterval.current);
      }
    };
  }, [progress, router, isCooldown]); // Added isCooldown to dependencies

  // Reset on component mount
  useEffect(() => {
    setProgress(0);
    isNavigating.current = false;
    setIsCooldown(false);

    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, {
        width: "0%",
        backgroundColor: "#3B82F6",
      });
    }
  }, []);

  return (
    <motion.footer
      ref={footerRef}
      className="w-full min-h-[20vh] bg-black text-white py-12 flex flex-col items-center justify-center relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-700 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full transition-colors"
          style={{
            width: `${progress * 100}%`,
            backgroundColor:
              progress < 0.5
                ? "#3B82F6"
                : progress < 0.8
                ? "#10B981"
                : "#EF4444",
          }}
        />
      </div>

      <div className="max-w-7xl w-full px-6 flex justify-between items-center">
        <div className="text-sm uppercase tracking-widest">
          {isCooldown
            ? `Cooldown: ${cooldownSeconds}s...`
            : progress < 0.9
            ? "Keep Scrolling to Continue"
            : "Navigating to Next Page..."}
        </div>

        <div className="flex items-center space-x-2 cursor-pointer select-none">
          <span className="uppercase tracking-widest">Next Page</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Progress indicator text */}
      <div className="mt-6 text-gray-400 font-semibold">
        {isCooldown
          ? `Cooldown: ${cooldownSeconds}s`
          : `Progress: ${Math.round(progress * 100)}%`}
      </div>
    </motion.footer>
  );
}
