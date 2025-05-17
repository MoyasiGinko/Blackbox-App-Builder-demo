"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FullscreenLoading() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  // Properly type the refs to fix TypeScript errors
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const forceCompleteTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Set minimum duration to 6 seconds
    const startTime = Date.now();
    const minDuration = 6000; // 6 seconds
    const maxDuration = 20000; // 20 seconds - safety timeout

    // Track scroll position and prevent scrolling
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";

    // Smooth progress increments (less jumpy)
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        // More predictable and smooth progress increments
        let increment = 1;
        if (prev < 30) increment = 2;
        else if (prev < 60) increment = 1.5;
        else if (prev < 80) increment = 0.8;
        else increment = 0.5;

        // Add slight randomness but keep it small
        increment += Math.random() * 0.5;

        const newProgress = Math.min(prev + increment, 100);

        // If we're at 100%, check if minimum time has elapsed
        if (newProgress >= 100) {
          const elapsedTime = Date.now() - startTime;

          // If we haven't reached minimum duration, stay at 99%
          if (elapsedTime < minDuration) {
            return 99;
          }

          // If minimum duration elapsed, clear interval and hide loader after a brief delay
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
          }
          timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
          return 100;
        }

        return newProgress;
      });
    }, 100);

    // Safety timeout - force complete after maxDuration
    safetyTimeoutRef.current = setTimeout(() => {
      setProgress(100);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
    }, maxDuration);

    // Clean up function
    return () => {
      // Clear all timers
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = undefined;
      }
      if (forceCompleteTimeoutRef.current) {
        clearTimeout(forceCompleteTimeoutRef.current);
        forceCompleteTimeoutRef.current = undefined;
      }

      // Restore scrolling when component unmounts
      const scrollY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Also restore scrolling when loading screen becomes invisible
  useEffect(() => {
    if (!isVisible) {
      // Restore scrolling and position
      const scrollY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }, [isVisible]);

  // Error handling for possible loading timeouts
  useEffect(() => {
    forceCompleteTimeoutRef.current = setTimeout(() => {
      // If we're still under 95% after 15 seconds, force completion
      if (progress < 95 && isVisible) {
        console.warn("Loading took too long, forcing completion");
        setProgress(100);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
        timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
      }
    }, 15000);

    return () => {
      if (forceCompleteTimeoutRef.current) {
        clearTimeout(forceCompleteTimeoutRef.current);
        forceCompleteTimeoutRef.current = undefined;
      }
    };
  }, [progress, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Loading GIF in the center with error handling */}
          <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] mb-8">
            <Image
              src="/loading/load18.gif"
              alt="Loading animation"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Progress bar at bottom left */}
          <div className="absolute bottom-8 left-8 w-64">
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
            <div className="mt-2 text-emerald-400 text-sm font-medium">
              {Math.floor(progress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
