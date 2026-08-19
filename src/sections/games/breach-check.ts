import { el } from "../../lib/dom";
import { COMMON_PASSWORDS } from "./breach-data";

interface Strength {
  bits: number;
  label: string;
  color: string;
  widthPct: number;
}

function poolSize(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  return pool;
}

/** A simple, honest approximation: entropy = length * log2(character pool
 * size). This assumes random generation from the detected pool — a real
 * human-chosen password is usually *much* weaker than this number implies,
 * which is exactly why the common-password check below matters more. */
function estimateBits(password: string): number {
  const pool = poolSize(password);
  if (pool === 0 || password.length === 0) return 0;
  return password.length * Math.log2(pool);
}

function classify(bits: number): Strength {
  if (bits < 28) return { bits, label: "Very Weak", color: "bg-cyber-danger", widthPct: 15 };
  if (bits < 40) return { bits, label: "Weak", color: "bg-cyber-warn", widthPct: 35 };
  if (bits < 60) return { bits, label: "Fair", color: "bg-cyber-accent2", widthPct: 60 };
  if (bits < 80) return { bits, label: "Strong", color: "bg-cyber-accent", widthPct: 85 };
  return { bits, label: "Very Strong", color: "bg-cyber-accent", widthPct: 100 };
}

const AGE_OF_UNIVERSE_SECONDS = 13.8e9 * 60 * 60 * 24 * 365;

const PLURALS: Record<string, string> = { century: "centuries" };

function pluralize(name: string, value: number): string {
  if (value < 2) return name;
  return PLURALS[name] ?? `${name}s`;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 1) return "instantly";
  if (seconds > AGE_OF_UNIVERSE_SECONDS) return "longer than the age of the universe";

  const units: [string, number][] = [
    ["century", 60 * 60 * 24 * 365 * 100],
    ["year", 60 * 60 * 24 * 365],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  for (const [name, unitSeconds] of units) {
    const value = seconds / unitSeconds;
    if (value >= 1) {
      const rounded = value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(1);
      return `~${rounded} ${pluralize(name, value)}`;
    }
  }
  return "instantly";
}

function crackTime(bits: number, guessesPerSecond: number): string {
  // Average case: attacker finds it after searching half the keyspace.
  const seconds = Math.pow(2, bits) / 2 / guessesPerSecond;
  return formatDuration(seconds);
}

export function mountBreachCheck(container: HTMLElement): void {
  const input = el("input", {
    className: "w-full border border-cyber-border bg-cyber-bg px-3 py-3 font-mono text-lg text-cyber-text focus:border-cyber-accent focus:outline-none",
    attrs: { type: "text", placeholder: "Type a *practice* password here...", autocomplete: "off", spellcheck: false },
  }) as HTMLInputElement;

  const barFill = el("div", { className: "h-full w-0 bg-cyber-danger transition-all duration-200" });
  const bar = el("div", { className: "mt-3 h-3 w-full overflow-hidden border border-cyber-border bg-cyber-bg2", children: [barFill] });
  const label = el("p", { className: "mt-2 text-sm font-semibold text-cyber-text-dim", text: "Start typing to see a live estimate." });

  const commonWarning = el("p", { className: "mt-3 hidden border border-cyber-danger bg-cyber-danger/10 px-3 py-2 text-sm text-cyber-danger" });

  const fastRow = el("p", { className: "text-sm text-cyber-text-dim" });
  const slowRow = el("p", { className: "text-sm text-cyber-text-dim" });
  const scenarios = el("div", { className: "mt-4 space-y-1 border-t border-cyber-border pt-4", children: [fastRow, slowRow] });

  const tips = el("ul", { className: "mt-4 list-disc space-y-1 pl-5 text-sm text-cyber-text-dim" });

  function update() {
    const value = input.value;
    const bits = estimateBits(value);
    const isCommon = value.length > 0 && COMMON_PASSWORDS.has(value.toLowerCase());
    const strength = classify(isCommon ? 0 : bits);

    barFill.className = `h-full transition-all duration-200 ${strength.color}`;
    barFill.style.width = value.length === 0 ? "0%" : `${strength.widthPct}%`;
    label.textContent = value.length === 0 ? "Start typing to see a live estimate." : `${strength.label} · ~${Math.round(bits)} bits estimated`;

    commonWarning.classList.toggle("hidden", !isCommon);
    if (isCommon) {
      commonWarning.textContent = "⚠ This is one of the most common passwords in the world — it would be tried in the first few seconds of any real attack, no matter how it 'looks'.";
    }

    if (value.length === 0) {
      fastRow.textContent = "";
      slowRow.textContent = "";
      tips.replaceChildren();
      return;
    }

    const effectiveBits = isCommon ? 0 : bits;
    fastRow.textContent = `Fast offline attack (~10 billion guesses/sec): ${crackTime(effectiveBits, 1e10)}`;
    slowRow.textContent = `Slow, properly-hashed login (~10 guesses/sec): ${crackTime(effectiveBits, 10)}`;

    const tipList: string[] = [];
    if (value.length < 12) tipList.push("Length matters more than complexity — aim for 12+ characters.");
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) tipList.push("Mix uppercase and lowercase letters.");
    if (!/[0-9]/.test(value)) tipList.push("Add a number or two.");
    if (!/[^a-zA-Z0-9]/.test(value)) tipList.push("Add a symbol — it widens the character pool an attacker must search.");
    if (isCommon) tipList.push("Avoid real words, names, and anything on a common-password list — use a passphrase of unrelated words instead.");
    if (tipList.length === 0) tipList.push("Looking solid! A password manager can generate and remember something even stronger.");
    tips.replaceChildren(...tipList.map((t) => el("li", { text: t })));
  }

  input.addEventListener("input", update);

  container.replaceChildren(
    el("h3", { className: "text-lg font-semibold text-cyber-accent", text: "Breach Check" }),
    el("p", { className: "mt-2 text-sm text-cyber-text-dim", text: "A live password strength / crack-time estimator. Nothing you type here ever leaves your browser — it isn't logged, stored, or sent anywhere. (Please don't type a real password — use a throwaway example.)" }),
    input,
    bar,
    label,
    commonWarning,
    scenarios,
    tips,
  );
}
