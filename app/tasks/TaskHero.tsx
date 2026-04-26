"use client";

import { useEffect, useState } from "react";
import { motion, cubicBezier } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { TASK_CATEGORIES } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
};

export default function TasksHero({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const activeCategory = searchParams.category || "all";

  return (
    <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
      {/* ===== BASE (same system as homepage) ===== */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Grid */}
      <div
        className="absolute inset-0 
        bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
             linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
        bg-[size:40px_40px]"
      />

      {/* Glow */}
      <div
        className="absolute inset-0 
        bg-[radial-gradient(circle_at_50%_40%,rgba(59,53,196,0.25),transparent_60%)]"
      />

      {/* Extra glow depth */}
      <div
        className="absolute inset-0 
        bg-[radial-gradient(circle_at_20%_80%,rgba(59,53,196,0.15),transparent_50%)]"
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* ===== CONTENT ===== */}
      <div className="relative max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp}
          className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]"
        >
          Discover work
          <br />
          <span className="text-[#c7c3ff] italic font-light">around you</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.15 }}
          className="mt-6 text-white/60 text-lg max-w-xl mx-auto"
        >
          Verified opportunities. Real people. Instant matching.
        </motion.p>

        {/* ===== SEARCH ===== */}
        <motion.form
          {...fadeUp}
          transition={{ delay: 0.3 }}
          method="GET"
          className="mt-12 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <div className="relative w-full sm:w-[520px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4 group-focus-within:text-[#3b35c4] transition" />

            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder="Search tasks, locations..."
              className="w-full h-14 pl-11 pr-4 rounded-full 
              bg-white/10 backdrop-blur-xl 
              border border-white/10 
              text-sm text-white placeholder:text-white/40
              focus:outline-none focus:ring-2 focus:ring-[#3b35c4]
              transition"
            />
          </div>

          <button
            className="h-14 px-8 rounded-full 
            bg-[#3b35c4] text-white font-medium 
            shadow-[0_6px_20px_rgba(59,53,196,0.5)]
            hover:scale-[1.04] active:scale-[0.98]
            transition"
          >
            Search
          </button>
        </motion.form>
      </div>

      {/* ===== FLOATING CATEGORY BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-14 px-6"
      >
        <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-2 text-white/40 shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          {["all", ...TASK_CATEGORIES].map((cat) => (
            <a
              key={cat}
              href={`/tasks?category=${cat}${searchParams.q ? `&q=${searchParams.q}` : ""}`}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs whitespace-nowrap transition backdrop-blur-md border",
                activeCategory === cat
                  ? "bg-white text-black border-white shadow-lg"
                  : "bg-white/10 text-white/70 border-white/10 hover:bg-white/20",
              )}
            >
              {cat}
            </a>
          ))}
        </div>
      </motion.div>

      {/* ===== BOTTOM FADE (SMOOTH TRANSITION) ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#faf7f2]" />
    </section>
  );
}
