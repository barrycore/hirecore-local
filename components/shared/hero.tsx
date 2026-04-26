"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const images = [
  "/images/cleaner.jpeg",
  "/images/carpenter.jpeg",
  "/images/tailor.jpeg",
  "/images/electrician.jpeg",
  "/images/mechanic.jpeg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
      {/* Grid Base Background */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0f]">
        {/* Grid lines */}
        <div
          className="absolute inset-0 
    bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
        linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
    bg-[size:40px_40px]"
        />

        {/* Glow accent */}
        <div
          className="absolute inset-0 
    bg-[radial-gradient(circle_at_50%_50%,rgba(59,53,196,0.25),transparent_60%)]"
        />
      </div>
      {/* Background Image Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-10"
        >
          <Image
            src={images[index]}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Layers (depth) */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80" />

      {/* Subtle color glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,53,196,0.25),transparent_50%)]" />

      {/* Noise texture (optional but premium feel) */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
        >
          Work moves faster
          <br />
          <span className="italic font-light text-[#c7c3ff]">
            when it's verified.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-xl mx-auto"
        >
          Verified workers. Instant matching. Secure escrow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center gap-4 flex-wrap"
        >
          <Link
            href="/apply-workforce"
            className="bg-white text-black px-8 py-4 rounded-full font-medium flex items-center gap-2 shadow-xl hover:scale-[1.03] transition"
          >
            Become verified <ArrowRight size={16} />
          </Link>

          <Link
            href="/tasks"
            className="border border-white/30 text-white px-8 py-4 rounded-full backdrop-blur-md hover:bg-white/10 transition"
          >
            Browse work
          </Link>
        </motion.div>
      </div>

      

      {/* Bottom fade for smooth section transition */}
    </section>
  );
}
