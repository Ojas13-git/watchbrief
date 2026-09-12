"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Surface } from "@/components/ui/surface";
import { BriefMarkdown } from "@/components/brief-markdown";
import type { BriefRow } from "@/lib/types";

type HistoryPanelProps = {
  historyQ: string;
  onHistoryQChange: (value: string) => void;
  briefs: BriefRow[];
  historyLoading: boolean;
  historyTotal: number;
  historyPage: number;
  historyPageCount: number;
  debouncedHistoryQ: string;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function HistoryPanel({
  historyQ,
  onHistoryQChange,
  briefs,
  historyLoading,
  historyTotal,
  historyPage,
  historyPageCount,
  debouncedHistoryQ,
  onPrevPage,
  onNextPage,
}: HistoryPanelProps) {
  return (
    <Surface className="overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-ink">
          History
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          {historyLoading ? "Loading…" : `${historyTotal} brief(s)`}
        </p>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="relative">
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

        {!historyLoading && briefs.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-faint">
            {debouncedHistoryQ
              ? "No matching briefs."
              : "No briefs yet. Generate one."}
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {briefs.map((row) => (
              <li
                key={row.id}
                className="rounded-[var(--radius-sm)] border border-line bg-paper p-4"
              >
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-ink-muted">
                  <span className="font-mono font-medium text-ink">
                    {row.symbols}
                  </span>
                  <time dateTime={row.createdAt}>
                    {new Date(row.createdAt).toLocaleString()}
                  </time>
                </div>
                <BriefMarkdown text={row.content} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={historyPage <= 1 || historyLoading}
          onClick={onPrevPage}
        >
          Prev
        </Button>
        <span className="text-xs text-ink-muted">
          Page {historyPage} / {historyPageCount}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={historyPage >= historyPageCount || historyLoading}
          onClick={onNextPage}
        >
          Next
        </Button>
      </div>
    </Surface>
  );
}
