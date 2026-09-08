import { el } from "../../lib/dom";
import { cyberChefUrl } from "../../lib/cyberchef";
import { MYSTERY_CASE, AVATARS } from "./mystery-data";
import type { ChatMessage, MysteryChapter } from "../../types/games";

function normalize(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, " ");
}

/** A small line-art ghost mark for the anonymous stalker persona's avatar — keeps the
 * same stroke-based icon language as the rest of the site instead of an illustrated face. */
function ghostIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "h-5 w-5");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M5 20V11a7 7 0 0 1 14 0v9l-2.3-1.8L14.5 20l-2.5-1.8L9.5 20l-2.2-1.8Z");
  const eye1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  eye1.setAttribute("cx", "9.5");
  eye1.setAttribute("cy", "11");
  eye1.setAttribute("r", "0.6");
  eye1.setAttribute("fill", "currentColor");
  const eye2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  eye2.setAttribute("cx", "14.5");
  eye2.setAttribute("cy", "11");
  eye2.setAttribute("r", "0.6");
  eye2.setAttribute("fill", "currentColor");
  svg.append(path, eye1, eye2);
  return svg;
}

function intensityClasses(intensity: 1 | 2 | 3 | 4 = 1): string {
  switch (intensity) {
    case 1:
      return "border-game-warn/40 bg-game-warn/10 text-paper-ink";
    case 2:
      return "border-game-warn/60 bg-game-warn/20 text-paper-ink";
    case 3:
      return "border-game-bad/50 bg-game-bad/15 text-paper-ink";
    case 4:
      return "border-game-bad bg-game-bad/25 font-medium text-paper-ink";
  }
}

