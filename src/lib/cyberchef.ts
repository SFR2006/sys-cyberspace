/** Deep-links to CyberChef (gchq.github.io/CyberChef) — the actual tool security
 * analysts reach for — with the puzzle's raw data pre-loaded as Input and the
 * Recipe pane left empty. Deliberately doesn't pick an operation: figuring out
 * which one applies (ROT13/Caesar Brute Force, From Base64, URL Decode, XOR
 * Brute Force, ...) is the point, same as it would be for a real analyst. Offered
 * as an optional extra alongside the in-page hint, not a shortcut — solving the
 * puzzle here still requires typing the decoded answer back in.
 *
 * Verified by actually opening a constructed link fresh in CyberChef and
 * confirming Input populates with the Recipe pane empty — not assumed. */
export function cyberChefUrl(ciphertext: string): string {
  const input = encodeURIComponent(btoa(ciphertext));
  return `https://gchq.github.io/CyberChef/#input=${input}`;
}
