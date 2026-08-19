# Sy's Cyberspace

Syeda Rahman's personal site — a portfolio (About, Cyber Journey, Projects, Contact) plus
**Cyberspace**, a small collection of original browser-based cybersecurity games:

- 🔐 **Cipher Terminal** — decode Caesar, Vigenère, and XOR ciphers, with a short explainer on how each one actually works.
- 🔑 **Breach Check** — a live password strength / crack-time estimator. Nothing typed there ever leaves the browser.
- 🕵️ **Case File** — a Wordle-shaped mini investigation: read the evidence, then guess the compromised asset, attack vector, threat actor, and motive behind a (fictional) incident.

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
- `public/.well-known/security.txt` gives a contact path for anyone who finds a real issue.
