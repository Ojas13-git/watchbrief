"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiChat02Icon,
  Search01Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";

const steps = [
  {
    icon: Bookmark02Icon,
    title: "Build a watchlist",
    body: "Add up to 10 NSE symbols. Search and paginate without leaving the desk.",
  },
  {
    icon: AiChat02Icon,
    title: "Generate a brief",
    body: "One stream over your full list — themes, risks, what to watch in filings.",
  },
  {
    icon: Search01Icon,
    title: "Keep history",
    body: "Every finished brief is saved. Search past research by ticker or text.",
  },
] as const;

export function LandingHow() {
  return (
    <section id="how" className="relative z-10 border-t border-line bg-paper-elevated/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="display text-3xl text-ink sm:text-4xl"
        >
          One desk. Three moves.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mt-3 max-w-xl text-ink-muted"
        >
          Built for people who want signal, not noise — and refuse to confuse an
          LLM overview with investment advice.
        </motion.p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="flex flex-col gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-paper text-accent">
                <HugeiconsIcon icon={step.icon} size={20} strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
