import { isValidSymbol, normalizeSymbol } from "./symbols.js";

export type YahooQuote = {
  symbol?: string;
  shortname?: string;
  longname?: string;
  quoteType?: string;
  exchange?: string;
  exchDisp?: string;
};

export type SymbolSearchResult = {
  symbol: string;
  name: string;
};

const YAHOO_SEARCH = "https://query1.finance.yahoo.com/v1/finance/search";

function isNseQuote(q: YahooQuote): boolean {
  const sym = (q.symbol ?? "").toUpperCase();
  if (sym.endsWith(".BO")) return false;
  if (sym.endsWith(".NS")) return true;

  const ex = `${q.exchange ?? ""} ${q.exchDisp ?? ""}`.toUpperCase();
  return ex.includes("NSE") || ex.includes("NSI");
}

export function toNseResults(quotes: YahooQuote[]): SymbolSearchResult[] {
  const out: SymbolSearchResult[] = [];
  const seen = new Set<string>();

  for (const q of quotes) {
    if (q.quoteType && q.quoteType !== "EQUITY") continue;
    if (!isNseQuote(q)) continue;

    const symbol = normalizeSymbol(q.symbol ?? "");
    if (!isValidSymbol(symbol) || seen.has(symbol)) continue;

    const name = (q.shortname ?? q.longname ?? symbol).trim() || symbol;

    seen.add(symbol);
    out.push({ symbol, name });
    if (out.length >= 8) break;
  }

  return out;
}

export async function fetchYahooQuotes(q: string): Promise<YahooQuote[]> {
  const url = new URL(YAHOO_SEARCH);
  url.searchParams.set("q", q);
  url.searchParams.set("quotesCount", "8");
  url.searchParams.set("newsCount", "0");
  url.searchParams.set("listsCount", "0");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; WatchBrief/0.1)",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    throw new Error(`Yahoo search failed (${res.status})`);
  }

  const body = (await res.json()) as { quotes?: unknown };
  if (!Array.isArray(body.quotes)) return [];
  return body.quotes as YahooQuote[];
}

export async function searchNseSymbols(
  q: string,
): Promise<SymbolSearchResult[]> {
  const quotes = await fetchYahooQuotes(q);
  return toNseResults(quotes);
}