function renderMessage(msg: ChatMessage): HTMLElement {
  const photo = msg.avatarKey ? AVATARS[msg.avatarKey] : undefined;
  const avatar = photo
    ? el("img", { className: "h-8 w-8 shrink-0 rounded-full border-2 border-paper-ink object-cover", attrs: { src: photo, alt: msg.sender } })
    : msg.anonymous
      ? el("span", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-game-bad/60 bg-paper-bg/60 text-game-bad", children: [ghostIcon()] })
      : el("span", {
          className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-paper-ink bg-paper-card/70 font-serif text-sm italic",
          text: msg.sender.charAt(0).toUpperCase(),
        });

  const bubble = el("div", {
    className: `border-2 px-3 py-2 text-sm ${msg.anonymous ? intensityClasses(msg.intensity) : "border-paper-ink/30 bg-paper-card/50 text-paper-ink"}`,
    children: [el("p", { className: "mb-0.5 text-xs font-semibold uppercase tracking-wider text-paper-ink-soft", text: msg.sender }), el("p", { text: msg.text })],
  });

  return el("div", { className: "flex items-start gap-2.5", children: [avatar, bubble] });
}

export function mountMystery(container: HTMLElement): void {
  const mysteryCase = MYSTERY_CASE;
  // In-memory only, deliberately not persisted — every page load starts the
  // case fresh instead of resuming a previous session's progress.
  let solvedChapters = new Set<string>();
  let finaleSolved = false;
  let activeId: string = mysteryCase.chapters[0].id;

  const tabsRow = el("div", { className: "mb-6 flex flex-wrap gap-2" });
  const clueBox = el("div", { className: "mb-6 border-2 border-paper-ink/20 bg-paper-bg/40 p-4" });
  const body = el("div", {});

  function chapterUnlocked(chapter: MysteryChapter): boolean {
    if (chapter.number === 1) return true;
    const prev = mysteryCase.chapters.find((c) => c.number === chapter.number - 1);
    return prev !== undefined && solvedChapters.has(prev.id);
  }

  function allChaptersSolved(): boolean {
    return mysteryCase.chapters.every((c) => solvedChapters.has(c.id));
  }

  function renderClues() {
    const gathered = mysteryCase.chapters.filter((c) => solvedChapters.has(c.id));
    clueBox.replaceChildren(
      el("p", { className: "mb-2 text-xs uppercase tracking-wider text-paper-ink-soft", text: "Clues gathered" }),
      gathered.length === 0
        ? el("p", { className: "text-sm italic text-paper-ink-soft", text: "Solve a chapter to start building the case." })
        : el("ul", { className: "list-disc space-y-1 pl-5 text-sm text-paper-ink", children: gathered.map((c) => el("li", { text: c.clue })) }),
    );
  }

  function renderTabs() {
    const items: { id: string; label: string; unlocked: boolean; solved: boolean }[] = mysteryCase.chapters.map((c) => ({
      id: c.id,
      label: `${c.number}. ${c.title}`,
      unlocked: chapterUnlocked(c),
      solved: solvedChapters.has(c.id),
    }));
    items.push({ id: "finale", label: "🔎 Finale", unlocked: allChaptersSolved(), solved: finaleSolved });

    tabsRow.replaceChildren(
      ...items.map((item) => {
        const isActive = item.id === activeId;
        const btn = el("button", {
          className: `border-2 px-3 py-1.5 text-xs transition ${
            isActive
              ? "border-paper-ink bg-paper-ink text-paper-bg"
              : item.unlocked
                ? "border-paper-ink/40 bg-paper-card/60 text-paper-ink-soft hover:border-paper-ink hover:text-paper-ink"
                : "cursor-not-allowed border-paper-ink/15 bg-paper-bg/40 text-paper-ink-soft/50"
          }`,
          text: `${item.solved ? "✔ " : item.unlocked ? "" : "🔒 "}${item.label}`,
          attrs: { type: "button", disabled: !item.unlocked },
        });
        if (item.unlocked) {
          btn.addEventListener("click", () => {
            activeId = item.id;
            render();
          });
        }
        return btn;
      }),
    );
  }

  function renderChapter(chapter: MysteryChapter) {
    const alreadySolved = solvedChapters.has(chapter.id);
    let choiceCorrect = alreadySolved;
    let challengeCorrect = alreadySolved;

    const choiceFeedback = el("p", { className: "mt-2 text-xs" });
    const select = el("select", {
      className: "w-full border-2 border-paper-ink bg-paper-card/70 px-2 py-2 text-sm text-paper-ink focus:outline-none focus:ring-2 focus:ring-paper-ink",
      children: [
        el("option", { text: "Select an answer...", attrs: { value: "", disabled: true, selected: true } }),
        ...chapter.choice.options.map((opt) => el("option", { text: opt, attrs: { value: opt } })),
      ],
    }) as HTMLSelectElement;
    const choiceBtn = el("button", {
      className: "mt-2 border-2 border-paper-ink px-3 py-1.5 text-xs transition hover:-translate-y-0.5",
      text: "Submit",
      attrs: { type: "button" },
    });

    const challengeInput = el("input", {
      className: "w-full border-2 border-paper-ink bg-paper-card/70 px-3 py-2 font-sans text-paper-ink focus:outline-none focus:ring-2 focus:ring-paper-ink",
      attrs: { type: "text", placeholder: "Decoded flag, e.g. SYBER{...}", autocomplete: "off" },
    }) as HTMLInputElement;
    challengeInput.spellcheck = false;
    const challengeFeedback = el("p", { className: "mt-2 text-xs" });
    const hintBox = el("p", { className: "mt-2 hidden text-xs italic text-game-warn" });
    const explainerBox = el("p", { className: "mt-3 hidden border-t border-paper-ink/20 pt-3 text-xs text-paper-ink-soft" });
    const hintBtn = el("button", {
      className: "mt-2 mr-2 border-2 border-paper-ink/30 px-3 py-1.5 text-xs text-paper-ink-soft transition hover:border-game-warn hover:text-game-warn",
      text: "Show hint",
      attrs: { type: "button" },
    });
    const challengeBtn = el("button", {
      className: "mt-2 border-2 border-paper-ink px-3 py-1.5 text-xs transition hover:-translate-y-0.5",
      text: "Decode",
      attrs: { type: "button" },
    });
    const cyberChefLink = el("a", {
      className: "mt-2 ml-2 border-2 border-paper-ink/30 px-3 py-1.5 text-xs text-paper-ink-soft transition hover:border-paper-ink hover:text-paper-ink",
      text: "Open in CyberChef ↗",
      attrs: { href: cyberChefUrl(chapter.challenge.data), target: "_blank", rel: "noopener noreferrer" },
    });

    const clueReveal = el("div", { className: "mt-4 hidden border-2 border-game-good/50 bg-game-good/10 p-3 text-sm text-game-good" });

    function checkSolved() {
      if (choiceCorrect && challengeCorrect && !solvedChapters.has(chapter.id)) {
        solvedChapters.add(chapter.id);
        clueReveal.textContent = `🔓 Clue unlocked: ${chapter.clue}`;
        clueReveal.classList.remove("hidden");
        renderTabs();
        renderClues();
      }
    }

    if (alreadySolved) {
      select.value = chapter.choice.answer;
      select.disabled = true;
      choiceBtn.disabled = true;
      choiceFeedback.textContent = "✔ Correct";
      choiceFeedback.className = "mt-2 text-xs font-medium text-game-good";
      challengeInput.value = chapter.challenge.answer;
      challengeInput.disabled = true;
      challengeBtn.disabled = true;
      challengeFeedback.textContent = "✔ Decoded";
      challengeFeedback.className = "mt-2 text-xs font-medium text-game-good";
      explainerBox.textContent = chapter.challenge.explainer;
      explainerBox.classList.remove("hidden");
      clueReveal.textContent = `🔓 Clue: ${chapter.clue}`;
      clueReveal.classList.remove("hidden");
    } else {
      choiceBtn.addEventListener("click", () => {
        if (!select.value) {
          choiceFeedback.textContent = "Pick an answer first.";
          choiceFeedback.className = "mt-2 text-xs font-medium text-game-bad";
          return;
        }
        if (select.value === chapter.choice.answer) {
          choiceCorrect = true;
          select.disabled = true;
          choiceBtn.disabled = true;
          choiceFeedback.textContent = "✔ Correct";
          choiceFeedback.className = "mt-2 text-xs font-medium text-game-good";
          checkSolved();
        } else {
          choiceFeedback.textContent = "✘ Not quite — reread the evidence and try again.";
          choiceFeedback.className = "mt-2 text-xs font-medium text-game-bad";
        }
      });

      hintBtn.addEventListener("click", () => {
        hintBox.textContent = `Hint: ${chapter.challenge.hint}`;
        hintBox.classList.remove("hidden");
      });

      challengeBtn.addEventListener("click", () => {
        if (normalize(challengeInput.value) === normalize(chapter.challenge.answer)) {
          challengeCorrect = true;
          challengeInput.disabled = true;
          challengeBtn.disabled = true;
          challengeFeedback.textContent = "✔ Decoded";
          challengeFeedback.className = "mt-2 text-xs font-medium text-game-good";
          explainerBox.textContent = chapter.challenge.explainer;
          explainerBox.classList.remove("hidden");
          checkSolved();
        } else {
          challengeFeedback.textContent = "✘ Not quite — try again, or grab a hint.";
          challengeFeedback.className = "mt-2 text-xs font-medium text-game-bad";
        }
      });
    }

    body.replaceChildren(
      el("h4", { className: "font-serif text-lg italic", text: `Chapter ${chapter.number}: ${chapter.title}` }),
      el("p", { className: "mt-1 text-sm text-paper-ink", text: chapter.briefing }),
      el("div", { className: "mt-4 space-y-2.5", children: chapter.messages.map(renderMessage) }),
      el("p", { className: "mt-4 text-xs uppercase tracking-wider text-paper-ink-soft", text: "Evidence" }),
      el("ul", { className: "list-disc space-y-1 pl-5 text-sm text-paper-ink", children: chapter.evidence.map((e) => el("li", { text: e })) }),

      el("div", { className: "mt-5 border-t border-paper-ink/20 pt-4" }),
      el("p", { className: "text-sm font-medium", text: chapter.choice.label }),
      select,
      choiceBtn,
      choiceFeedback,

      el("div", { className: "mt-5 border-t border-paper-ink/20 pt-4" }),
      el("p", { className: "text-xs uppercase tracking-wider text-paper-ink-soft", text: `Chapter Flag · ${chapter.challenge.category} · difficulty ${chapter.challenge.difficulty}` }),
      el("p", { className: "mt-2 flex items-start gap-2 text-sm italic text-game-bad", children: [ghostIcon(), el("span", { text: chapter.taunt })] }),
      el("p", {
        className: "mt-2 whitespace-pre-line break-all border-2 border-dashed border-paper-ink/40 bg-paper-card/60 p-3 font-mono text-sm text-paper-ink",
        text: chapter.challenge.data,
      }),
      el("div", { className: "mt-2 flex flex-wrap gap-3", children: [challengeInput] }),
      el("div", { children: [challengeBtn, hintBtn, cyberChefLink] }),
      challengeFeedback,
      hintBox,
      explainerBox,
      clueReveal,
    );
  }

  function renderFinale() {
    const solvedAlready = finaleSolved;
    let pickedSuspect: string | null = null;

    const suspectCards = el("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2" });
    const motiveSelect = el("select", {
      className: "mt-4 w-full border-2 border-paper-ink bg-paper-card/70 px-2 py-2 text-sm text-paper-ink focus:outline-none focus:ring-2 focus:ring-paper-ink",
      children: [
        el("option", { text: "Select a motive...", attrs: { value: "", disabled: true, selected: true } }),
        ...mysteryCase.motiveOptions.map((m) => el("option", { text: m, attrs: { value: m } })),
      ],
    }) as HTMLSelectElement;
    const accuseBtn = el("button", {
      className: "mt-4 bg-paper-ink px-4 py-2 font-serif italic text-paper-bg shadow-[3px_3px_0px_var(--shadow-sm)] transition hover:-translate-y-0.5",
      text: "Present Your Accusation",
      attrs: { type: "button" },
    });
    const feedback = el("p", { className: "mt-3 text-sm" });
    const revealBox = el("div", { className: "mt-6 hidden" });

    function renderSuspects() {
      suspectCards.replaceChildren(
        ...mysteryCase.suspects.map((s) => {
          const card = el("button", {
            className: `flex w-full items-start gap-3 border-2 p-4 text-left transition ${
              pickedSuspect === s.id ? "border-paper-ink bg-paper-ink/5 -translate-y-0.5" : "border-paper-ink/30 bg-paper-card/40 hover:border-paper-ink"
            }`,
            attrs: { type: "button" },
            children: [
              el("img", { className: "h-14 w-14 shrink-0 rounded-full border-2 border-paper-ink object-cover", attrs: { src: AVATARS[s.avatarKey], alt: s.name } }),
              el("div", {
                children: [
                  el("p", { className: "font-serif text-base italic", text: s.name }),
                  el("p", { className: "mt-1 text-xs text-paper-ink-soft", text: s.role }),
                  el("p", { className: "mt-2 text-sm text-paper-ink", text: s.motive }),
                ],
              }),
            ],
          });
          card.addEventListener("click", () => {
            if (solvedAlready) return;
            pickedSuspect = s.id;
            renderSuspects();
          });
          return card;
        }),
      );
    }

    function showReveal() {
      const culprit = mysteryCase.suspects.find((s) => s.isCulprit);
      const copycatChapter = mysteryCase.chapters.find((c) => c.id === "the-copycat");
      const impersonationText = copycatChapter?.messages[0]?.text;

      revealBox.classList.remove("hidden");
      revealBox.replaceChildren(
        el("div", {
          className: "mb-4 inline-block -rotate-2 border-4 border-game-good px-4 py-2 font-serif text-xl italic text-game-good",
          text: "CASE CLOSED",
        }),
        el("p", { className: "text-sm text-paper-ink", text: mysteryCase.finaleReveal }),

        ...(culprit && impersonationText
          ? [
              el("p", { className: "mt-6 text-xs uppercase tracking-wider text-paper-ink-soft", text: "Unmasked" }),
              el("p", { className: "mt-2 mb-2 text-sm text-paper-ink-soft", text: '"Nora" in The Copycat DM was never Nora at all:' }),
              renderMessage({ sender: culprit.name, avatarKey: culprit.avatarKey, text: impersonationText }),
            ]
          : []),

        el("p", { className: "mt-6 text-xs uppercase tracking-wider text-paper-ink-soft", text: "Full debrief" }),
        el("ul", {
          className: "mt-2 list-disc space-y-2 pl-5 text-sm text-paper-ink",
          children: mysteryCase.suspects.map((s) => el("li", { children: [el("strong", { text: `${s.name}: ` }), document.createTextNode(s.clearing)] })),
        }),
      );
    }

    if (solvedAlready) {
      motiveSelect.value = mysteryCase.correctMotive;
      motiveSelect.disabled = true;
      accuseBtn.classList.add("hidden");
      pickedSuspect = mysteryCase.suspects.find((s) => s.isCulprit)?.id ?? null;
      showReveal();
    } else {
      accuseBtn.addEventListener("click", () => {
        if (!pickedSuspect) {
          feedback.textContent = "Pick a suspect first.";
          feedback.className = "mt-3 text-sm font-medium text-game-bad";
          return;
        }
        if (!motiveSelect.value) {
          feedback.textContent = "Pick a motive too.";
          feedback.className = "mt-3 text-sm font-medium text-game-bad";
          return;
        }
        const suspect = mysteryCase.suspects.find((s) => s.id === pickedSuspect);
        if (!suspect?.isCulprit) {
          feedback.textContent = "✘ Not quite — review the clues you've gathered and try again.";
          feedback.className = "mt-3 text-sm font-medium text-game-bad";
          return;
        }
        if (motiveSelect.value !== mysteryCase.correctMotive) {
          feedback.textContent = "✔ Right person — but that's not quite the motive. Try again.";
          feedback.className = "mt-3 text-sm font-medium text-game-warn";
          return;
        }
        finaleSolved = true;
        feedback.textContent = "";
        motiveSelect.disabled = true;
        accuseBtn.classList.add("hidden");
        suspectCards.querySelectorAll("button").forEach((b) => ((b as HTMLButtonElement).disabled = true));
        showReveal();
        renderTabs();
      });
    }

    renderSuspects();
    body.replaceChildren(
      el("h4", { className: "font-serif text-lg italic", text: "Unmasking Ghost_Iris" }),
      el("p", { className: "mt-1 text-sm text-paper-ink", text: "Review the suspects below, then accuse whoever the clues point to — and why." }),
      el("div", { className: "mt-4", children: [suspectCards] }),
      el("p", { className: "mt-4 text-sm font-medium", text: "What was the motive?" }),
      motiveSelect,
      accuseBtn,
      feedback,
      revealBox,
    );
  }

  function render() {
    renderTabs();
    if (activeId === "finale") {
      renderFinale();
    } else {
      const chapter = mysteryCase.chapters.find((c) => c.id === activeId);
      if (chapter) renderChapter(chapter);
    }
  }

  renderClues();
  container.replaceChildren(
    el("div", { children: [el("h3", { className: "font-serif text-xl italic", text: mysteryCase.title }), el("p", { className: "font-serif italic text-paper-ink-soft", text: mysteryCase.subtitle })] }),
    el("p", { className: "mt-3 text-xs uppercase tracking-wider text-paper-ink-soft", text: "A note from me" }),
    el("p", { className: "mt-1 border-l-4 border-paper-ink/30 bg-paper-card/40 py-2 pl-4 pr-2 text-sm italic text-paper-ink-soft", text: mysteryCase.authorNote }),
    el("p", { className: "mt-4 text-xs uppercase tracking-wider text-paper-ink-soft", text: "The case" }),
    el("p", { className: "mt-1 text-sm text-paper-ink-soft", text: mysteryCase.intro }),
    el("div", { className: "mt-6", children: [clueBox] }),
    tabsRow,
    body,
  );
  render();
}
