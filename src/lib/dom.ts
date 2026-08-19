/**
 * Small, safe DOM helpers used across every section/game.
 *
 * The rule enforced everywhere in this codebase: user-provided or
 * dynamically-built strings are placed via `textContent`, never via
 * `innerHTML`. That makes stored-XSS structurally impossible — there is
 * simply no code path that turns a string into parsed HTML/JS.
 */

type Attrs = Record<string, string | number | boolean | undefined>;

/** Create an element, optionally with attributes, class names, and children. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  opts: {
    className?: string;
    text?: string;
    attrs?: Attrs;
    children?: (Node | string)[];
  } = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (opts.className) node.className = opts.className;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.attrs) {
    for (const [key, value] of Object.entries(opts.attrs)) {
      if (value === undefined || value === false) continue;
      node.setAttribute(key, value === true ? "" : String(value));
    }
  }
  if (opts.children) {
    for (const child of opts.children) {
      node.append(typeof child === "string" ? document.createTextNode(child) : child);
    }
  }
  return node;
}

/** Query a required element and throw a clear error if it's missing (fail fast in dev). */
export function required<T extends Element = Element>(selector: string, root: ParentNode = document): T {
  const found = root.querySelector<T>(selector);
  if (!found) throw new Error(`Expected element not found: ${selector}`);
  return found;
}

/** Clamp a number into [min, max], returning `fallback` if the input isn't a finite number. */
export function clamp(value: number, min: number, max: number, fallback = min): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
