"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Surface } from "@/components/ui/surface";
import { BriefMarkdown } from "@/components/brief-markdown";
import type { BriefRow } from "@/lib/types";

type HistoryPanelProps = {
  historyQ: string;
  onHistoryQChange: (value: string) => void;
  brief: BriefRow | null;
  historyLoading: boolean;
  historyTotal: number;
  historyPage: number;
  historyPageCount: number;
  debouncedHistoryQ: string;
  onPrev: () => void;
  onNext: () => void;
};

export function HistoryPanel({
  historyQ,
  onHistoryQChange,
  brief,
  historyLoading,
  historyTotal,
  historyPage,
  historyPageCount,
  debouncedHistoryQ,
  onPrev,
  onNext,
}: HistoryPanelProps) {
  return (
    <Surface className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-ink">
            Brief history
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            {historyLoading
              ? "Loading…"
              : historyTotal === 0
                ? "No briefs yet"
                : `Brief ${historyPage} of ${historyTotal}`}
          </p>
        </div>
        <div className="relative w-full max-w-xs sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <Input
            value={historyQ}
            onChange={(e) => onHistoryQChange(e.target.value)}
            placeholder="Search symbols or text…"
            className="pl-9"
            aria-label="Search briefs"
          />
        </div>
      </div>

      <div className="px-5 py-5">
        {historyLoading && !brief ? (
          <p className="py-16 text-center text-sm text-ink-faint">Loading…</p>
        ) : !brief ? (
          <p className="py-16 text-center text-sm text-ink-faint">
            {debouncedHistoryQ
              ? "No matching briefs."
              : "No briefs yet. Generate one from the desk."}
          </p>
        ) : (
          <article>
            <header className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
              <h3 className="font-mono text-sm font-semibold tracking-tight text-ink">
                {brief.symbols}
              </h3>
              <time
                className="text-xs text-ink-muted"
                dateTime={brief.createdAt}
              >
                {new Date(brief.createdAt).toLocaleString()}
              </time>
            </header>
            <BriefMarkdown text={brief.content} />
          </article>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={historyPage <= 1 || historyLoading || historyTotal === 0}
          onClick={onPrev}
          aria-label="Previous brief"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.75} />
          Previous
        </Button>
        <span className="text-xs tabular-nums text-ink-muted">
          {historyTotal === 0
            ? "—"
            : `${historyPage} / ${historyPageCount}`}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={
            historyPage >= historyPageCount ||
            historyLoading ||
            historyTotal === 0
          }
          onClick={onNext}
          aria-label="Next brief"
        >
          Next
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.75} />
        </Button>
      </div>
    </Surface>
  );
}
