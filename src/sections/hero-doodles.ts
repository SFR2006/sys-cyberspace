import { el } from "../lib/dom";

interface Doodle {
  id: string;
  src: string;
  alt: string;
  caption: string;
  blurb: string;
  rotation: number;
}

// A row of "favorite things" badges under the intro paragraph — every hero
// icon you sent over, kept in this order.
const DOODLES: Doodle[] = [
  {
    id: "headphones",
    src: "/icon-headphones.jpg",
    alt: "Headphones",
    caption: "always got something playing",
    blurb:
      "I love listening to music — some of my favorite artists are Dominic Fike, Chappell Roan, and Malcom Todd. I'm also really into podcasts, especially true-crime ones like Darknet Diaries, plus a few cybersecurity-focused ones too.",
    rotation: -6,
  },
  {
    id: "suitcase",
    src: "/icon-suitcase.jpg",
    alt: "Suitcase",
    caption: "always ready for the next trip",
    blurb: "I love traveling and exploring new places — I'm always daydreaming about wherever I'm headed next.",
    rotation: 6,
  },
  {
    id: "book",
    src: "/icon-book.jpg",
    alt: "Book",
    caption: "always mid-book",
    blurb: "I love reading — I recently finished Animal Farm! I'm pretty much always in the middle of some book or another.",
    rotation: -4,
  },
  {
    id: "cards",
    src: "/icon-cards.jpg",
    alt: "Ace of spades playing card",
    caption: "card shark in training",
    blurb: "I love playing card games with my cousins — Go Fish, Spoons, and Crazy Eights are just some of my favorites!",
    rotation: 4,
  },
  {
    id: "tote",
    src: "/icon-tote.jpg",
    alt: "Tote bag",
    caption: "professional-grade shopping",
    blurb: "Shopping is basically a hobby of mine — I love browsing and finding new things, whether or not I actually need them. :)",
    rotation: 5,
  },
  {
    id: "bike",
    src: "/icon-bike.jpg",
    alt: "Bicycle",
    caption: "pedaling around",
    blurb: "I love biking when I get the chance — it's one of my favorite ways to get some air and clear my head.",
    rotation: -5,
  },
];

// How long each badge waits after the row scrolls into view, staggered so
// they pop in one at a time rather than all at once.
const POP_STAGGER_S = 0.15;

function closeAllBlurbs(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-blurb]").forEach((b) => b.classList.add("hidden"));
}

function renderDoodle(doodle: Doodle, index: number, container: HTMLElement): HTMLElement {
  const wrapper = el("div", { className: "doodle group relative select-none" });
  // Set via the CSSOM, not an HTML `style=""` string — inline style
  // *attributes* are blocked by the page's strict CSP, but CSSOM property
  // assignment isn't.
  wrapper.style.setProperty("--doodle-rot", `${doodle.rotation}deg`);
  wrapper.style.setProperty("--doodle-delay", `${index * POP_STAGGER_S}s`);

  const badge = el("button", {
    className:
      "doodle-badge relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-[4px_4px_10px_var(--shadow-lg)] transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20",
    attrs: { type: "button", "aria-label": `${doodle.alt} — ${doodle.caption}` },
  }) as HTMLButtonElement;

  const img = el("img", {
    className: "h-full w-full object-cover",
    attrs: { src: doodle.src, alt: doodle.alt },
  }) as HTMLImageElement;
  img.draggable = false;

  const tooltip = el("span", {
    className:
      "pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-paper-ink px-2 py-1 text-xs text-paper-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100",
    text: doodle.caption,
  });

  const closeBtn = el("button", {
    className: "absolute right-2 top-2 text-paper-ink-soft hover:text-paper-ink",
    text: "×",
    attrs: { type: "button", "aria-label": "Close" },
  });

  const blurb = el("div", {
    className:
      "hidden absolute top-full left-1/2 z-20 mt-3 w-64 -translate-x-1/2 border-2 border-paper-ink bg-paper-card p-4 text-left text-sm leading-relaxed text-paper-ink shadow-[6px_6px_0px_var(--shadow-md)]",
    attrs: { "data-blurb": doodle.id },
    children: [closeBtn, el("p", { text: doodle.blurb })],
  });
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    blurb.classList.add("hidden");
  });

  badge.append(img, tooltip);
  wrapper.append(badge, blurb);

  badge.addEventListener("click", () => {
    const isOpen = !blurb.classList.contains("hidden");
    closeAllBlurbs(container);
    blurb.classList.toggle("hidden", isOpen);
  });

  return wrapper;
}

export function renderHeroDoodles(): void {
  const container = document.getElementById("hero-doodles");
  if (!container) return;

  DOODLES.forEach((doodle, index) => {
    container.append(renderDoodle(doodle, index, container));
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Node) || !container.contains(e.target)) closeAllBlurbs(container);
  });

  // Hold the pop-in animation until the row actually scrolls into view (see
  // .doodle in style.css — it starts paused), then let the staggered
  // per-badge delays play it one at a time. Fires once.
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        container.classList.add("doodles-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  observer.observe(container);
}
