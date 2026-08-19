import { el } from "../../lib/dom";
import { readJSON, writeJSON } from "../../lib/storage";
import { CIPHER_PUZZLES } from "./cipher-data";
import type { CipherPuzzle } from "../../types/games";

const STORAGE_KEY = "cipher-terminal-solved";

function normalize(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, " ");
}

function typeLabel(type: CipherPuzzle["type"]): string {
  switch (type) {
    case "caesar":
      return "Caesar Shift";
    case "vigenere":
      return "Vigenère";
    case "xor":
      return "XOR (hex)";
  }
}

export function mountCipherTerminal(container: HTMLElement): void {
  let solved = new Set(readJSON<string[]>(STORAGE_KEY, []));

  const persist = () => writeJSON(STORAGE_KEY, [...solved]);

  const progressLabel = el("p", {
    className: "text-sm text-cyber-text-dim",
    text: `${solved.size} / ${CIPHER_PUZZLES.length} decoded`,
  });

  const list = el("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2" });
  const workspace = el("div", {
    className: "mt-6 min-h-[220px] border border-cyber-border bg-cyber-panel p-6",
  });

  function renderList() {
    list.replaceChildren(
      ...CIPHER_PUZZLES.map((puzzle) => {
        const isSolved = solved.has(puzzle.id);
        const btn = el("button", {
          className: `w-full border px-4 py-3 text-left transition ${
            isSolved
              ? "border-cyber-accent/60 bg-cyber-accent/10 text-cyber-accent"
              : "border-cyber-border bg-cyber-bg2 text-cyber-text hover:border-cyber-accent2 hover:text-cyber-accent2"
          }`,
          attrs: { type: "button" },
          children: [
            el("span", { className: "block text-xs uppercase tracking-wider text-cyber-text-dim", text: `${typeLabel(puzzle.type)} · difficulty ${puzzle.difficulty}` }),
            el("span", { className: "mt-1 block font-semibold", text: isSolved ? `✔ ${puzzle.id}` : `Puzzle ${puzzle.id}` }),
          ],
        });
        btn.addEventListener("click", () => openPuzzle(puzzle));
        return btn;
      }),
    );
  }

  function openPuzzle(puzzle: CipherPuzzle) {
    const isSolved = solved.has(puzzle.id);

    const input = el("input", {
      className: "w-full border border-cyber-border bg-cyber-bg px-3 py-2 font-mono text-cyber-text focus:border-cyber-accent focus:outline-none",
      attrs: { type: "text", placeholder: "Your decoded guess...", autocomplete: "off", spellcheck: false },
    }) as HTMLInputElement;

    const feedback = el("p", { className: "mt-3 text-sm" });
    const hintBox = el("p", { className: "mt-3 hidden text-sm text-cyber-warn" });
    const explainerBox = el("p", { className: "mt-4 hidden border-t border-cyber-border pt-4 text-sm text-cyber-text-dim" });

    const hintBtn = el("button", {
      className: "border border-cyber-border px-3 py-1.5 text-xs text-cyber-text-dim hover:border-cyber-warn hover:text-cyber-warn",
      text: "Show hint",
      attrs: { type: "button" },
    });
    hintBtn.addEventListener("click", () => {
      hintBox.textContent = `Hint: ${puzzle.hint}`;
      hintBox.classList.remove("hidden");
    });

    const submitBtn = el("button", {
      className: "bg-cyber-accent px-4 py-2 font-semibold text-cyber-bg hover:brightness-110",
      text: "Decode",
      attrs: { type: "submit" },
    });

    const form = el("form", { className: "mt-4 flex flex-wrap gap-3", children: [input, submitBtn, hintBtn] });

    const markSolved = () => {
      feedback.textContent = "✔ Correct — case decoded.";
      feedback.className = "mt-3 text-sm text-cyber-accent";
      explainerBox.textContent = puzzle.explainer;
      explainerBox.classList.remove("hidden");
      if (!solved.has(puzzle.id)) {
        solved.add(puzzle.id);
        persist();
        progressLabel.textContent = `${solved.size} / ${CIPHER_PUZZLES.length} decoded`;
        renderList();
      }
      input.disabled = true;
      submitBtn.disabled = true;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (normalize(input.value) === normalize(puzzle.answer)) {
        markSolved();
      } else {
        feedback.textContent = "✘ Not quite — try again, or grab a hint.";
        feedback.className = "mt-3 text-sm text-cyber-danger";
      }
    });

    if (isSolved) {
      explainerBox.textContent = puzzle.explainer;
      explainerBox.classList.remove("hidden");
    }

    workspace.replaceChildren(
      el("p", { className: "text-xs uppercase tracking-wider text-cyber-text-dim", text: `${typeLabel(puzzle.type)} · difficulty ${puzzle.difficulty}` }),
      el("p", { className: "mt-2 break-all font-mono text-lg text-cyber-accent2", text: puzzle.ciphertext }),
      isSolved
        ? el("p", { className: "mt-4 text-sm text-cyber-accent", text: `✔ Already decoded: ${puzzle.answer}` })
        : form,
      feedback,
      hintBox,
      explainerBox,
    );
  }

  renderList();
  container.replaceChildren(
    el("div", { className: "flex items-center justify-between gap-4", children: [el("h3", { className: "text-lg font-semibold text-cyber-accent", text: "Cipher Terminal" }), progressLabel] }),
    el("p", { className: "mt-2 text-sm text-cyber-text-dim", text: "Pick a case, decode the ciphertext, and see how the cipher actually works." }),
    list,
    workspace,
  );
}
