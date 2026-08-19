/**
 * Typed, namespaced localStorage helpers.
 *
 * Everything this site stores locally is non-sensitive UI state (journey
 * post-its you typed yourself, game streaks/badges, which Case Files
 * you've already played). Nothing here is ever read by, or sent to, a
 * server — there is no server. Keys are namespaced under `sy-cyber:` so
 * this never collides with anything else on the same origin.
 */

const NAMESPACE = "sy-cyber";

function key(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export function readJSON<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // localStorage can throw (private browsing, quota, disabled) — never let
    // a storage failure break the actual feature the user is using.
  }
}
