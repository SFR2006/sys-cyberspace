// Shared type definitions for the three Syberspace games.

export type CipherType = "caesar" | "vigenere" | "xor";

export interface CipherPuzzle {
  id: string;
  type: CipherType;
  difficulty: 1 | 2 | 3;
  /** The encoded string shown to the player. */
  ciphertext: string;
  /** The plaintext answer, compared case-insensitively with whitespace trimmed. */
  answer: string;
  /** A gentle nudge, shown on request without giving away the answer. */
  hint: string;
  /** Shown after solving — a short explanation of how the cipher works. */
  explainer: string;
}

// ---------------------------------------------------------------------
// Case File: a single connected whodunnit ("Who Is Ghost_Iris?"), told
// across linked chapters instead of disconnected one-off vignettes. Each
// chapter reveals a technique (not a suspect) via chat-log evidence and an
// encoded flag — each chapter a different CTF category, escalating in
// difficulty; the "who" is only decided in the finale lineup, once every
// chapter's clue has narrowed the suspect pool.
// ---------------------------------------------------------------------

export interface ChatMessage {
  sender: string;
  text: string;
  /** True for messages from the anonymous stalker persona — styled with a
   * ghost avatar, tinted more intense as her confidence escalates. */
  anonymous?: boolean;
  /** 1-4, escalating boldness across the case; only meaningful when `anonymous`. */
  intensity?: 1 | 2 | 3 | 4;
  /** Key into the AVATARS photo map (see mystery-data.ts) — when set, shows a real
   * portrait instead of the initial-letter/ghost fallback. Used to make the ch.3
   * impersonation genuinely indistinguishable from Nora's own messages. */
  avatarKey?: string;
}

export interface MysteryChoice {
  label: string;
  options: string[];
  answer: string;
}

/** Each chapter's flag challenge is a different real CTF category — not
 * the same cipher four times — escalating in difficulty as the case
 * goes on: Crypto → Forensics → Web → Logs. */
export type ChallengeCategory = "Crypto" | "Forensics" | "Web" | "Logs";

export interface ChapterChallenge {
  category: ChallengeCategory;
  difficulty: 1 | 2 | 3 | 4;
  /** The raw block shown to the player — ciphertext, an EXIF dump, an encoded fragment, raw hex. */
  data: string;
  /** The decoded flag, compared case-insensitively with whitespace trimmed. */
  answer: string;
  hint: string;
  explainer: string;
}

export interface MysteryChapter {
  id: string;
  number: number;
  title: string;
  briefing: string;
  messages: ChatMessage[];
  /** Plain investigative facts, shown alongside the chat log. */
  evidence: string[];
  /** "What technique was this?" — the one guessable category per chapter. */
  choice: MysteryChoice;
  /** Crack this to reveal the chapter's flag. */
  challenge: ChapterChallenge;
  /** Ghost_Iris's own taunt, daring the player to decode her message — escalates with her confidence. */
  taunt: string;
  /** Suspect-board clue unlocked once the chapter is fully solved. */
  clue: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  motive: string;
  isCulprit: boolean;
  /** Why they're cleared (red herrings) or how they're confirmed (the culprit) — shown after the accusation. */
  clearing: string;
  /** Key into the AVATARS photo map (see mystery-data.ts). */
  avatarKey: string;
}

export interface MysteryCase {
  title: string;
  subtitle: string;
  /** A short, first-person note from the site's author, framing why this
   * particular case exists — shown above the in-universe briefing. */
  authorNote: string;
  intro: string;
  chapters: MysteryChapter[];
  suspects: Suspect[];
  motiveOptions: string[];
  correctMotive: string;
  finaleReveal: string;
}
