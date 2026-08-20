import { el, clamp } from "../lib/dom";

interface Doodle {
  id: string;
  src: string;
  alt: string;
  caption: string;
  blurb: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotation: number;
  delay: number;
}

// Two columns of three, mirrored left/right — every hero icon you sent over.
const DOODLES: Doodle[] = [
  {
    id: "headphones",
    src: "/icon-headphones.jpg",
    alt: "Headphones",
    caption: "always got something playing",
    blurb:
      "I love listening to music — some of my favorite artists are Dominic Fike, Chappell Roan, and Malcom Todd. I'm also really into podcasts, especially true-crime ones like Darknet Diaries, plus a few cybersecurity-focused ones too.",
    top: "6%",
    left: "7%",
    rotation: -6,
    delay: 0,
  },
  {
    id: "suitcase",
    src: "/icon-suitcase.jpg",
    alt: "Suitcase",
    caption: "always ready for the next trip",
    blurb: "I love traveling and exploring new places — I'm always daydreaming about wherever I'm headed next.",
    top: "6%",
    right: "7%",
    rotation: 6,
    delay: 1.1,
  },
  {
    id: "book",
    src: "/icon-book.jpg",
    alt: "Book",
    caption: "always mid-book",
    blurb: "I love reading — I recently finished Animal Farm! I'm pretty much always in the middle of some book or another.",
    top: "46%",
    left: "7%",
    rotation: -4,
    delay: 0.55,
  },
  {
    id: "cards",
    src: "/icon-cards.jpg",
    alt: "Ace of spades playing card",
    caption: "card shark in training",
    blurb: "I love playing card games with my cousins — Go Fish, Spoons, and Crazy Eights are just some of my favorites!",
    top: "46%",
    right: "7%",
    rotation: 4,
    delay: 1.4,
  },
  {
    id: "tote",
    src: "/icon-tote.jpg",
    alt: "Tote bag",
    caption: "professional-grade shopping",
    blurb: "Shopping is basically a hobby of mine — I love browsing and finding new things, whether or not I actually need them. :)",
    bottom: "6%",
    left: "7%",
    rotation: 5,
    delay: 0.85,
  },
  {
    id: "bike",
    src: "/icon-bike.jpg",
    alt: "Bicycle",
    caption: "pedaling around",
    blurb: "I love biking when I get the chance — it's one of my favorite ways to get some air and clear my head.",
    bottom: "6%",
    right: "7%",
    rotation: -5,
    delay: 1.7,
  },
];

const DRAG_THRESHOLD_PX = 6;

function closeAllBlurbs(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>("[data-blurb]").forEach((b) => b.classList.add("hidden"));
}

function renderDoodle(doodle: Doodle, container: HTMLElement): HTMLElement {
  const wrapper = el("div", {
    className: "doodle absolute cursor-grab select-none active:cursor-grabbing",
  });
  // Every property below is set via the CSSOM (style.foo = ...), never an
  // HTML `style=""` attribute string (setAttribute/cssText) — the CSSOM
  // property setters are unaffected by the page's strict script/style CSP,
  // while attribute-based inline styles would be silently blocked by it.
  if (doodle.top) wrapper.style.top = doodle.top;
  if (doodle.bottom) wrapper.style.bottom = doodle.bottom;
  if (doodle.left) wrapper.style.left = doodle.left;
  if (doodle.right) wrapper.style.right = doodle.right;
  wrapper.style.setProperty("--doodle-rot", `${doodle.rotation}deg`);
  wrapper.style.setProperty("--doodle-delay", `${doodle.delay}s`);
  if (doodle.left === "50%") wrapper.style.transform = "translateX(-50%)";

  const badge = el("div", {
    className: "doodle-badge relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[4px_4px_10px_var(--shadow-lg)] transition-transform duration-300 hover:scale-110",
  });

  const img = el("img", {
    className: "h-full w-full object-cover",
    attrs: { src: doodle.src, alt: doodle.alt },
  }) as HTMLImageElement;
  // `draggable` is an enumerated attribute ("true"/"false"), not a boolean
  // one — el()'s attrs helper omits `false` values (correct for real
  // boolean attributes like `disabled`, wrong here), so it's set directly
  // via the IDL property instead. Without this, the browser's native
  // image-drag gesture hijacks pointer events partway through a drag.
  img.draggable = false;

  const tooltip = el("span", {
    className: "pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-paper-ink px-2 py-1 text-xs text-paper-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100",
    text: doodle.caption,
  });

  const closeBtn = el("button", {
    className: "absolute right-2 top-2 text-paper-ink-soft hover:text-paper-ink",
    text: "×",
    attrs: { type: "button", "aria-label": "Close" },
  });

  const blurb = el("div", {
    className: "hidden absolute top-full z-20 mt-3 w-64 border-2 border-paper-ink bg-paper-card p-4 text-left text-sm leading-relaxed text-paper-ink shadow-[6px_6px_0px_var(--shadow-md)]",
    attrs: { "data-blurb": doodle.id },
    children: [closeBtn, el("p", { text: doodle.blurb })],
  });
  if (doodle.left === "50%") {
    blurb.style.left = "50%";
    blurb.style.transform = "translateX(-50%)";
  } else if (doodle.right) {
    blurb.style.right = "0";
  } else {
    blurb.style.left = "0";
  }
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    blurb.classList.add("hidden");
  });

  badge.append(img, tooltip);
  wrapper.append(badge, blurb);
  wrapper.classList.add("group");

  // --- Drag + click handling (Pointer Events cover mouse, touch, and pen) ---
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  wrapper.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    wrapper.setPointerCapture(e.pointerId);
    const rect = wrapper.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    originLeft = rect.left - parentRect.left;
    originTop = rect.top - parentRect.top;
    startX = e.clientX;
    startY = e.clientY;
    // Freeze the CSS float/rotate animation and switch to explicit px
    // positioning the moment a drag begins, so it doesn't fight the
    // pointer. Also bring the dragged sticker to the front.
    wrapper.style.animation = "none";
    wrapper.style.transform = "none";
    wrapper.style.zIndex = "30";
  });

  wrapper.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX) moved = true;
    if (!moved) return;

    const parentRect = container.getBoundingClientRect();
    const maxLeft = parentRect.width - wrapper.offsetWidth;
    const maxTop = parentRect.height - wrapper.offsetHeight;
    const nextLeft = clamp(originLeft + dx, 0, Math.max(0, maxLeft), originLeft);
    const nextTop = clamp(originTop + dy, 0, Math.max(0, maxTop), originTop);

    wrapper.style.left = `${nextLeft}px`;
    wrapper.style.top = `${nextTop}px`;
    wrapper.style.right = "auto";
    wrapper.style.bottom = "auto";
  });

  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    wrapper.releasePointerCapture(e.pointerId);
    wrapper.style.zIndex = "";
    if (!moved) {
      // A real click (no meaningful movement) — toggle this doodle's blurb.
      const isOpen = !blurb.classList.contains("hidden");
      closeAllBlurbs(container);
      blurb.classList.toggle("hidden", isOpen);
    }
  };

  wrapper.addEventListener("pointerup", endDrag);
  wrapper.addEventListener("pointercancel", endDrag);

  return wrapper;
}

export function renderHeroDoodles(): void {
  const container = document.getElementById("hero-doodles");
  if (!container) return;

  for (const doodle of DOODLES) {
    container.append(renderDoodle(doodle, container));
  }

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Node) || !container.contains(e.target)) closeAllBlurbs(container);
  });
}
