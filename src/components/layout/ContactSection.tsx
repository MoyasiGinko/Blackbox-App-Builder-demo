"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export default function ContactSection() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would normally send the email to your backend
    console.log("Submitting email:", email);

    // Show success state
    setSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="h-auto w-full bg-white px-6 lg:px-12 py-24 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {/* Contact Information Column */}
          <div className="space-y-1">
            <p className="text-black text-lg">Suite 2</p>
            <p className="text-black text-lg">9 Marsh Street</p>
            <p className="text-black text-lg">Bristol, BS1 4AA</p>
            <p className="text-black text-lg">United Kingdom</p>
          </div>

          {/* Social Links Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Link
                href="https://twitter.com"
                className="text-black text-lg hover:text-gray-600 transition-colors block"
              >
                Twitter / X
              </Link>
              <Link
                href="https://instagram.com"
                className="text-black text-lg hover:text-gray-600 transition-colors block"
              >
                Instagram
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-black text-lg hover:text-gray-600 transition-colors block"
              >
                Linkedin
              </Link>
            </div>

            <div className="mt-12 space-y-1 pt-8">
              <p className="text-black text-lg">General enquiries</p>
              <Link
                href="mailto:hello@lusion.co"
                className="text-black text-lg hover:text-gray-600 transition-colors block"
              >
                hello@lusion.co
              </Link>
            </div>

            <div className="mt-12 space-y-1 pt-8">
              <p className="text-black text-lg">New business</p>
              <Link
                href="mailto:business@lusion.co"
                className="text-black text-lg hover:text-gray-600 transition-colors block"
              >
                business@lusion.co
              </Link>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h2 className="text-4xl font-medium mb-8">
              Subscribe to
              <br />
              our newsletter
            </h2>

            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={emailRef}
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-gray-100 rounded-md p-4 pr-12 focus:outline-none transition-all duration-300 ${
                  submitted ? "bg-green-50 text-green-600" : ""
                }`}
                required
              />
              <button
                type="submit"
                aria-label="Submit"
                disabled={submitted}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  submitted ? "text-green-600" : ""
                }`}
              >
                {submitted ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-black">©2024 LUSION Creative Studio</p>

            <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
              <Link
                href="https://labs.lusion.co"
                className="text-black hover:text-gray-600 transition-colors"
              >
                R&D: labs.lusion.co
              </Link>

              <p className="text-black flex items-center">
                Built by Lusion with{" "}
                <span className="text-red-500 mx-1">❤</span>
              </p>
            </div>
          </div>
        </div>

        {/* Back to top button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Back to top"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19V5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12L12 5L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
