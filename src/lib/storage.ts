const isBrowser = () => typeof window !== "undefined";

export function safeGet(key: string): string | null {
  try {
    return isBrowser() ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    if (isBrowser()) window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode / sandboxed context) — non-fatal
  }
}

export function safeRemove(key: string): void {
  try {
    if (isBrowser()) window.localStorage.removeItem(key);
  } catch {
    // storage unavailable — non-fatal
  }
}

export function hasLoginCookie(): boolean {
  try {
    if (!isBrowser()) return false;
    return document.cookie
      .split("; ")
      .some(
        (c) =>
          c.startsWith("klaro_logged_in=") &&
          c.split("=").slice(1).join("=") === "true"
      );
  } catch {
    return false;
  }
}