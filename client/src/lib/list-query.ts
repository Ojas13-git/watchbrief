export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 20;

export type ListQuery = {
      q: string;
      page: number;
      pageSize: number;
      skip: number;
}

export function parseListQuery(url :URL): ListQuery {
      const q = url.searchParams.get("q")?.trim() ?? "";
      const pageRaw = Number(url.searchParams.get("page"));
      const sizeRaw = Number(url.searchParams.get("pageSize"));

      const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : DEFAULT_PAGE;
      const unbounded = Number.isFinite(sizeRaw) && sizeRaw >= 1 ? Math.floor(sizeRaw) : DEFAULT_PAGE_SIZE;
      const pageSize = Math.min(MAX_PAGE_SIZE, unbounded);
      const skip = (page - 1) * pageSize;

      return { q, page, pageSize, skip };
}

export function listMeta(page: number, pageSize: number, total: number){
      const pageCount = Math.max(1, Math.ceil(total/pageSize));
      return {page, pageSize, total, pageCount};
}