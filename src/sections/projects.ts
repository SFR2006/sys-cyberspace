import { el, required } from "../lib/dom";

interface DetailSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface Project {
  id: string;
  title: string;
  summary: string;
  image?: { src: string; alt: string };
  detailTitle: string;
  sections: DetailSection[];
}

const PROJECTS: Project[] = [
  {
    id: "datathon",
    title: "Macaulay Datathon",
    summary:
      "Our award-winning project, Mind the Data Gap, uses Python and data visualization to uncover key insights from the MTA's Automated Camera Enforcement system, turning complex traffic violation data into a powerful story about enforcement patterns in NYC.",
    image: { src: "/datathon-img.jpeg", alt: "Macaulay Datathon project thumbnail" },
    detailTitle: "Mind the Data Gap — Full Details",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Our project was inspired by a desire to leverage data not just to create charts, but to tell meaningful stories that reveal deeper insights. We focused on analyzing violations captured by the Metropolitan Transportation Authority's M101 Automated Camera Enforcement (ACE) system. The goal was to uncover patterns such as violation hotspots, top offenders, and exemptions, providing a clearer understanding of traffic enforcement and public safety in NYC. This data-driven storytelling approach made the project especially meaningful to us, highlighting how analytics can drive real-world impact.",
        ],
      },
      {
        heading: "Technologies Used",
        bullets: [
          "Python: For data querying, cleaning, and analysis.",
          "pandas: To manipulate and explore large datasets efficiently.",
          "matplotlib: To build clear, insightful visualizations to communicate findings.",
          "IDEs (Integrated Development Environments): To streamline coding and debugging.",
        ],
        paragraphs: [
          "We chose Python and pandas due to their power and flexibility for data analysis. Matplotlib was selected for its ability to create detailed, customizable visualizations, essential for telling our story through data.",
        ],
      },
      {
        heading: "Challenges & Solutions",
        bullets: [
          "Data Complexity: Understanding and cleaning the MTA's ACE dataset was challenging due to its size and complexity. We tackled this by breaking down the data into manageable subsets and iteratively exploring key variables.",
          "Insightful Storytelling: Moving beyond basic charts to uncover meaningful stories required creative thinking and collaboration, which we achieved through regular brainstorming sessions.",
          "Technical Learning Curve: As a team new to some of these tools, we faced initial hurdles with coding and visualization but overcame them through practice, peer support, and online resources.",
        ],
        paragraphs: ["This experience strengthened our data analytics skills and taught us the importance of collaboration and perseverance."],
      },
      {
        heading: "Current Status",
        paragraphs: [
          "Our project is complete as a functional analysis and visualization suite that highlights important patterns in MTA violations. We successfully built a detailed report and interactive visualizations that showcase our key findings. Next, we plan to refine our visual storytelling further and explore possibilities for expanding the dataset or automating insights.",
        ],
      },
      {
        heading: "Key Features",
        bullets: [
          "Identification of violation hotspots across NYC.",
          "Ranking of top offenders by violation frequency.",
          "Analysis of exempt violations to understand enforcement nuances.",
          "Interactive visualizations that communicate data stories clearly and effectively.",
        ],
        paragraphs: [
          "What makes our project unique is its focus on transforming raw enforcement data into a compelling narrative that informs public understanding and policy considerations.",
        ],
      },
    ],
  },
  {
    id: "ai4ed",
    title: "AI4Ed",
    summary:
      "AI4ED is an AI-powered educational platform that personalizes learning for students and provides teachers with smart insights to improve classroom experiences. Our project earned 2nd place at the Accenture TLDP design thinking challenge, showcasing its potential to modernize education through technology.",
    image: { src: "/ai4ed.jpeg", alt: "AI4Ed project thumbnail" },
    detailTitle: "AI4Ed — Full Details",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Our project was born from the challenge to modernize the education system in the Northeast using technology. AI4ED is an AI-powered platform designed to enhance both student and teacher experiences by offering personalized learning pathways, smart classroom insights, career exploration pods, and a modernized note-taking feature inspired by traditional learning styles. Our vision was to create a holistic tool that adapts to diverse learning needs and supports educators in fostering student success.",
        ],
      },
      {
        heading: "Technologies Used",
        bullets: [
          "Artificial Intelligence (AI): To enable personalized learning recommendations and adaptive content delivery.",
          "Data Analytics: For real-time classroom insights and progress tracking.",
          "Web and Mobile Development Tools: To build accessible interfaces for students and teachers.",
        ],
        paragraphs: [
          "We selected AI technologies to provide tailored educational experiences, and analytics to empower teachers with actionable classroom data. The focus was on creating intuitive and flexible tools that complement traditional learning methods.",
        ],
      },
      {
        heading: "Challenges & Solutions",
        bullets: [
          "Complexity of Personalization: Designing AI algorithms that meaningfully adapt to individual learning styles required extensive research and iterative testing. We addressed this by leveraging existing educational frameworks and continuously refining our models.",
          "Balancing Innovation with Usability: Ensuring the platform was both advanced and easy to use was a priority. Regular feedback sessions with educators helped us align features with user needs.",
          "Team Coordination: Collaborating across diverse skill sets meant overcoming communication hurdles, which we managed through structured workflows and open dialogue.",
        ],
        paragraphs: ["Through these challenges, we learned the importance of user-centered design and agile teamwork in tech innovation."],
      },
      {
        heading: "Current Status",
        paragraphs: [
          "We completed a comprehensive proposal and prototype presentation of AI4ED to a panel of judges at Accenture, earning 2nd place in the competition. The core features and design concepts are well-defined, and we have received valuable feedback to guide future development.",
        ],
      },
      {
        heading: "Key Features",
        bullets: [
          "Personalized learning paths tailored to each student's strengths and challenges.",
          "Smart classroom insights providing teachers with real-time data on student engagement and performance.",
          "Career exploration pods connecting students to future opportunities aligned with their interests.",
          "Modernized note-taking feature blending traditional methods with digital convenience.",
        ],
        paragraphs: ["What makes AI4ED special is its integration of AI with educational best practices to create a seamless and supportive learning environment."],
      },
    ],
  },
  {
    id: "mta",
    title: "MTA Project",
    summary:
      "Designed an AI-assisted sourcing framework to help recruiters cut through thousands of low-relevance Boolean search results and quickly surface strong candidates for hard-to-fill technical roles.",
    image: { src: "/mta.png", alt: "MTA Project thumbnail" },
    detailTitle: "MTA Project — Full Details",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Collaborated in a team to address large-scale recruitment inefficiencies where traditional Boolean searches returned 3,000–10,000+ candidate profiles with low relevance for hard-to-fill technical roles. Designed an AI-assisted sourcing framework using prompt engineering and structured keyword extraction to improve search precision and recruiter workflow efficiency.",
        ],
      },
      {
        heading: "Technologies Used",
        bullets: ["Prompt engineering", "Structured keyword extraction", "Boolean search string generation"],
        paragraphs: [
          "Developed prompting templates to analyze job descriptions, extract high-signal skills and realistic job titles, and generate tailored Boolean search strings.",
        ],
      },
      {
        heading: "Key Features",
        bullets: [
          "Reduced candidate search results by up to 90%, transforming thousands of profiles into a more focused and relevant candidate pool.",
          "Automated extraction of high-signal skills and realistic job titles directly from job descriptions.",
          "Tailored Boolean search strings generated to fit recruiter workflows.",
        ],
      },
      {
        heading: "Reflection",
        paragraphs: [
          "It was incredibly rewarding to see our framework being implemented and already helping identify candidates for interviews. Beyond the technical work, this experience gave me valuable insight into the recruitment process from the employer's perspective — lessons I now actively apply in my own job search.",
        ],
      },
    ],
  },
  {
    id: "morgan-stanley-hackathon",
    title: "Morgan Stanley Hackathon",
    summary:
      "Selected as 1 of 100 participants from 2,200+ applicants for Morgan Stanley's Code to Give hackathon, where our team built Lemontree, a full-stack volunteer outreach platform for community flyering events that expand access to local food resources.",
    image: { src: "/morgan_stanley.png", alt: "Morgan Stanley Code to Give hackathon project thumbnail" },
    detailTitle: "Morgan Stanley Hackathon — Full Details",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Selected as 1 of 100 participants from 2,200+ applicants to compete in Morgan Stanley's Code to Give hackathon. Collaborated in a cross-functional team of 10 to design and build a full-stack volunteer outreach platform for nonprofit organization Lemontree, aimed at improving coordination and scalability of community flyering events that help expand access to local food resources.",
        ],
      },
      {
        heading: "My Role",
        paragraphs: [
          "Led front-end wireframing, UI design, and development of responsive user interfaces for key platform flows including interactive map features, event discovery, and volunteer signup. Translated product ideas into functional components using modern frontend frameworks while partnering with backend developers to integrate event data and participation tracking features such as the leaderboard.",
        ],
      },
      {
        heading: "Reflection",
        paragraphs: [
          "This was my first experience contributing to a full-stack application while working with several new technologies. The hackathon pushed me outside my comfort zone, strengthened my ability to learn quickly in a collaborative environment, and reinforced my motivation to use technology to create a meaningful impact in local communities!",
        ],
      },
    ],
  },
];

