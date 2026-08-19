import { el, required } from "../lib/dom";

interface PostIt {
  date: string;
  text: string;
}

interface Milestone {
  title: string;
  date: string;
  description: string;
  postIts: PostIt[];
}

const MILESTONES: Milestone[] = [
  {
    title: "Milestone 1: Cybersecurity Foundations & Hands-On Practice",
    date: "Jan 2026-Present",
    description:
      "In 2026, I am focusing on earning my CompTIA Security+ certification while consistently working through TryHackMe challenges to build practical cybersecurity skills. At the same time, I am improving my automation and scripting abilities using PowerShell and Bash, which helps me better understand how Security Operations Centers operate and makes me more efficient in handling cyber tasks. These efforts are strengthening my foundation in cybersecurity and preparing me for more advanced challenges ahead.",
    postIts: [
      { date: "Jan 4, 2026", text: "Update: Bought a TryHackMe subscription!" },
      { date: "Jan 7, 2026", text: "Finished Unit 1 of Professor Messer's SYO-701 videos." },
    ],
  },
  {
    title: "Milestone 2: Data & Programming Skills Development",
    date: "Jan 2026-Present",
    description:
      "In 2026, I'm focused on improving my Python programming and exploring machine learning concepts, especially through the Breakthrough Fellowship. I'm also working to strengthen my SQL skills for better data analysis and mastering data visualization tools like Power BI and Tableau to create clear, impactful data stories. These efforts will help me handle data more effectively and expand my technical skillset.",
    postIts: [{ date: "Jan 10, 2026", text: "Started Power BI for Data Science course (Datacamp)." }],
  },
  {
    title: "Milestone 3: Tech Tools & Cloud Competency",
    date: "Feb 2026-Present",
    description:
      "In 2026, I'm working to advance my Git skills by adding more projects and improving collaboration. I'm also gaining hands-on experience with cloud computing through platforms like AWS, Azure, and Google Cloud, including a SOAR & SIEM course on Google Cloud. Additionally, I'm building a strong foundation in networking fundamentals through my CIS3500 course and self-study. These goals will make me more versatile and prepared for future tech opportunities.",
    postIts: [],
  },
];

const ROTATIONS = ["-rotate-2", "rotate-2", "-rotate-1"];
const MAX_POSTIT_LENGTH = 240;

function rotationFor(index: number): string {
  if (index % 3 === 0) return ROTATIONS[2];
  return index % 2 === 0 ? ROTATIONS[1] : ROTATIONS[0];
}

function renderPostIt(postIt: PostIt, index: number): HTMLElement {
  return el("div", {
    className: `post-it w-[190px] min-h-[150px] border-2 border-paper-ink bg-paper-bg/90 p-5 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] transition-all hover:z-10 hover:scale-105 hover:rotate-0 ${rotationFor(index)}`,
    children: [
      el("div", { className: "mb-2 text-xs italic text-paper-ink-soft", text: postIt.date }),
      el("div", { className: "text-sm leading-relaxed", text: postIt.text }),
    ],
  });
}

/** Builds the "add a post-it" control: a `+` tile that swaps for a tiny inline
 * form. Every value from the form is inserted via `textContent`, never
 * `innerHTML`, so there is no way for typed text to be parsed as markup. */
function renderAddPostIt(container: HTMLElement, addTile: HTMLElement): HTMLElement {
  const dateInput = el("input", {
    className: "mb-2 w-full border border-paper-ink bg-white/80 px-2 py-1 text-xs",
    attrs: { type: "text", placeholder: "Date (e.g. Jan 6, 2026)", maxlength: 40 },
  }) as HTMLInputElement;

  const textInput = el("textarea", {
    className: "mb-2 w-full resize-none border border-paper-ink bg-white/80 px-2 py-1 text-xs",
    attrs: { placeholder: "Progress update...", maxlength: MAX_POSTIT_LENGTH, rows: 3 },
  }) as HTMLTextAreaElement;

  const submit = el("button", {
    className: "w-full border border-paper-ink bg-paper-ink py-1 text-xs text-paper-bg",
    text: "Add",
    attrs: { type: "button" },
  });

  const form = el("div", {
    className: "post-it w-[190px] min-h-[150px] border-2 border-dashed border-paper-ink bg-paper-bg/70 p-4",
    children: [dateInput, textInput, submit],
  });

  submit.addEventListener("click", () => {
    const date = dateInput.value.trim();
    const text = textInput.value.trim();
    if (!date || !text) return;
    const postIt = renderPostIt({ date, text: text.slice(0, MAX_POSTIT_LENGTH) }, container.childElementCount);
    container.insertBefore(postIt, form);
    form.replaceWith(addTile);
  });

  return form;
}

function renderMilestone(milestone: Milestone): HTMLElement {
  const postItContainer = el("div", { className: "mt-6 flex flex-wrap gap-6" });

  const addTile = el("div", {
    className: "add-post-it flex h-[150px] w-[190px] cursor-pointer items-center justify-center border-2 border-dashed border-paper-ink text-4xl text-paper-ink/70 transition hover:bg-white/40",
    text: "+",
    attrs: { role: "button", tabindex: 0, title: "Add new update", "aria-label": "Add new update" },
  });

  const openForm = () => {
    const form = renderAddPostIt(postItContainer, addTile);
    addTile.replaceWith(form);
  };
  addTile.addEventListener("click", openForm);
  addTile.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openForm();
    }
  });

  milestone.postIts.forEach((p, i) => postItContainer.append(renderPostIt(p, i)));
  postItContainer.append(addTile);

  return el("div", {
    className: "timeline-item mb-8 border-2 border-paper-ink bg-white/40 p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur transition hover:translate-x-2",
    children: [
      el("h3", { className: "mb-1 font-serif text-xl", text: milestone.title }),
      el("p", { className: "mb-4 font-serif text-sm italic text-paper-ink-soft", text: milestone.date }),
      el("p", { className: "text-left", text: milestone.description }),
      postItContainer,
    ],
  });
}

export function renderJourney(): void {
  const timeline = required("#timeline");
  for (const milestone of MILESTONES) {
    timeline.append(renderMilestone(milestone));
  }
}
