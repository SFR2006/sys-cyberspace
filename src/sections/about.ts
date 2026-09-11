import { el, required, clamp } from "../lib/dom";

interface Goal {
  title: string;
  icon: string;
  description: string;
  progress: number;
}

const GOALS: Goal[] = [
  {
    title: "Learning Data Visualization",
    icon: "📊",
    description: "Improve my Power BI and Tableau skills to better turn data into clear, useful insights.",
    progress: 25,
  },
  {
    title: "CompTIA Security+ Certification",
    icon: "🔐",
    description: "Earn my CompTIA Security+ certification to strengthen my cybersecurity foundation and prepare for future opportunities.",
    progress: 50,
  },
  {
    title: "Networking Fundamentals",
    icon: "🌐",
    description: "Build a strong foundation in networking through CIS 3500 and hands-on practice.",
    progress: 10,
  },
  {
    title: "Hackathons",
    icon: "💻",
    description: "Participate in more hackathons to build my technical skills, collaborate with others, and try new ideas.",
    progress: 75,
  },
  {
    title: "TryHackMe",
    icon: "🎯",
    description: "Stay consistent with TryHackMe to strengthen my hands-on cybersecurity skills through labs and challenges.",
    progress: 75,
  },
  {
    title: "GitHub Skills",
    icon: "🐙",
    description: "Become more confident with Git and GitHub by consistently managing and contributing to projects.",
    progress: 75,
  },
  {
    title: "Cloud Computing",
    icon: "☁️",
    description: "Build my cloud computing knowledge through hands-on experience with platforms like AWS, Azure, and Google Cloud.",
    progress: 75,
  },
  {
    title: "Python & Machine Learning",
    icon: "🐍",
    description: "Strengthen my Python skills and gain hands-on experience with machine learning through projects and coursework.",
    progress: 75,
  },
  {
    title: "Automation & Scripting",
    icon: "⚙️",
    description: "Improve my PowerShell and Bash skills to automate tasks and build a stronger foundation in cybersecurity operations.",
    progress: 75,
  },
];

// Progress reads as a color-coded "health" tier, echoing the same
// good/warn/bad accents used for game feedback in Syberspace.
function tierColor(progress: number): string {
  if (progress >= 60) return "var(--color-game-good)";
  if (progress >= 30) return "var(--color-game-warn)";
  return "var(--color-game-bad)";
}

function renderGoalCard(goal: Goal): HTMLElement {
  const badge = el("span", {
    className: "flex h-9 min-w-11 items-center justify-center rounded-full border-2 px-2 text-xs font-bold",
    text: `${goal.progress}%`,
  });

  const fill = el("div", {
    className: "progress-fill h-full rounded-full transition-[width] duration-300",
  });
  fill.style.width = `${goal.progress}%`;

  const bar = el("div", {
    className: "progress-bar mt-5 h-2.5 w-full cursor-pointer overflow-hidden rounded-full border-2 border-paper-ink/30 bg-paper-bg/60",
    attrs: { role: "button", tabindex: 0, "aria-label": `${goal.title} progress: ${goal.progress}%. Click to update.` },
    children: [fill],
  });

  let progress = goal.progress;

  // Set via the CSSOM, not an HTML `style=""` string — see the doodle
  // styling note in hero-doodles.ts for why (the page's strict CSP).
  const applyTier = (value: number) => {
    const color = tierColor(value);
    badge.style.color = color;
    badge.style.borderColor = color;
    fill.style.background = color;
  };
  applyTier(progress);

  const updateProgress = () => {
    const raw = window.prompt(`Current progress: ${progress}%. Enter new progress (0-100):`, String(progress));
    if (raw === null) return;
    const parsed = clamp(Number(raw), 0, 100, progress);
    progress = Math.round(parsed);
    fill.style.width = `${progress}%`;
    badge.textContent = `${progress}%`;
    applyTier(progress);
    bar.setAttribute("aria-label", `${goal.title} progress: ${progress}%. Click to update.`);
  };

  bar.addEventListener("click", updateProgress);
  bar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      updateProgress();
    }
  });

  return el("div", {
    className:
      "goal-card flex flex-col border-2 border-paper-ink bg-paper-card/50 p-6 shadow-[6px_6px_0px_var(--shadow-sm)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--shadow-md)]",
    children: [
      el("div", {
        className: "mb-3 flex items-center justify-between gap-3",
        children: [el("span", { className: "text-3xl", text: goal.icon }), badge],
      }),
      el("h3", { className: "mb-2 font-serif text-lg", text: goal.title }),
      el("p", { className: "text-left text-sm text-paper-ink-soft", text: goal.description }),
      bar,
    ],
  });
}

export function renderAbout(): void {
  const grid = required("#goals-grid");
  for (const goal of GOALS) {
    grid.append(renderGoalCard(goal));
  }
}
