export type WatchlistItem = {
  id: string;
  userId: string;
  symbol: string;
  createdAt: string;
};

export type WatchlistResponse = {
  items: WatchlistItem[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  watchlistCount: number;
};

export type BriefRow = {
  id: string;
  userId: string;
  symbols: string;
  content: string;
  model: string;
  createdAt: string;
};

export type BriefsResponse = {
  briefs: BriefRow[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
