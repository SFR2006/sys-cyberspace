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

  const panel = el("div", { className: "border-2 border-paper-ink bg-paper-card/50 p-6 shadow-[8px_8px_0px_var(--shadow-md)] backdrop-blur sm:p-8" });
  const tabs = el("div", { className: "mb-6 flex flex-wrap justify-center gap-3" });

  const mounted = new Set<GameId>();

  function activate(id: GameId) {
    for (const btn of [...tabs.children] as HTMLButtonElement[]) {
      const isActive = btn.dataset.game === id;
      btn.classList.toggle("bg-paper-ink", isActive);
      btn.classList.toggle("text-paper-bg", isActive);
      btn.classList.toggle("border-paper-ink", isActive);
      btn.classList.toggle("bg-paper-card/60", !isActive);
      btn.classList.toggle("text-paper-ink-soft", !isActive);
      btn.classList.toggle("border-paper-ink/40", !isActive);
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
      className: "border-2 border-paper-ink/40 bg-paper-card/60 px-5 py-2.5 font-serif text-base italic text-paper-ink-soft shadow-[3px_3px_0px_var(--shadow-sm)] transition-all hover:-translate-y-0.5",
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
