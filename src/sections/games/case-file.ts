import { el } from "../../lib/dom";
import { readJSON, writeJSON } from "../../lib/storage";
import { CASE_FILES } from "./case-file-data";
import type { CaseCategoryKey, CaseFile, CaseGuess } from "../../types/games";

const MAX_ATTEMPTS = 5;
const PLAYED_KEY = "case-file-played";
const STATS_KEY = "case-file-stats";

interface Stats {
  played: number;
  solved: number;
}

function pickCase(): CaseFile {
  const played = readJSON<string[]>(PLAYED_KEY, []);
  let pool = CASE_FILES.filter((c) => !played.includes(c.id));
  if (pool.length === 0) {
    writeJSON(PLAYED_KEY, []);
    pool = CASE_FILES;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function markPlayed(id: string) {
  const played = readJSON<string[]>(PLAYED_KEY, []);
  if (!played.includes(id)) writeJSON(PLAYED_KEY, [...played, id]);
}

function recordResult(solved: boolean) {
  const stats = readJSON<Stats>(STATS_KEY, { played: 0, solved: 0 });
  stats.played += 1;
  if (solved) stats.solved += 1;
  writeJSON(STATS_KEY, stats);
  return stats;
}

export function mountCaseFile(container: HTMLElement): void {
  const statsLine = el("p", { className: "font-serif italic text-paper-ink-soft" });

  function refreshStats() {
    const stats = readJSON<Stats>(STATS_KEY, { played: 0, solved: 0 });
    statsLine.textContent = `${stats.solved} solved / ${stats.played} played`;
  }

  const body = el("div", { className: "mt-6" });

  function startCase(caseFile: CaseFile) {
    const guesses: CaseGuess[] = [];
    let finished = false;
    let revealedEvidence = 1;

    const evidenceList = el("ul", { className: "list-disc space-y-1 pl-5 text-sm text-paper-ink" });
    const guessGrid = el("div", { className: "mt-4 space-y-2" });
    const attemptsLabel = el("p", { className: "mt-2 text-xs text-paper-ink-soft" });
    const resolutionBox = el("div", { className: "mt-4 hidden border-t border-paper-ink/20 pt-4" });

    const selects = caseFile.categories.map((cat) => {
      const options = [
        el("option", { text: `Select ${cat.label.toLowerCase()}...`, attrs: { value: "", disabled: true, selected: true } }),
        ...cat.options.map((opt) => el("option", { text: opt, attrs: { value: opt } })),
      ];
      const select = el("select", {
        className: "w-full border-2 border-paper-ink bg-paper-card/70 px-2 py-2 text-sm text-paper-ink focus:outline-none focus:ring-2 focus:ring-paper-ink",
        attrs: { "data-key": cat.key },
        children: options,
      }) as HTMLSelectElement;
      return { key: cat.key, select, label: cat.label };
    });

    const submitBtn = el("button", {
      className: "mt-3 bg-paper-ink px-4 py-2 font-serif italic text-paper-bg shadow-[3px_3px_0px_var(--shadow-sm)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40",
      text: "Submit Guess",
      attrs: { type: "button" },
    }) as HTMLButtonElement;

    const guessForm = el("div", {
      className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2",
      children: selects.map((s) => el("label", { className: "block text-xs uppercase tracking-wider text-paper-ink-soft", text: s.label, children: [s.select] })),
    });

    function renderEvidence() {
      evidenceList.replaceChildren(...caseFile.evidence.slice(0, revealedEvidence).map((e) => el("li", { text: e })));
    }

    function renderGuessGrid() {
      guessGrid.replaceChildren(
        ...guesses.map((guess) =>
          el("div", {
            className: "flex flex-wrap gap-2",
            children: caseFile.categories.map((cat) => {
              const isCorrect = guess.results[cat.key];
              return el("span", {
                className: `border-2 px-2 py-1 text-xs ${isCorrect ? "border-game-good bg-game-good/15 text-game-good" : "border-paper-ink/30 bg-paper-bg/40 text-paper-ink-soft"}`,
                text: `${isCorrect ? "✓" : "✗"} ${guess.values[cat.key]}`,
              });
            }),
          }),
        ),
      );
    }

    function shareGrid(): string {
      const rows = guesses
        .map((g) => caseFile.categories.map((c) => (g.results[c.key] ? "🟩" : "⬛")).join(""))
        .join("\n");
      return `Case File — "${caseFile.title}"\n${rows}\n${guesses.length}/${MAX_ATTEMPTS} attempts — Syberspace`;
    }

    function finish(solved: boolean) {
      finished = true;
      markPlayed(caseFile.id);
      recordResult(solved);
      refreshStats();
      revealedEvidence = caseFile.evidence.length;
      renderEvidence();

      guessForm.classList.add("hidden");
      submitBtn.classList.add("hidden");
      attemptsLabel.textContent = "";

      const shareBtn = el("button", {
        className: "border-2 border-paper-ink/30 px-3 py-1.5 text-xs text-paper-ink-soft transition hover:border-paper-ink hover:text-paper-ink",
        text: "Copy shareable result",
        attrs: { type: "button" },
      });
      const shareStatus = el("span", { className: "ml-3 text-xs text-game-good" });
      shareBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(shareGrid());
          shareStatus.textContent = "Copied!";
        } catch {
          shareStatus.textContent = "Couldn't copy — clipboard unavailable.";
        }
        setTimeout(() => (shareStatus.textContent = ""), 2500);
      });

      const nextBtn = el("button", {
        className: "bg-paper-ink px-4 py-2 font-serif italic text-paper-bg shadow-[3px_3px_0px_var(--shadow-sm)] transition hover:-translate-y-0.5",
        text: "Next Case",
        attrs: { type: "button" },
      });
      nextBtn.addEventListener("click", () => startCase(pickCase()));

      resolutionBox.classList.remove("hidden");
      resolutionBox.replaceChildren(
        el("p", { className: `mb-2 text-sm font-semibold ${solved ? "text-game-good" : "text-game-bad"}`, text: solved ? "✔ Case closed — you nailed it." : "✘ Case file closed — here's what really happened:" }),
        el("p", { className: "text-sm text-paper-ink", text: caseFile.resolution }),
        el("div", { className: "mt-4 flex flex-wrap items-center gap-3", children: [nextBtn, shareBtn, shareStatus] }),
      );
    }

    submitBtn.addEventListener("click", () => {
      if (finished) return;
      const values: Partial<Record<CaseCategoryKey, string>> = {};
      let allFilled = true;
      for (const { key, select } of selects) {
        if (!select.value) allFilled = false;
        values[key] = select.value;
      }
      if (!allFilled) {
        attemptsLabel.textContent = "Pick an answer for every category before submitting.";
        attemptsLabel.className = "mt-2 text-xs font-medium text-game-bad";
        return;
      }

      const results: Partial<Record<CaseCategoryKey, boolean>> = {};
      let allCorrect = true;
      for (const cat of caseFile.categories) {
        const correct = values[cat.key] === cat.answer;
        results[cat.key] = correct;
        if (!correct) allCorrect = false;
      }
      guesses.push({ values, results });
      renderGuessGrid();

      if (allCorrect) {
        finish(true);
        return;
      }

      if (guesses.length >= MAX_ATTEMPTS) {
        finish(false);
        return;
      }

      revealedEvidence = Math.min(caseFile.evidence.length, revealedEvidence + 1);
      renderEvidence();
      attemptsLabel.textContent = `${MAX_ATTEMPTS - guesses.length} attempt${MAX_ATTEMPTS - guesses.length === 1 ? "" : "s"} remaining.`;
      attemptsLabel.className = "mt-2 text-xs text-paper-ink-soft";
    });

    renderEvidence();
    attemptsLabel.textContent = `${MAX_ATTEMPTS} attempts available.`;

    body.replaceChildren(
      el("h4", { className: "font-serif text-lg italic", text: caseFile.title }),
      el("p", { className: "mt-1 text-sm text-paper-ink", text: caseFile.briefing }),
      el("p", { className: "mt-4 text-xs uppercase tracking-wider text-paper-ink-soft", text: "Evidence" }),
      evidenceList,
      guessGrid,
      guessForm,
      submitBtn,
      attemptsLabel,
      resolutionBox,
    );
  }

  refreshStats();
  container.replaceChildren(
    el("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [el("h3", { className: "font-serif text-xl italic", text: "Case File" }), statsLine] }),
    el("p", { className: "mt-2 text-sm text-paper-ink-soft", text: "Read the evidence, then submit a full guess: compromised asset, attack vector, threat actor, and motive. Green means correct, like a certain word game you might know." }),
    body,
  );

  startCase(pickCase());
}
