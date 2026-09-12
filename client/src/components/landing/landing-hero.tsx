"use client";

import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="display mb-6 text-4xl tracking-tight text-ink sm:text-5xl md:text-6xl"
      >
        WatchBrief
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl text-balance text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl md:text-[2.15rem] md:leading-[1.25]"
      >
        Calm AI briefs for your NSE watchlist.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-ink-muted sm:text-lg"
      >
        Track Indian equities. Generate a neutral overview with citations ethos —
        no buy/sell calls, no fake prices.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <Show when="signed-out">
          <SignUpButton mode="modal">
            <Button size="lg">Start your desk</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link href="/app">
            <Button size="lg">Open your desk</Button>
          </Link>
        </Show>
        <a
          href="#how"
          className="text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          How it works
        </a>
      </motion.div>
    </section>
  );
}
