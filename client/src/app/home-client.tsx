"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApiFetch } from "@/lib/use-api-fetch";
import { BriefMarkdown } from "@/components/brief-markdown";

type WatchlistItem = {
  id: string;
  userId: string;
  symbol: string;
  createdAt: string;
};

type WatchlistResponse = {
  items: WatchlistItem[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  watchlistCount: number;
};

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

    return () => {
      clearTimeout(t);
    };
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
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load watchlist",
      );
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
      const res = await apiFetch(`/api/watchlist/${id}`, {
        method: "DELETE",
      });
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

      if(!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while(true){
        const {done, value} = await reader.read();
        if(done) break;
        const chunk = decoder.decode(value, {stream: true});
        setBriefText((prev)=> prev + chunk);
      }
    } catch (err) {
      if(err instanceof DOMException && err.name === "AbortError"){
        setError("Generating cancelled");
      }
      else{
        setError(err instanceof Error ? err.message : "Failed to generate brief");
      }
    } finally {
      abortRef.current = null;
      setGenerating(false);
    }
  }

  function onAbortGenerate(){
    abortRef.current?.abort();
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">WatchBrief</h1>
        <p className="mt-1 text-sm opacity-70">
          Personal NSE watchlist. Not investment advice.
        </p>
      </header>
      <label className="flex flex-col gap-1 text-sm">
        <span className="opacity-70">Search</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter symbols…"
          className="rounded border px-3 py-2 text-sm"
        />
      </label>
      {!loading && items.length === 0 ? (
        <p className="text-sm opacity-60">
          {debouncedQ
            ? "No matches for this search."
            : "No tickers yet. Add an NSE symbol."}
        </p>
      ) : null}
      <form onSubmit={onAdd} className="flex gap-2">
        <input
          type="text"
          value={symbolInput}
          onChange={(e) => setSymbolInput(e.target.value)}
          placeholder="e.g. RELIANCE or TCS.NS"
          className="min-w-0 flex-1 rounded border px-3 py-2 font-mono text-sm"
          disabled={busy || watchlistCount >= 10}
          aria-label="NSE ticker symbol"
        />

        <button
          type="submit"
          disabled={busy || watchlistCount >= 10 || !symbolInput.trim()}
          aria-label="Add to watchlist"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </form>
      {watchlistCount >= 10 ? (
        <p className="text-sm text-red-600" role="alert">
          Watchlist limit is 10 tickers. Remove some to add more.
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-sm opacity-60">
        {loading
          ? "Loading…"
          : `${watchlistCount} ticker(s) · showing ${total} match(es)`}
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 border-b py-2"
          >
            <span className="font-mono text-sm">{item.symbol}</span>
            <button
              onClick={() => onDelete(item.id)}
              disabled={busy}
              aria-label="Delete from watchlist"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={(p) => setPage(Math.max(1, page - 1))}
          disabled={page <= 1 || loading}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="opacity-70">
          Page {page} of {pageCount}
        </span>

        <button
          type="button"
          disabled={page >= pageCount || loading}
          onClick={() => setPage((p) => p + 1)}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <section className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={generating || watchlistCount === 0 || busy}
            onClick={()=> void onGenerate()}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            {generating ? "Generating…" : "Generate Brief"}
          </button>
          <button
            type="button"
            disabled={!generating}
            onClick={onAbortGenerate}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Stop
          </button>
        </div>
        {watchlistCount === 0 ? (
          <p className="text-xs opacity-70">Add at least one ticker to generate.</p> 
        ): 
        (
          <p className="text-xs opacity-70">
            Uses your full watchlist ({watchlistCount}), not the current search page.
          </p>
        )}

        {briefText? (
        <BriefMarkdown text={briefText} />
        ): null}
      </section>
    </main>
  );
}
