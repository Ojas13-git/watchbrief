const SYMBOL_RE = /^[A-Z0-9][A-Z0-9&-]{0,19}$/;

export function normalizeSymbol(input: string): string {
      return input.toUpperCase().trim().replace(/\.NS$/i, "");
}

export function isValidSymbol(symbol: string): boolean {
      return SYMBOL_RE.test(symbol);
}