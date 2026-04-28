"use client";

import { motion, cubicBezier } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, MapPin } from "lucide-react";
import { cn, TASK_CATEGORIES } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: cubicBezier(0.22, 1, 0.36, 1) },
};

export default function TasksHero({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const activeCategory = searchParams.category || "all";

  return (
    <section className="relative overflow-hidden bg-section-dark px-4 pb-16 pt-32 text-center text-section-dark-foreground sm:px-6 sm:pb-20 sm:pt-40">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--section-dark-foreground)/0.055)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--section-dark-foreground)/0.055)_1px,transparent_1px)] bg-[size:34px_34px] sm:bg-[size:44px_44px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--secondary)/0.14),transparent_34%),radial-gradient(circle_at_80%_25%,hsl(var(--primary)/0.24),transparent_38%),radial-gradient(circle_at_50%_95%,hsl(var(--primary)/0.16),transparent_45%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--section-dark)/0.15),hsl(var(--section-dark)/0.72),hsl(var(--section-dark)/1))]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          {...fadeUp}
          className="mx-auto mb-6 inline-flex max-w-[92vw] items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-section-dark-foreground/80 shadow-lg backdrop-blur-2xl sm:px-4 sm:text-sm"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
          <span className="truncate">Local tasks, verified faster</span>
        </motion.div>

        <motion.h1
          {...fadeUp}
          className="mx-auto max-w-4xl text-[clamp(3rem,12vw,6.5rem)] font-black leading-[0.96] tracking-[-0.07em]"
        >
          Discover work
          <br />
          <span className="gradient-text">around you.</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.12, duration: 0.75 }}
          className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-section-dark-foreground/70 sm:text-lg sm:leading-8"
        >
          Search verified local opportunities, filter by skill, and move from
          browsing to earning without the noise.
        </motion.p>

        <motion.form
          {...fadeUp}
          transition={{ delay: 0.24, duration: 0.75 }}
          method="GET"
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-section-dark-foreground/45" />

            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder="Search tasks, locations, skills..."
              className="h-14 w-full rounded-full border border-white/10 bg-white/10 pl-12 pr-4 text-sm text-section-dark-foreground outline-none placeholder:text-section-dark-foreground/40 transition focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] transition hover:-translate-y-0.5 hover:bg-primary/90">
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            ["1.2k+", "open tasks"],
            ["340+", "posted today"],
            ["97%", "verified"],
            ["Near", "your area"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl"
            >
              <div className="text-lg font-black">{value}</div>
              <div className="text-xs text-section-dark-foreground/55">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46 }}
        className="relative z-10 mt-10 px-0 sm:px-6"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto rounded-full border border-white/10 bg-white/10 p-2 backdrop-blur-2xl no-scrollbar">
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-section-dark-foreground/55">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          {["all", ...TASK_CATEGORIES].map((cat) => (
            <a
              key={cat}
              href={`/tasks?category=${cat}${
                searchParams.q ? `&q=${searchParams.q}` : ""
              }`}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-xs font-medium capitalize whitespace-nowrap transition",
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--glow-primary)]"
                  : "border-white/10 bg-white/10 text-section-dark-foreground/70 hover:bg-white/15 hover:text-section-dark-foreground",
              )}
            >
              {cat}
            </a>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}