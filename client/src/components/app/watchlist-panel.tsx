"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Surface } from "@/components/ui/surface";
import type { WatchlistItem } from "@/lib/types";

type WatchlistPanelProps = {
  q: string;
  onQChange: (value: string) => void;
  symbolInput: string;
  onSymbolInputChange: (value: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
  items: WatchlistItem[];
  loading: boolean;
  busy: boolean;
  watchlistCount: number;
  total: number;
  page: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  debouncedQ: string;
};

export function WatchlistPanel({
  q,
  onQChange,
  symbolInput,
  onSymbolInputChange,
  onAdd,
  onDelete,
  items,
  loading,
  busy,
  watchlistCount,
  total,
  page,
  pageCount,
  onPrevPage,
  onNextPage,
  debouncedQ,
}: WatchlistPanelProps) {
  return (
    <Surface className="overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-ink">
              Watchlist
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              {loading
                ? "Loading…"
                : `${watchlistCount} ticker(s) · ${total} match(es)`}
            </p>
          </div>
          <span className="rounded-md bg-accent-soft px-2 py-1 font-mono text-[11px] font-medium text-accent">
            max 10
          </span>
        </div>
      </div>

      <div className="space-y-3 px-5 py-4">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <Input
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            placeholder="Filter symbols…"
            className="pl-9"
            aria-label="Search watchlist"
          />
        </div>

        <form onSubmit={onAdd} className="flex gap-2">
          <Input
            value={symbolInput}
            onChange={(e) => onSymbolInputChange(e.target.value)}
            placeholder="RELIANCE or TCS.NS"
            className="font-mono text-[13px]"
            disabled={busy || watchlistCount >= 10}
            aria-label="NSE ticker symbol"
          />
          <Button
            type="submit"
            disabled={busy || watchlistCount >= 10 || !symbolInput.trim()}
          >
            {busy ? "…" : "Add"}
          </Button>
        </form>

        {watchlistCount >= 10 ? (
          <p className="text-xs text-danger" role="alert">
            Watchlist is full. Remove a ticker to add another.
          </p>
        ) : null}

        {!loading && items.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-faint">
            {debouncedQ
              ? "No matches for this search."
              : "No tickers yet. Add an NSE symbol."}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
              >
                <span className="font-mono text-sm font-medium tracking-wide text-ink">
                  {item.symbol}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  disabled={busy}
                  aria-label={`Remove ${item.symbol}`}
                  className="text-ink-faint hover:text-danger"
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={16}
                    strokeWidth={1.75}
                  />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1 || loading}
          onClick={onPrevPage}
        >
          Prev
        </Button>
        <span className="text-xs text-ink-muted">
          Page {page} / {pageCount}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pageCount || loading}
          onClick={onNextPage}
        >
          Next
        </Button>
      </div>
    </Surface>
  );
}
