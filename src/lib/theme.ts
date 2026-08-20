import { el } from "./dom";
import { readJSON, writeJSON } from "./storage";

const PIN_KEY = "stay-dark-mode";

let pinned = readJSON<boolean>(PIN_KEY, false);
let inCyberspace = false;

function applyDark(isDark: boolean): void {
  document.documentElement.classList.toggle("dark", isDark);
}

/** Call whenever the page's "active section" changes (see nav.ts). Dark
 * mode automatically follows Syberspace — unless the reader has pinned
 * it on, in which case it stays dark everywhere. */
export function setActiveSection(id: string): void {
  inCyberspace = id === "cyberspace";
  if (!pinned) applyDark(inCyberspace);
}

function setPinned(next: boolean): void {
  pinned = next;
  writeJSON(PIN_KEY, pinned);
  applyDark(pinned ? true : inCyberspace);
}

export function initTheme(): void {
  applyDark(pinned ? true : inCyberspace);
}

/** Renders the "stay in dark mode" toggle switch used inside Syberspace. */
export function renderDarkModeToggle(): HTMLElement {
  const knob = el("span", {
    className: `absolute top-0.5 h-5 w-5 rounded-full bg-paper-bg shadow transition-all duration-200 ${pinned ? "left-[1.625rem]" : "left-0.5"}`,
  });

  const track = el("span", {
    className: `relative inline-flex h-6 w-12 items-center rounded-full border-2 border-paper-ink transition-colors duration-200 ${pinned ? "bg-paper-ink" : "bg-paper-card/60"}`,
    children: [knob],
  });

  const label = el("span", { className: "text-sm text-paper-ink-soft", text: pinned ? "Staying in dark mode" : "Stay in dark mode?" });

  const button = el("button", {
    className: "inline-flex items-center gap-3",
    attrs: { type: "button", role: "switch", "aria-checked": String(pinned) },
    children: [track, label],
  });

  button.addEventListener("click", () => {
    setPinned(!pinned);
    button.setAttribute("aria-checked", String(pinned));
    label.textContent = pinned ? "Staying in dark mode" : "Stay in dark mode?";
    track.className = `relative inline-flex h-6 w-12 items-center rounded-full border-2 border-paper-ink transition-colors duration-200 ${pinned ? "bg-paper-ink" : "bg-paper-card/60"}`;
    knob.className = `absolute top-0.5 h-5 w-5 rounded-full bg-paper-bg shadow transition-all duration-200 ${pinned ? "left-[1.625rem]" : "left-0.5"}`;
  });

  return button;
}