function renderDetailSection(section: DetailSection): HTMLElement {
  const children: HTMLElement[] = [el("h4", { className: "mb-3 mt-8 font-serif text-lg", text: section.heading })];
  if (section.bullets) {
    for (const bullet of section.bullets) {
      children.push(el("p", { className: "mb-2 text-left", children: [el("strong", { text: "• " }), bullet] }));
    }
  }
  if (section.paragraphs) {
    for (const para of section.paragraphs) {
      children.push(el("p", { className: "mb-4 text-left", text: para }));
    }
  }
  return el("div", { children });
}

function renderModal(project: Project): HTMLElement {
  const closeBtn = el("button", {
    className: "absolute right-6 top-4 text-3xl font-bold text-paper-ink transition hover:rotate-90",
    text: "×",
    attrs: { type: "button", "aria-label": "Close" },
  });

  const modal = el("div", {
    className: "modal fixed inset-0 z-[2000] hidden items-center justify-center overflow-y-auto bg-black/70 p-6",
    attrs: { id: `modal-${project.id}`, role: "dialog", "aria-modal": "true", "aria-label": project.detailTitle },
    children: [
      el("div", {
        className: "modal-content relative max-h-[90vh] w-full max-w-3xl overflow-y-auto paper-gradient paper-texture border-[3px] border-paper-ink p-8 shadow-[15px_15px_0px_var(--shadow-lg)] sm:p-12",
        children: [
          closeBtn,
          el("h3", { className: "mb-6 text-center font-serif text-3xl", text: project.detailTitle }),
          ...project.sections.map(renderDetailSection),
        ],
      }),
    ],
  });

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  };

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });

  return modal;
}

