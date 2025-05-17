"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import LoadingBar from "./LoadingBar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import CallToActionSection from "./CTA";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Simulate loading state on route change
  useEffect(() => {
    setLoading(true);
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    loadingTimeout.current = setTimeout(() => {
      setLoading(false);
    }, 1500); // simulate 1.5s loading time

    return () => {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    };
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          className="flex-grow pt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <CallToActionSection />
      <Footer />
      {loading && <LoadingBar />}
    </div>
  );
}
