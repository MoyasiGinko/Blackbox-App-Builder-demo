"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FullscreenLoading() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set minimum duration to 6 seconds
    const startTime = Date.now();
    const minDuration = 6000;

    // Prevent scrolling when loading screen is visible
    document.body.style.overflow = "hidden";

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Calculate new progress value
        const newProgress = Math.min(prev + Math.random() * 5, 100);

        // If we're at 100%, check if minimum time has elapsed
        if (newProgress >= 100) {
          const elapsedTime = Date.now() - startTime;

          // If we haven't reached minimum duration, stay at 99%
          if (elapsedTime < minDuration) {
            return 99;
          }

          // If minimum duration elapsed, clear interval and hide loader after a brief delay
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 200);
          return 100;
        }

        return newProgress;
      });
    }, 100);

    // Clean up function - restore scrolling and clear interval when component unmounts
    return () => {
      clearInterval(interval);
      document.body.style.overflow = ""; // Restore default overflow behavior
    };
  }, []);

  // Also restore scrolling when loading screen becomes invisible
  useEffect(() => {
    if (!isVisible) {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Loading GIF in the center */}
          <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] mb-8">
            {/* Replace with your actual loading GIF */}
            <Image
              src="/loading/load18.gif"
              alt="Loading animation"
              layout="fill"
              objectFit="contain"
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
