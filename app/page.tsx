"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Hero from "@/components/shared/hero";
import SectionDivider from "@/components/shared/section-divider";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
};

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <Hero />

      <SectionDivider />

      {/* STATS */}
      <section className="relative bg-surface px-6 py-28 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_45%)]" />

        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            ["12,480", "Active workers"],
            ["1,204", "Live tasks"],
            ["9,301", "Matches today"],
            ["97%", "Completion rate"],
          ].map(([v, l]) => (
            <motion.div
              key={l}
              {...fadeUp}
              className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur-xl"
            >
              <div className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                {v}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionDivider flip />

      {/* HOW IT WORKS */}
      <section className="relative bg-background px-6 py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_45%),radial-gradient(circle_at_80%_60%,hsl(var(--secondary)/0.08),transparent_40%)]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <motion.div {...fadeUp}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              How it works
            </p>

            <h2 className="mx-auto mb-16 max-w-3xl text-4xl font-black tracking-tight text-foreground md:text-5xl">
              From request to completed — in minutes
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["01", "Verify", "ID + biometric check"],
              ["02", "Match", "Smart local matching"],
              ["03", "Get Paid", "Instant escrow payout"],
            ].map(([n, t, d]) => (
              <motion.div
                key={t}
                {...fadeUp}
                className="group rounded-3xl border border-border bg-card/80 p-10 text-left shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                  {n}
                </div>

                <div className="mb-3 text-xl font-bold text-card-foreground">
                  {t}
                </div>

                <p className="text-sm leading-6 text-muted-foreground">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE + CONTENT SPLIT */}
      <section className="relative bg-section-dark px-6 py-32 text-section-dark-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.22),transparent_42%)]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <motion.div
            {...fadeUp}
            className="relative h-[420px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl"
          >
            <Image
              src="/images/delivery-guy.jpeg"
              alt="Verified worker completing a local task"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </motion.div>

          <motion.div {...fadeUp}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              For workers
            </p>

            <h3 className="mb-6 text-4xl font-black tracking-tight md:text-5xl">
              Get paid for skills you already have
            </h3>

            <p className="mb-10 max-w-xl text-section-dark-foreground/70">
              HireCore helps skilled local workers find trusted tasks, build a
              visible reputation, and earn without the usual chaos.
            </p>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Free to join",
                "Instant job matching",
                "Same-day payouts",
                "Build reputation",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="peak" />

      {/* FINAL CTA */}
      <section className="relative bg-surface-soft px-6 py-36 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,hsl(var(--secondary)/0.18),transparent_45%),radial-gradient(circle_at_50%_90%,hsl(var(--primary)/0.1),transparent_45%)]" />

        <motion.div {...fadeUp} className="relative mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Ready when you are
          </p>

          <h2 className="mb-6 text-4xl font-black tracking-tight text-foreground md:text-6xl">
            The future of local work is already here
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-muted-foreground">
            Join a trusted network built for speed, verification, and reliable
            work opportunities.
          </p>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get started <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}