import { el, required } from "../../lib/dom";
import { mountCipherTerminal } from "./cipher-terminal";
import { mountBreachCheck } from "./breach-check";
import { mountCaseFile } from "./case-file";

type GameId = "cipher" | "breach" | "case";

const GAMES: { id: GameId; label: string; mount: (el: HTMLElement) => void }[] = [
  { id: "cipher", label: "🔐 Cipher Terminal", mount: mountCipherTerminal },
  { id: "breach", label: "🔑 Breach Check", mount: mountBreachCheck },
  { id: "case", label: "🕵️ Case File", mount: mountCaseFile },
];

export function renderGames(): void {
  const root = required("#games-root");

  const panel = el("div", { className: "border border-cyber-border bg-cyber-panel/60 p-6 sm:p-8" });
  const tabs = el("div", { className: "flex flex-wrap gap-2" });

  const mounted = new Set<GameId>();

  function activate(id: GameId) {
    for (const btn of [...tabs.children] as HTMLButtonElement[]) {
      const isActive = btn.dataset.game === id;
      btn.classList.toggle("border-cyber-accent", isActive);
      btn.classList.toggle("text-cyber-accent", isActive);
      btn.classList.toggle("border-cyber-border", !isActive);
      btn.classList.toggle("text-cyber-text-dim", !isActive);
    }
    for (const game of GAMES) {
      const section = panel.querySelector<HTMLElement>(`[data-game-panel="${game.id}"]`);
      if (!section) continue;
      section.classList.toggle("hidden", game.id !== id);
      if (game.id === id && !mounted.has(id)) {
        game.mount(section);
        mounted.add(id);
      }
    }
  }

  for (const game of GAMES) {
    const btn = el("button", {
      className: "border border-cyber-border bg-cyber-bg2 px-4 py-2 text-sm font-medium text-cyber-text-dim transition hover:text-cyber-accent2",
      text: game.label,
      attrs: { type: "button", "data-game": game.id },
    });
    btn.addEventListener("click", () => activate(game.id));
    tabs.append(btn);

    panel.append(el("div", { attrs: { "data-game-panel": game.id }, className: "hidden pt-6" }));
  }

  root.replaceChildren(tabs, panel);
  activate("cipher");
}
