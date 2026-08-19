import { el, required, clamp } from "../lib/dom";

interface Goal {
  title: string;
  description: string;
  progress: number;
}

const GOALS: Goal[] = [
  {
    title: "Learning Data Visualization",
    description:
      "One of my main goals for 2026 is to get comfortable and confident using Power BI and Tableau. I want to improve my skills in data visualization because these tools help you turn raw data into stories that people can actually understand and use. Nowadays, data drives a lot of decisions, so being able to present it clearly is really important. Learning this will help me make smarter choices and be more valuable in any job I do.",
    progress: 25,
  },
  {
    title: "CompTIA Security+ Certification",
    description:
      "One of my goals for 2026 is to earn my CompTIA Security+ (Sec+) certification. As a sophomore in college and someone fairly new to cybersecurity, I believe this certification will give me a solid foundation in the field. Cybersecurity is rapidly growing, and having this credential will help me develop essential skills and open up more opportunities for my future.",
    progress: 50,
  },
  {
    title: "Networking Fundamentals",
    description:
      "Another one of my goals for 2026 is to build a solid understanding of networking fundamentals. I'm taking CIS3500 this spring, which will introduce me to the basics of networking. I think this knowledge is really important, especially as someone still exploring and finding my way in the tech field. Having a strong foundation in networking will help me better understand how systems communicate and improve my overall tech skills.",
    progress: 10,
  },
  {
    title: "Hackathons",
    description:
      "In 2026 I hope to participate in more hackathons. I was able to join two hackathon-style competitions last year, and they were surprisingly really fun. I enjoyed the experience and working with others. I'm looking forward to getting involved in more because they're great opportunities to grow my skills, learn new things, and connect with people who share my interests.",
    progress: 75,
  },
  {
    title: "Try Hack Me",
    description:
      "One of my goals for 2026 is to be more consistent in practicing cybersecurity on platforms like TryHackMe. I recently bought a subscription and want to regularly work through rooms, labs, and other challenges to build my hands-on skills. This will not only help me deepen my understanding of cyber concepts but also support my progress toward other goals, like earning my Security+ certification.",
    progress: 75,
  },
  {
    title: "GitHub Skills",
    description:
      "One of my goals for 2026 is to become more comfortable and confident using Git. I've been adding more projects to my repositories, and I want to improve my version control skills to better manage code and collaborate with others.",
    progress: 75,
  },
  {
    title: "Cloud Computing",
    description:
      "I want to advance my knowledge of cloud computing platforms like AWS, Azure, and Google Cloud in 2026. I'm currently working through a SOAR & SIEM course on Google Cloud, which is helping me gain hands-on experience. Understanding cloud services is important for many tech roles, and building this experience will make me more versatile and prepared for future opportunities.",
    progress: 75,
  },
  {
    title: "Python & Machine Learning",
    description:
      "In 2026, I aim to strengthen my Python programming and explore machine learning concepts. I've applied to the Breakthrough Fellowship program and hope to advance these skills through hands-on projects and mentorship. This will help me gain practical experience and deepen my understanding of data science and AI.",
    progress: 75,
  },
  {
    title: "Automation & Scripting",
    description:
      "Another goal for 2026 is to improve my automation and scripting skills using tools like PowerShell or Bash. These skills are especially important in cybersecurity and could help me become more familiar with how Security Operations Centers (SOCs) work. Automating repetitive tasks will help me work more efficiently and better manage systems and workflows.",
    progress: 75,
  },
];

function renderGoalCard(goal: Goal): HTMLElement {
  const fill = el("div", {
    className: "progress-fill flex h-full items-center justify-center bg-paper-ink text-xs font-bold text-paper-bg transition-[width] duration-300",
    text: `${goal.progress}%`,
    attrs: { style: `width:${goal.progress}%` },
  });

  const bar = el("div", {
    className: "progress-bar mt-4 h-6 w-full cursor-pointer overflow-hidden border-2 border-paper-ink bg-white/50",
    attrs: { role: "button", tabindex: 0, "aria-label": `${goal.title} progress: ${goal.progress}%. Click to update.` },
    children: [fill],
  });

  let progress = goal.progress;

  const updateProgress = () => {
    const raw = window.prompt(`Current progress: ${progress}%. Enter new progress (0-100):`, String(progress));
    if (raw === null) return;
    const parsed = clamp(Number(raw), 0, 100, progress);
    progress = Math.round(parsed);
    fill.style.width = `${progress}%`;
    fill.textContent = `${progress}%`;
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
    className: "goal-card border-2 border-paper-ink bg-white/50 p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.15)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,0.2)]",
    children: [
      el("h3", { className: "mb-4 text-center font-serif text-xl", text: goal.title }),
      el("p", { className: "text-left text-sm", text: goal.description }),
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
