"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLHeadingElement>(null);
  const blueCurveRef = useRef<HTMLDivElement>(null);

  // For the moving blue curve
  const [curveProgress, setCurveProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current || !videoWrapperRef.current)
      return;

    // Set initial positions - small video on left side
    gsap.set(videoWrapperRef.current, {
      position: "relative",
      left: "0",
      width: "30%", // Start smaller
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      height: "250px", // Control initial height
    });

    gsap.set(videoRef.current, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    });

    // Main timeline for the morphing animation - specifically triggered by the video itself
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoWrapperRef.current, // Using the video as the trigger
        start: "top 70%", // Start animation when top of video is 70% down viewport
        end: "center 30%", // End when center of video reaches 30% from top of viewport
        scrub: 1,
        onUpdate: (self) => {
          setCurveProgress(self.progress); // Update the curve progress state
        },
        markers: false, // Set to true for debugging
      },
    });

    // Animation sequence for video morphing
    tl
      // First slightly move toward center while growing
      .to(videoWrapperRef.current, {
        left: "5%",
        width: "60%",
        height: "350px",
        duration: 0.3,
        ease: "power2.inOut",
      })
      // Then expand to full width and height
      .to(
        videoWrapperRef.current,
        {
          width: "100%",
          height: "70vh", // Taller final height
          left: "0%",
          borderRadius: "0px",
          duration: 0.7,
          ease: "power2.inOut",
        },
        "expand"
      )
      // Reveal the new content
      .to(
        ".about-reveal-content",
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "expand+=0.3"
      );

    // Separate timeline for the heading animations
    if (headingRef.current && subHeadingRef.current) {
      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: false,
        },
      });

      headingTl
        .from(headingRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        })
        .from(
          subHeadingRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay was prevented", error);
      });
    }
  }, []);

  // Additional framer-motion scroll parallax for smooth animations
  const { scrollYProgress } = useScroll({
    target: videoWrapperRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effect
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.8, 0.9, 1]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white text-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-24 relative z-10">
        {/* Heading section */}
        <div ref={headingWrapperRef} className="mb-16">
          <motion.h2
            ref={headingRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl leading-tight lg:text-9xl font-medium mb-2"
          >
            <span className="flex justify-center">
              <span className="word inline-block">Beyond Visions</span>
            </span>
            <span className="flex justify-start">
              <span className="word inline-block">Within Reach</span>
            </span>
          </motion.h2>

          <div className="max-w-lg ml-auto">
            <motion.p
              ref={subHeadingRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-lg text-lg md:text-xl opacity-80 mt-6 text-left ml-auto"
            >
              Lusion is a digital production studio that brings your ideas to
              life through visually captivating designs and interactive
              experiences. Lusion is a digital production studio that brings
              your ideas to life through visually captivating designs and
              interactive experiences.
            </motion.p>
            <div className="flex justify-start mt-6">
              <button
                className="px-6 py-3 bg-blue-50 text-black rounded-full font-semibold shadow hover:bg-blue-100 transition"
                type="button"
              >
                About Us
              </button>
            </div>
          </div>
        </div>

        {/* Video container - small on left initially, becomes big on scroll */}
        <div className="relative mb-24 min-h-[40vh]">
          <motion.div
            ref={videoWrapperRef}
            style={{
              scale,
              opacity,
              transformOrigin: "left center", // Ensures scaling happens from the left side
            }}
            className="overflow-hidden rounded-lg"
            id="home-reel-video-container"
          >
            {/* Video top decoration */}
            <div id="home-reel-video-container-decoration">
              <div id="home-reel-video-container-top">
                <div id="home-reel-video-container-crosses">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="home-reel-video-container-cross"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <video
              ref={videoRef}
              src="https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-21474-large.mp4"
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
            />

            {/* Video bottom decoration */}
            <div id="home-reel-video-container-bottom">
              <div id="home-reel-video-container-crosses">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="home-reel-video-container-cross"
                  ></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS for animation elements */}
      <style jsx>{`
        .word {
          transform: translate3d(0px, 0%, 0px);
        }

        #home-reel-video-container-decoration {
          position: relative;
        }

        #home-reel-video-container-top,
        #home-reel-video-container-bottom {
          position: relative;
          height: 20px;
        }

        #home-reel-video-container-crosses {
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
        }

        .home-reel-video-container-cross {
          width: 8px;
          height: 8px;
          position: relative;
        }

        .home-reel-video-container-cross:before,
        .home-reel-video-container-cross:after {
          content: "";
          position: absolute;
          background: #3545ff;
        }

        .home-reel-video-container-cross:before {
          width: 8px;
          height: 2px;
          top: 3px;
          left: 0;
        }

        .home-reel-video-container-cross:after {
          width: 2px;
          height: 8px;
          top: 0;
          left: 3px;
        }

        @media (max-width: 768px) {
          #videoWrapperRef {
            width: 60% !important;
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
