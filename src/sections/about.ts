import { el, required } from "../lib/dom";

interface Goal {
  title: string;
  icon: string;
  description: string;
  tilt: number;
}

const GOALS: Goal[] = [
  {
    title: "Learning Data Visualization",
    icon: "📊",
    description: "Improve my Power BI and Tableau skills to better turn data into clear, useful insights.",
    tilt: -4,
  },
  {
    title: "CompTIA Security+ Certification",
    icon: "🔐",
    description: "Earn my CompTIA Security+ certification to strengthen my cybersecurity foundation and prepare for future opportunities.",
    tilt: 3,
  },
  {
    title: "Networking Fundamentals",
    icon: "🌐",
    description: "Build a strong foundation in networking through CIS 3500 and hands-on practice.",
    tilt: -3,
  },
  {
    title: "Hackathons",
    icon: "💻",
    description: "Participate in more hackathons to build my technical skills, collaborate with others, and try new ideas.",
    tilt: 5,
  },
  {
    title: "TryHackMe",
    icon: "🎯",
    description: "Stay consistent with TryHackMe to strengthen my hands-on cybersecurity skills through labs and challenges.",
    tilt: -5,
  },
  {
    title: "GitHub Skills",
    icon: "🐙",
    description: "Become more confident with Git and GitHub by consistently managing and contributing to projects.",
    tilt: 4,
  },
  {
    title: "Cloud Computing",
    icon: "☁️",
    description: "Build my cloud computing knowledge through hands-on experience with platforms like AWS, Azure, and Google Cloud.",
    tilt: -4,
  },
  {
    title: "Python & Machine Learning",
    icon: "🐍",
    description: "Strengthen my Python skills and gain hands-on experience with machine learning through projects and coursework.",
    tilt: 3,
  },
  {
    title: "Automation & Scripting",
    icon: "⚙️",
    description: "Improve my PowerShell and Bash skills to automate tasks and build a stronger foundation in cybersecurity operations.",
    tilt: -3,
  },
];

function renderGoalCard(goal: Goal): HTMLElement {
  // The "staple" — a small dark bar straddling the top edge of the photo.
  const staple = el("div", {
    className: "absolute -top-2 left-1/2 h-2.5 w-6 -translate-x-1/2 rounded-[2px] bg-paper-ink-soft/70 shadow-[0_1px_2px_var(--shadow-sm)]",
  });

  // The "photo" — an oversized icon in a little polaroid-style frame,
  // stapled on at a slight tilt like a note pinned to a bulletin board.
  const photoFrame = el("div", {
    className: "relative flex h-16 w-16 items-center justify-center border-2 border-paper-ink bg-paper-card text-3xl shadow-[3px_3px_0px_var(--shadow-sm)]",
    children: [el("span", { text: goal.icon })],
  });
  photoFrame.style.transform = `rotate(${goal.tilt}deg)`;

  const photo = el("div", {
    className: "relative mb-4 flex justify-center",
    children: [staple, photoFrame],
  });

  return el("div", {
    className:
      "goal-card flex flex-col items-center border-2 border-paper-ink bg-paper-card/50 p-6 pt-8 text-center shadow-[6px_6px_0px_var(--shadow-sm)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--shadow-md)]",
    children: [
      photo,
      el("h3", { className: "mb-2 font-serif text-lg", text: goal.title }),
      el("p", { className: "text-center text-sm text-paper-ink-soft", text: goal.description }),
    ],
  });
}

export function renderAbout(): void {
  const grid = required("#goals-grid");
  for (const goal of GOALS) {
    grid.append(renderGoalCard(goal));
  }
}
