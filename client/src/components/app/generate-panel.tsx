"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiChat02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { BriefMarkdown } from "@/components/brief-markdown";

type GeneratePanelProps = {
  watchlistCount: number;
  generating: boolean;
  busy: boolean;
  briefText: string;
  onGenerate: () => void;
  onAbort: () => void;
};

export function GeneratePanel({
  watchlistCount,
  generating,
  busy,
  briefText,
  onGenerate,
  onAbort,
}: GeneratePanelProps) {
  return (
    <Surface className="overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-ink">
          Generate brief
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          {watchlistCount === 0
            ? "Add at least one ticker to generate."
            : `Uses your full watchlist (${watchlistCount}), not the current search page.`}
        </p>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onGenerate}
            disabled={generating || watchlistCount === 0 || busy}
          >
            <HugeiconsIcon icon={AiChat02Icon} size={16} strokeWidth={1.75} />
            {generating ? "Generating…" : "Generate brief"}
          </Button>
          <Button
            variant="secondary"
            onClick={onAbort}
            disabled={!generating}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.75} />
            Stop
          </Button>
        </div>

        {briefText ? (
          <div className="space-y-3">
            <div className="max-h-[28rem] overflow-y-auto rounded-[var(--radius-sm)] border border-line bg-paper px-1 py-1">
              <BriefMarkdown text={briefText} />
            </div>
            {!generating ? (
              <p className="text-xs text-ink-muted">
                Saved.{" "}
                <Link
                  href="/app/history"
                  className="font-medium text-accent hover:text-accent-hover"
                >
                  Open in history
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-paper px-4 py-10 text-center text-sm text-ink-faint">
            Your streamed brief will appear here.
          </div>
        )}
      </div>
    </Surface>
  );
}
