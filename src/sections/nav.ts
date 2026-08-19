/**
 * Highlights the nav link for whichever section is currently in view.
 * Smooth scrolling itself is handled purely by CSS (`scroll-behavior:
 * smooth` + native anchor links) — no click handling needed here.
 */
export function initNav(): void {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>(".nav-link").forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    if (id) links.set(id, link);
  });

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0) return;

  const setActive = (id: string) => {
    for (const [linkId, link] of links) {
      link.classList.toggle("opacity-100", linkId === id);
      link.classList.toggle("font-semibold", linkId === id);
      link.classList.toggle("opacity-70", linkId !== id);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  sections.forEach((section) => observer.observe(section));
}
