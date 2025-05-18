"use client";
import React, { useRef, useEffect, useState } from "react";

const ImmersiveVideoScroll = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Video scroll logic (commented out for now)
  /*
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollPercentage = 1 - (rect.top / windowHeight);

      setScrollPosition(scrollPercentage);

      // Trigger fullscreen state when scrolled past threshold
      if (scrollPercentage > 0.3 && !isFullscreen && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsFullscreen(true);
          setIsTransitioning(false);
        }, 500);
      }

      // Exit fullscreen when scrolled back up
      if (scrollPercentage < 0.1 && isFullscreen && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsFullscreen(false);
          setIsTransitioning(false);
        }, 500);
      }

      // Control video playback based on scroll
      if (videoRef.current && isFullscreen) {
        const video = videoRef.current;
        const videoDuration = video.duration || 10; // Fallback duration
        const targetTime = videoDuration * (scrollPercentage - 0.3) / 0.7;

        // Clamp time between 0 and video duration
        const clampedTime = Math.max(0, Math.min(targetTime, videoDuration));

        if (Math.abs(video.currentTime - clampedTime) > 0.1) {
          video.currentTime = clampedTime;
        }

        // Exit fullscreen when video reaches end or beginning
        if (clampedTime >= videoDuration - 0.2 || clampedTime <= 0.2) {
          if (isFullscreen) {
            setIsTransitioning(true);
            setTimeout(() => {
              setIsFullscreen(false);
              setIsTransitioning(false);
            }, 500);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFullscreen, isTransitioning]);
  */

  return (
    <div className="relative min-h-screen">
      {/* Header Section - closely matching the image */}
      <div className="bg-trnasparent max-w-7xl mx-auto pt-20 pb-40">
        <div className="container mx-auto px-8">
          <h1 className="text-7xl font-bold leading-none tracking-tight mb-16">
            Connecting Ideals to
            <br />
            Uniquely Crafted
            <br />
            Experiences
          </h1>

          {/* Decorative teal curved lines in background */}
          <div className="relative">
            <div className="w-full h-2 bg-teal-300 rounded-full absolute -right-20 top-24 -z-10 transform rotate-3"></div>
            <div className="w-full h-2 bg-teal-300 rounded-full absolute -right-32 top-48 -z-10 transform -rotate-2"></div>
            <div className="w-full h-2 bg-teal-300 rounded-full absolute -right-16 top-72 -z-10 transform rotate-1"></div>
          </div>

          <div className="flex justify-between items-center mt-32">
            {/* Video container (left side) */}
            <div
              ref={sectionRef}
              className="w-1/2 bg-blue-300 h-80 relative z-10 overflow-hidden rounded-xl shadow-xl"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/api/placeholder/400/320"
                muted
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Text content (right side) */}
            <div className="w-1/2 pl-16">
              <p className="text-2xl font-light">
                At Lusion, we don't follow trends for the
                <br />
                sake of it. We believe in a different
                <br />
                approach - one that's centered around
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add spacing for scrolling */}
      {/* <div className="h-screen"></div>
      <div className="h-screen"></div> */}

      {/* Content that appears after the immersive video experience */}
      {/* <div
        className={`bg-white py-24 transition-opacity duration-500 ${
          isFullscreen ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Continue Exploring</h2>
          <p className="text-xl">
            Our unique approach combines cutting-edge technology with artistic
            vision to create memorable digital experiences.
          </p>

          <div className="grid grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Feature {i}</h3>
                <p>
                  Discover how our innovative solutions can transform your
                  digital presence.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ImmersiveVideoScroll;
