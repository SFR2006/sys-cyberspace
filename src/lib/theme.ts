import { el } from "./dom";
import { readJSON, writeJSON } from "./storage";

const LIGHT_MODE_KEY = "syberspace-light-mode";

let lightMode = readJSON<boolean>(LIGHT_MODE_KEY, false);
let inCyberspace = false;

function applyDark(isDark: boolean): void {
  document.documentElement.classList.toggle("dark", isDark);
}

function currentlyDark(): boolean {
  return inCyberspace && !lightMode;
}

/** Call whenever the page's "active section" changes (see nav.ts). Syberspace
 * is dark by default; the reader can flip it to light with the toggle below,
 * but the rest of the site is never affected either way. */
export function setActiveSection(id: string): void {
  inCyberspace = id === "cyberspace";
  applyDark(currentlyDark());
}

function setLightMode(next: boolean): void {
  lightMode = next;
  writeJSON(LIGHT_MODE_KEY, lightMode);
  applyDark(currentlyDark());
}

export function initTheme(): void {
  applyDark(currentlyDark());
}

/** Renders the light/dark toggle used inside Syberspace. */
export function renderDarkModeToggle(): HTMLElement {
  const knob = el("span", {
    className: `absolute top-0.5 h-5 w-5 rounded-full bg-paper-bg shadow transition-all duration-200 ${lightMode ? "left-[1.625rem]" : "left-0.5"}`,
  });

  const track = el("span", {
    className: `relative inline-flex h-6 w-12 items-center rounded-full border-2 border-paper-ink transition-colors duration-200 ${lightMode ? "bg-paper-ink" : "bg-paper-card/60"}`,
    children: [knob],
  });

  const label = el("span", { className: "text-sm text-paper-ink-soft", text: lightMode ? "Light mode" : "Switch to light mode?" });

  const button = el("button", {
    className: "inline-flex items-center gap-3",
    attrs: { type: "button", role: "switch", "aria-checked": String(lightMode) },
    children: [track, label],
  });

  button.addEventListener("click", () => {
    setLightMode(!lightMode);
    button.setAttribute("aria-checked", String(lightMode));
    label.textContent = lightMode ? "Light mode" : "Switch to light mode?";
    track.className = `relative inline-flex h-6 w-12 items-center rounded-full border-2 border-paper-ink transition-colors duration-200 ${lightMode ? "bg-paper-ink" : "bg-paper-card/60"}`;
    knob.className = `absolute top-0.5 h-5 w-5 rounded-full bg-paper-bg shadow transition-all duration-200 ${lightMode ? "left-[1.625rem]" : "left-0.5"}`;
  });

  return button;
}
