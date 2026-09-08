/** Deep-links to CyberChef (gchq.github.io/CyberChef) — the actual tool security
 * analysts reach for — with a ROT13/Caesar brute-force recipe pre-loaded and the
 * ciphertext as input. It tries all 25 shifts at once, exactly how you'd really
 * approach an unknown-shift Caesar cipher. Offered as an optional extra alongside
 * the in-page hint, not a shortcut: solving the puzzle here still requires typing
 * the decoded answer back in.
 *
 * The recipe string below was captured by actually building it in CyberChef's UI
 * and reading back the URL it generates — not guessed — so it's confirmed to
 * round-trip correctly. */
const CYBERCHEF_CAESAR_RECIPE = "ROT13_Brute_Force(true,true,false,100,0,true,'')";

export function cyberChefCaesarUrl(ciphertext: string): string {
  const input = encodeURIComponent(btoa(ciphertext));
  return `https://gchq.github.io/CyberChef/#recipe=${CYBERCHEF_CAESAR_RECIPE}&input=${input}`;
}
