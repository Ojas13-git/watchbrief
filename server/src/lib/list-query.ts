export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 20;

export type ListQuery = {
  q: string;
  page: number;
  pageSize: number;
  skip: number;
};

export function parseListQuery(
  input: URL | URLSearchParams | Record<string, unknown>,
): ListQuery {
  const params =
    input instanceof URL
      ? input.searchParams
      : input instanceof URLSearchParams
        ? input
        : new URLSearchParams(
            Object.entries(input).flatMap(([key, value]) => {
              if (value == null) return [];
              if (Array.isArray(value)) {
                return value.map((v) => [key, String(v)] as [string, string]);
              }
              return [[key, String(value)] as [string, string]];
            }),
          );

  const q = params.get("q")?.trim() ?? "";
  const pageRaw = Number(params.get("page"));
  const sizeRaw = Number(params.get("pageSize"));

  const page =
    Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : DEFAULT_PAGE;
  const unbounded =
    Number.isFinite(sizeRaw) && sizeRaw >= 1
      ? Math.floor(sizeRaw)
      : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(MAX_PAGE_SIZE, unbounded);
  const skip = (page - 1) * pageSize;

  return { q, page, pageSize, skip };
}

export function listMeta(page: number, pageSize: number, total: number) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return { page, pageSize, total, pageCount };
}
