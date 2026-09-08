# Syberspace

Syeda Rahman's personal site — a portfolio (About, Cyber Journey, Projects, Contact) plus
**Syberspace**, a small collection of original browser-based cybersecurity games:

- 🔐 **Cipher Terminal** — decode Caesar, Vigenère, and XOR ciphers, with a short explainer on how each one actually works.
- 🔑 **Breach Check** — a live password strength / crack-time estimator that also checks Have I Been Pwned's real breach database via k-anonymity (only a 5-character hash prefix is ever sent — never the password).
- 🕵️ **Case File** — "Who Is Ghost_Iris?", a connected whodunnit told across linked chapters: read the evidence, crack an escalating series of CTF-style flags (Crypto → Forensics → Web → Logs), and accuse the culprit in the finale lineup. Entirely fictional.

## Stack

Vite + TypeScript + Tailwind CSS v4, no framework, no backend. Deploys as a static site
(free on Vercel's Hobby tier) — the contact form is a `mailto:` link, so there are no
API keys or server endpoints to protect in the first place.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # type-checks, then builds to dist/
npm run preview   # serve the production build locally
```

## Security notes

- `vercel.json` sets a strict Content-Security-Policy (no `unsafe-inline` for scripts
  *or* styles), plus the usual hardening headers (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS).
- All dynamic content is inserted via `textContent`/DOM APIs (see `src/lib/dom.ts`) —
  `innerHTML` is never used with data that originated from user input.
- The one intentional outbound request is Breach Check's live HIBP lookup
  (`connect-src` allowlists `api.pwnedpasswords.com` specifically) — it uses the
  Pwned Passwords "range" API's k-anonymity model, so only a 5-character hash
  prefix ever leaves the browser, never the password or its full hash.
- `public/.well-known/security.txt` gives a contact path for anyone who finds a real issue.
