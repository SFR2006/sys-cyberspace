import type { CipherPuzzle } from "../../types/games";

export const CIPHER_PUZZLES: CipherPuzzle[] = [
  {
    id: "caesar-1",
    type: "caesar",
    difficulty: 1,
    ciphertext: "CHUR GDB HASORLW",
    answer: "ZERO DAY EXPLOIT",
    hint: "Every letter has been shifted forward by 3 in the alphabet. Shift each one back by 3.",
    explainer:
      "A Caesar cipher shifts every letter a fixed number of places through the alphabet. With only 25 possible shifts, it's trivial to brute-force by hand — which is exactly why it's a teaching tool, not real security.",
  },
  {
    id: "caesar-2",
    type: "caesar",
    difficulty: 1,
    ciphertext: "KNWJBFQQ WZQJX",
    answer: "FIREWALL RULES",
    hint: "This one's shifted forward by 5.",
    explainer:
      "Same idea as before with a different shift value. In cryptography terms, the shift amount is the 'key' — and a keyspace of 25 is laughably small by modern standards.",
  },
  {
    id: "caesar-3",
    type: "caesar",
    difficulty: 2,
    ciphertext: "FBPVNY RATVARREVAT",
    answer: "SOCIAL ENGINEERING",
    hint: "The shift here is 13 — which makes this cipher its own inverse. Apply the same shift again to decode it.",
    explainer:
      "A shift of exactly 13 is called ROT13. Because the alphabet has 26 letters, shifting by half of that twice gets you back to the start — so encoding and decoding use the identical operation.",
  },
  {
    id: "vigenere-1",
    type: "vigenere",
    difficulty: 2,
    ciphertext: "RFJWYKLH EKVYDO",
    answer: "PHISHING ATTACK",
    hint: "The keyword is a 5-letter word for what a cybercriminal is often called: C _ _ E R.",
    explainer:
      "A Vigenère cipher repeats a keyword over the plaintext, and each keyword letter picks a different Caesar shift for that position. That variable shift is what made it resist simple frequency analysis for centuries.",
  },
  {
    id: "vigenere-2",
    type: "vigenere",
    difficulty: 3,
    ciphertext: "EBTXT ISJBSC DMAP",
    answer: "MULTI FACTOR AUTH",
    hint: "The keyword is a 6-letter word meaning a protective barrier: S _ _ E L D.",
    explainer:
      "Notice how the same plaintext letter can encode differently depending on where it falls relative to the repeating keyword — that's the whole trick behind Vigenère's extra strength over a plain Caesar shift.",
  },
  {
    id: "vigenere-3",
    type: "vigenere",
    difficulty: 3,
    ciphertext: "ZEXR ZNSMGTH UIFHIEW",
    answer: "KEEP SYSTEMS UPDATED",
    hint: "The keyword is a 5-letter word for what Tuesday updates are often called: P _ _ C H.",
    explainer:
      "This is genuinely good security advice hiding inside a cipher puzzle — most real-world breaches exploit vulnerabilities that a patch already existed for.",
  },
  {
    id: "xor-1",
    type: "xor",
    difficulty: 3,
    ciphertext: "7e 78 7f 79 7e 0a 64 65 0a 65 64 6f",
    answer: "TRUST NO ONE",
    hint: "Every byte was XORed with the same single key byte: the ASCII character '*' (0x2A). XOR each hex byte with 0x2A.",
    explainer:
      "XOR-with-a-repeating-key is the building block behind stream ciphers. A single repeated byte is extremely weak (it's crackable by frequency analysis in seconds), but the same XOR idea, done properly with a long random key, underlies real ciphers like AES-CTR.",
  },
  {
    id: "xor-2",
    type: "xor",
    difficulty: 3,
    ciphertext: "3e 3f 3c 3f 34 29 3f 5a 33 34 5a 3e 3f 2a 2e 32",
    answer: "DEFENSE IN DEPTH",
    hint: "The key byte this time is the ASCII character 'z' (0x7A).",
    explainer:
      "Layered security — the idea this phrase describes — applies to cryptography too: no single control (like a weak single-byte XOR key) should ever be your only line of defense.",
  },
];
