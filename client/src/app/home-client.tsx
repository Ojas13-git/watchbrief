"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApiFetch } from "@/lib/use-api-fetch";
import { AppHeader } from "@/components/app/app-header";
import { WatchlistPanel } from "@/components/app/watchlist-panel";
import { GeneratePanel } from "@/components/app/generate-panel";
import type { WatchlistItem, WatchlistResponse } from "@/lib/types";

export function HomeClient() {
  const apiFetch = useApiFetch();

  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [symbolInput, setSymbolInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [briefText, setBriefText] = useState("");
  const [generating, setGenerating] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: debouncedQ,
        page: String(page),
        pageSize: String(pageSize),
      });
      const res = await apiFetch(`/api/watchlist?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          typeof body.error === "string" && body.error
            ? body.error
            : `Failed to load watchlist (status: ${res.status})`,
        );
      }
      const data = (await res.json()) as WatchlistResponse;
      setItems(data.items);
      setTotal(data.total);
      setPageCount(data.pageCount);
      setWatchlistCount(data.watchlistCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, debouncedQ, page, pageSize]);

  useEffect(() => {
    void load();
  }, [debouncedQ, page, pageSize]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch("/api/watchlist", {
        method: "POST",
        body: JSON.stringify({ symbol: symbolInput.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(
          typeof body.error === "string" && body.error
            ? body.error
            : `Failed to add watchlist (status: ${res.status})`,
        );
      }
      setSymbolInput("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add watchlist");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/watchlist/${id}`, { method: "DELETE" });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(
          typeof body.error === "string" && body.error
            ? body.error
            : `Failed to delete watchlist (status: ${res.status})`,
        );
      }
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete watchlist",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onGenerate() {
    if (generating || watchlistCount === 0) return;
    setGenerating(true);
    setError(null);
    setBriefText("");
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await apiFetch("/api/brief", {
        method: "POST",
        signal: ac.signal,
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          typeof body.error === "string" && body.error
            ? body.error
            : `Generate failed (status: ${res.status})`,
        );
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setBriefText((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Generating cancelled");
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to generate brief",
        );
      }
    } finally {
      abortRef.current = null;
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-full bg-paper">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="display text-3xl text-ink sm:text-4xl">
              Research desk
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Personal NSE watchlist briefs. Not investment advice.
            </p>
          </div>
          <Link
            href="/app/history"
            className="text-sm font-medium text-accent hover:text-accent-hover"
          >
            Open history →
          </Link>
        </div>

        {error ? (
          <div
            className="mb-6 rounded-[var(--radius-sm)] border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <WatchlistPanel
            q={q}
            onQChange={setQ}
            symbolInput={symbolInput}
            onSymbolInputChange={setSymbolInput}
            onAdd={onAdd}
            onDelete={onDelete}
            items={items}
            loading={loading}
            busy={busy}
            watchlistCount={watchlistCount}
            total={total}
            page={page}
            pageCount={pageCount}
            onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
            onNextPage={() => setPage((p) => p + 1)}
            debouncedQ={debouncedQ}
          />

          <GeneratePanel
            watchlistCount={watchlistCount}
            generating={generating}
            busy={busy}
            briefText={briefText}
            onGenerate={() => void onGenerate()}
            onAbort={() => abortRef.current?.abort()}
          />
        </div>
      </main>
    </div>
  );
}
