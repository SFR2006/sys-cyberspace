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

export type CaseCategoryKey = "asset" | "vector" | "actor" | "motive";

export interface CaseCategory {
  key: CaseCategoryKey;
  label: string;
  /** Multiple-choice pool, including the correct answer. */
  options: string[];
  answer: string;
}

export interface CaseFile {
  id: string;
  title: string;
  briefing: string;
  /** Evidence lines, revealed one at a time as attempts are used. */
  evidence: string[];
  categories: CaseCategory[];
  /** The "what really happened" narrative, revealed once the case is closed. */
  resolution: string;
}

export interface CaseGuess {
  values: Partial<Record<CaseCategoryKey, string>>;
  results: Partial<Record<CaseCategoryKey, boolean>>;
}
