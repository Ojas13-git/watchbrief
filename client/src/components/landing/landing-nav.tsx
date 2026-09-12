"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5"
    >
      <Link href="/" className="display text-xl text-ink">
        WatchBrief
      </Link>
      <nav className="flex items-center gap-2">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Get started</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link href="/app">
            <Button size="sm">Open desk</Button>
          </Link>
          <UserButton />
        </Show>
      </nav>
    </motion.header>
  );
}