function renderCard(project: Project, openModal: () => void): HTMLElement {
  const children: (HTMLElement | string)[] = [
    el("h3", { className: "mb-4 text-center font-serif text-xl", text: project.title }),
    el("p", { className: "text-left text-sm", text: project.summary }),
  ];
  if (project.image) {
    children.push(
      el("img", {
        className: "mt-4 aspect-[16/10] w-full border-2 border-paper-ink object-cover",
        attrs: { src: project.image.src, alt: project.image.alt, loading: "lazy" },
      }),
    );
  }
  children.push(el("p", { className: "mt-4 text-center text-sm italic text-paper-ink-soft", text: "Click to view details →" }));

  const card = el("div", {
    className: "project-card cursor-pointer border-2 border-paper-ink bg-paper-card/50 p-8 shadow-[6px_6px_0px_var(--shadow-sm)] backdrop-blur transition-all hover:-translate-y-2 hover:shadow-[10px_10px_0px_var(--shadow-md)]",
    attrs: { role: "button", tabindex: 0 },
    children,
  });

  card.addEventListener("click", openModal);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  });

  return card;
}

export function renderProjects(): void {
  const grid = required("#project-grid");
  const modalRoot = required("#modal-root");

  for (const project of PROJECTS) {
    const modal = renderModal(project);
    modalRoot.append(modal);

    const openModal = () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("overflow-hidden");
    };

    grid.append(renderCard(project, openModal));
  }
}
