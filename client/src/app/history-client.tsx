"use client";

import { useCallback, useEffect, useState } from "react";
import { useApiFetch } from "@/lib/use-api-fetch";
import { AppHeader } from "@/components/app/app-header";
import { HistoryPanel } from "@/components/app/history-panel";
import type { BriefRow, BriefsResponse } from "@/lib/types";

export function HistoryClient() {
  const apiFetch = useApiFetch();

  const [historyQ, setHistoryQ] = useState("");
  const [debouncedHistoryQ, setDebouncedHistoryQ] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [brief, setBrief] = useState<BriefRow | null>(null);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPageCount, setHistoryPageCount] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedHistoryQ(historyQ.trim());
      setHistoryPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [historyQ]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: debouncedHistoryQ,
        page: String(historyPage),
        pageSize: "1",
      });
      const res = await apiFetch(`/api/briefs?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          typeof body.error === "string" && body.error
            ? body.error
            : `Failed to load briefs (status: ${res.status})`,
        );
      }
      const data = (await res.json()) as BriefsResponse;
      setBrief(data.briefs[0] ?? null);
      setHistoryTotal(data.total);
      setHistoryPageCount(Math.max(1, data.pageCount));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load briefs");
      setBrief(null);
    } finally {
      setHistoryLoading(false);
    }
  }, [apiFetch, debouncedHistoryQ, historyPage]);

  useEffect(() => {
    void loadHistory();
  }, [debouncedHistoryQ, historyPage]);

  return (
    <div className="min-h-full bg-paper">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 max-w-xl">
          <h1 className="display text-3xl text-ink sm:text-4xl">History</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            One brief at a time. Use Previous / Next to move through saved
            research.
          </p>
        </div>

        {error ? (
          <div
            className="mb-6 rounded-[var(--radius-sm)] border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <HistoryPanel
          historyQ={historyQ}
          onHistoryQChange={setHistoryQ}
          brief={brief}
          historyLoading={historyLoading}
          historyTotal={historyTotal}
          historyPage={historyPage}
          historyPageCount={historyPageCount}
          debouncedHistoryQ={debouncedHistoryQ}
          onPrev={() => setHistoryPage((p) => Math.max(1, p - 1))}
          onNext={() => setHistoryPage((p) => p + 1)}
        />
      </main>
    </div>
  );
}
