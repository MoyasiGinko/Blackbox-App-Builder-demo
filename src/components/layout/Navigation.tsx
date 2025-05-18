"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  const menuItems = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT US" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/contact", label: "CONTACT" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.15,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <>
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold">
            MOYASI
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="px-6 py-2.5 hidden md:block bg-[#2A2A2A] text-white rounded-full text-sm hover:bg-black transition-colors"
          >
            LET&#39;S TALK •
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-6 py-2.5 bg-white text-black rounded-full cursor-pointer text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              {isOpen ? "CLOSE" : "MENU"} <span>{isOpen ? "•" : "••"}</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-[300px] bg-transparent shadow-lg rounded-lg overflow-hidden"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuVariants}
                >
                  <div className="">
                    {/* Navigation Links */}
                    <nav className="space-y-4 p-4 mb-4 bg-white rounded-2xl text-black">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="group"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-light hover:opacity-50 transition-opacity flex items-center justify-between"
                          >
                            {item.label}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              •
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    {/* Newsletter Section */}
                    <motion.div
                      className="mb-4 p-4 bg-white rounded-2xl text-black"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-lg font-light mb-4">
                        Subscribe to
                        <br />
                        our newsletter
                      </h2>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email"
                          className="w-full px-4 py-2.5 bg-[#F4F4F4] rounded-full text-sm outline-none placeholder:text-black/50"
                        />
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-50 transition-opacity"
                          aria-label="Submit email"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M17 12H3M17 12L10 5M17 12L10 19"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </motion.div>

                    {/* Labs Section */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 border-t border-gray-100 bg-black rounded-2xl text-white"
                    >
                      <Link
                        href="/labs"
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between hover:opacity-50 transition-opacity"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5">
                            <svg
                              viewBox="0 0 32 32"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="16" cy="16" r="12" />
                            </svg>
                          </div>
                          <span className="text-base tracking-wide">LABS</span>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="transform group-hover:translate-x-1 transition-transform"
                        >
                          <path
                            d="M17 12H3M17 12L10 5M17 12L10 19"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
