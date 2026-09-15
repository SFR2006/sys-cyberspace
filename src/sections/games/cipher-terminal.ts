import { el } from "../../lib/dom";
import { cyberChefUrl } from "../../lib/cyberchef";
import { CIPHER_PUZZLES } from "./cipher-data";
import type { CipherPuzzle } from "../../types/games";

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

/** How to recognize this cipher family from the ciphertext alone, contrasted
 * against other encodings a learner might confuse it with. Shown alongside
 * the puzzle-specific hint, not just how to crack this one instance. */
function identifyTip(type: CipherPuzzle["type"]): string {
  switch (type) {
    case "caesar":
      return "Spot the type: plain uppercase letters only, same word lengths and spacing as English — the sign of a shift/substitution cipher. Base64 would mix case and digits (often padded with '='); hex would show only 0–9 and a–f.";
    case "vigenere":
      return "Spot the type: letters-only, like a Caesar shift, but no single shift decodes the whole thing — that resistance to one fixed shift means a repeating keyword is involved, as in Vigenère. (A rail fence cipher, by contrast, just reorders the same letters, so the letter frequencies would still look exactly like English.)";
    case "xor":
      return "Spot the type: space-separated two-character pairs using only 0–9 and a–f — that's hex-encoded bytes. If those bytes don't spell out ASCII text directly, they've likely been XORed with a key first.";
  }
}

export function mountCipherTerminal(container: HTMLElement): void {
  // In-memory only, deliberately not persisted — every page load starts the
  // games fresh instead of resuming a previous session's progress.
  let solved = new Set<string>();

  const progressLabel = el("p", {
    className: "font-serif italic text-paper-ink-soft",
    text: `${solved.size} / ${CIPHER_PUZZLES.length} decoded`,
  });

  const list = el("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2" });
  const workspace = el("div", {
    className: "mt-6 hidden min-h-[220px] border-2 border-paper-ink/30 bg-paper-bg/40 p-6",
  });

  function renderList() {
    list.replaceChildren(
      ...CIPHER_PUZZLES.map((puzzle) => {
        const isSolved = solved.has(puzzle.id);
        const btn = el("button", {
          className: `w-full border-2 px-4 py-3 text-left transition ${
            isSolved
              ? "border-game-good bg-game-good/10 text-game-good"
              : "border-paper-ink/30 bg-paper-card/40 text-paper-ink hover:border-paper-ink hover:-translate-y-0.5"
          }`,
          attrs: { type: "button" },
          children: [
            el("span", { className: "block text-xs uppercase tracking-wider text-paper-ink-soft", text: `${typeLabel(puzzle.type)} · difficulty ${puzzle.difficulty}` }),
            el("span", { className: "mt-1 block font-serif text-lg", text: isSolved ? `✔ ${puzzle.id}` : `Puzzle ${puzzle.id}` }),
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
      className: "w-full border-2 border-paper-ink bg-paper-card/70 px-3 py-2 font-sans text-paper-ink focus:outline-none focus:ring-2 focus:ring-paper-ink",
      attrs: { type: "text", placeholder: "Your decoded guess...", autocomplete: "off" },
    }) as HTMLInputElement;
    input.spellcheck = false; // enumerated attribute — see hero-doodles.ts for why this can't go through attrs

    const feedback = el("p", { className: "mt-3 text-sm" });
    const idTip = el("p", { className: "text-sm italic text-game-warn" });
    const decodeHint = el("p", { className: "mt-1 text-sm italic text-game-warn" });
    const hintBox = el("div", { className: "mt-3 hidden", children: [idTip, decodeHint] });
    const explainerBox = el("p", { className: "mt-4 hidden border-t border-paper-ink/20 pt-4 text-sm text-paper-ink-soft" });

    const hintBtn = el("button", {
      className: "border-2 border-paper-ink/30 px-3 py-1.5 text-xs text-paper-ink-soft transition hover:border-game-warn hover:text-game-warn",
      text: "Show hint",
      attrs: { type: "button" },
    });
    hintBtn.addEventListener("click", () => {
      idTip.textContent = identifyTip(puzzle.type);
      decodeHint.textContent = `Hint: ${puzzle.hint}`;
      hintBox.classList.remove("hidden");
    });

    const submitBtn = el("button", {
      className: "bg-paper-ink px-4 py-2 font-serif italic text-paper-bg shadow-[3px_3px_0px_var(--shadow-sm)] transition hover:-translate-y-0.5",
      text: "Decode",
      attrs: { type: "submit" },
    });

    const cyberChefLink = el("a", {
      className: "self-center border-2 border-paper-ink/30 px-3 py-1.5 text-xs text-paper-ink-soft transition hover:border-paper-ink hover:text-paper-ink",
      text: "Open in CyberChef ↗",
      attrs: { href: cyberChefUrl(puzzle.ciphertext), target: "_blank", rel: "noopener noreferrer" },
    });

    const form = el("form", { className: "mt-4 flex flex-wrap gap-3", children: [input, submitBtn, hintBtn, cyberChefLink] });

    const markSolved = () => {
      feedback.textContent = "✔ Correct — case decoded.";
      feedback.className = "mt-3 text-sm font-medium text-game-good";
      explainerBox.textContent = puzzle.explainer;
      explainerBox.classList.remove("hidden");
      if (!solved.has(puzzle.id)) {
        solved.add(puzzle.id);
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
        feedback.className = "mt-3 text-sm font-medium text-game-bad";
      }
    });

    if (isSolved) {
      explainerBox.textContent = puzzle.explainer;
      explainerBox.classList.remove("hidden");
    }

    workspace.classList.remove("hidden");
    workspace.replaceChildren(
      el("p", { className: "text-xs uppercase tracking-wider text-paper-ink-soft", text: `${typeLabel(puzzle.type)} · difficulty ${puzzle.difficulty}` }),
      el("p", { className: "mt-2 break-all border-2 border-dashed border-paper-ink/40 bg-paper-card/60 p-3 font-mono text-lg text-paper-ink", text: puzzle.ciphertext }),
      isSolved
        ? el("p", { className: "mt-4 text-sm font-medium text-game-good", text: `✔ Already decoded: ${puzzle.answer}` })
        : form,
      feedback,
      hintBox,
      explainerBox,
    );
  }

  renderList();
  container.replaceChildren(
    el("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [el("h3", { className: "font-serif text-xl italic", text: "Cipher Terminal" }), progressLabel] }),
    el("p", { className: "mt-2 text-sm text-paper-ink-soft", text: "Pick a case, decode the ciphertext, and see how the cipher actually works." }),
    el("div", { className: "mt-6", children: [list] }),
    workspace,
  );
}
