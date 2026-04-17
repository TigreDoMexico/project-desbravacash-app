const TOKEN_KEY = "desbravacash_token";
const EXPIRY_KEY = "desbravacash_token_expiry";
const TTL_MS = 10 * 60 * 1000;

export const tokenCache = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!expiry || Date.now() > Number(expiry)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, String(Date.now() + TTL_MS));
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },
};
