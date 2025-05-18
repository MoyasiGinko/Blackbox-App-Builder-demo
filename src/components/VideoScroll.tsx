"use client";
import React, { useRef, useEffect, useState } from "react";

const ImmersiveVideoScroll = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on initial load and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div className="relative w-full overflow-hidden">
      {/* Header Section - closely matching the image */}
      <div className="bg-transparent w-full max-w-7xl mx-auto pt-12 md:pt-20 pb-20 md:pb-40">
        <div className="container mx-auto px-4 md:px-8">
          {/* Responsive heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight md:leading-none tracking-tight mb-10 md:mb-16">
            Connecting Ideals to
            <br />
            Uniquely Crafted
            <br />
            Experiences
          </h1>

          {/* Responsive flex container that switches to column on mobile */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-16 md:mt-32 gap-8 md:gap-0">
            {/* Video container (full width on mobile, half on desktop) */}
            <div
              ref={sectionRef}
              className="w-full md:w-1/2 bg-blue-300 h-60 md:h-80 relative z-10 overflow-hidden rounded-xl shadow-xl"
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

            {/* Text content (full width on mobile, half on desktop) */}
            <div className="w-full md:w-1/2 md:pl-16 mt-6 md:mt-0">
              <p className="text-xl md:text-2xl font-light">
                At Lusion, we don't follow trends for the
                <br className="hidden md:block" />
                sake of it. We believe in a different
                <br className="hidden md:block" />
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
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Continue Exploring</h2>
          <p className="text-lg md:text-xl">
            Our unique approach combines cutting-edge technology with artistic
            vision to create memorable digital experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-4 md:p-6 rounded-lg">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Feature {i}</h3>
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
