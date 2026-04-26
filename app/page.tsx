"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Hero from "@/components/shared/hero";
import SectionDivider from "@/components/shared/section-divider";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) },
};






export default function HomePage() {
  return (
    <div className="bg-[#faf7f2] text-[#0e0c0a] overflow-hidden">
      <Hero />

      <SectionDivider />

      {/* STATS */}
      <section className="py-32 px-6 text-center bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            ["12,480", "Active workers"],
            ["1,204", "Live tasks"],
            ["9,301", "Matches today"],
            ["97%", "Completion rate"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-4xl font-bold">{v}</div>
              <div className="text-sm text-gray-500 mt-2">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider flip />

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,53,196,0.08),transparent_50%)]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            From request to completed — in minutes
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["Verify", "ID + biometric check"],
              ["Match", "Smart local matching"],
              ["Get Paid", "Instant escrow payout"],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                {...fadeUp}
                className="bg-white rounded-3xl p-10 shadow-xl"
              >
                <div className="text-lg font-semibold mb-3">{t}</div>
                <p className="text-sm text-gray-500">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE + CONTENT SPLIT (BUT MODERN) */}
      <section className="py-32 px-6 bg-[#0e0c0a] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] rounded-3xl overflow-hidden">
            <Image
              src="/images/delivery-guy.jpeg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-6">
              Get paid for skills you already have
            </h3>
            <ul className="space-y-4">
              {[
                "Free to join",
                "Instant job matching",
                "Same-day payouts",
                "Build reputation",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <SectionDivider variant="peak" />

      {/* FINAL CTA */}
      <section className="py-40 px-6 text-center bg-gradient-to-br from-[#fef3d8] to-[#faf7f2]">
        <h2 className="text-5xl font-bold mb-6">
          The future of local work is already here
        </h2>

        <p className="text-gray-600 mb-10">
          Join a trusted network built for speed and reliability
        </p>

        <Link
          href="/auth/login"
          className="bg-black text-white px-10 py-5 rounded-full inline-flex items-center gap-2"
        >
          Get started <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
