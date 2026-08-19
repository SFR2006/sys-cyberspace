import type { CaseFile } from "../../types/games";

// Shared multiple-choice pools, reused across every case so the four
// dropdowns always look and behave the same way. These are entirely
// fictional scenarios — no real company, breach, or person is depicted.

const ASSET_OPTIONS = [
  "Customer database",
  "Employee email account",
  "Source code repository",
  "Point-of-sale terminals",
  "Admin credentials vault",
  "Internal employee workstation",
];

const VECTOR_OPTIONS = [
  "Phishing email",
  "Misconfigured cloud storage",
  "Insider misuse",
  "Stolen/reused password",
  "Unpatched software vulnerability",
  "Malicious USB drive",
  "Supply-chain compromise",
];

const ACTOR_OPTIONS = [
  "Opportunistic script kiddie",
  "Organized cybercrime group",
  "Nation-state actor",
  "Malicious insider",
  "Hacktivist",
];

const MOTIVE_OPTIONS = [
  "Financial gain",
  "Corporate espionage",
  "Personal grudge / revenge",
  "Ideological statement",
  "Curiosity / bragging rights",
];

function categories(asset: string, vector: string, actor: string, motive: string) {
  return [
    { key: "asset" as const, label: "Compromised Asset", options: ASSET_OPTIONS, answer: asset },
    { key: "vector" as const, label: "Attack Vector", options: VECTOR_OPTIONS, answer: vector },
    { key: "actor" as const, label: "Threat Actor", options: ACTOR_OPTIONS, answer: actor },
    { key: "motive" as const, label: "Motive", options: MOTIVE_OPTIONS, answer: motive },
  ];
}

export const CASE_FILES: CaseFile[] = [
  {
    id: "midnight-login",
    title: "The Midnight Login",
    briefing: "IT gets an alert: a login to Maria's email account at 2:47 AM from a country she's never traveled to. She swears it wasn't her.",
    evidence: [
      "The login originated from an IP address in a country Maria has never visited.",
      "Maria recalls clicking a link the day before, in an email that looked like it was from IT, asking her to 'verify her password.'",
      "The sending domain in that email was it-support-baruch-secure.com — not the real company domain.",
      "Minutes after the login, three wire transfer requests were sent from Maria's account to an external vendor.",
    ],
    categories: categories("Employee email account", "Phishing email", "Organized cybercrime group", "Financial gain"),
    resolution:
      "Maria fell for a classic phishing email spoofing IT support. Attackers harvested her password via a fake login page, then used her compromised inbox to attempt business email compromise (BEC) wire fraud.",
  },
  {
    id: "open-bucket",
    title: "The Open Bucket",
    briefing: "A security researcher emails your company: 'Your storage bucket is public and I can see everything.' You scramble to check.",
    evidence: [
      "The storage bucket's access policy was set to 'public read' during a rushed migration three weeks ago.",
      "Access logs show automated scanning tools began requesting files within 6 hours of the bucket going public.",
      "One requester downloaded the entire customer records folder in a single session.",
      "Days later, a listing appeared on an underground forum offering 'fresh customer data' for sale.",
    ],
    categories: categories("Customer database", "Misconfigured cloud storage", "Opportunistic script kiddie", "Financial gain"),
    resolution:
      "A rushed cloud migration left a storage bucket world-readable. Automated scanners — tools that constantly sweep the internet for exactly this kind of misconfiguration — found it within hours, and whoever grabbed the data tried to flip it for quick cash.",
  },
  {
    id: "departing-employee",
    title: "The Departing Employee",
    briefing: "Priya resigns on Friday. By Monday, the git logs show something odd.",
    evidence: [
      "Priya's account cloned the entire private source code repository — including archived branches she'd never worked on — the night before her last day.",
      "The download happened at 11:58 PM, outside her normal working hours.",
      "HR confirms Priya had accepted an offer from a direct competitor two weeks earlier but hadn't disclosed it.",
      "No external IP or unusual login location was involved — access came from her normal company laptop, using her own valid credentials.",
    ],
    categories: categories("Source code repository", "Insider misuse", "Malicious insider", "Corporate espionage"),
    resolution:
      "There was no 'hack' here — just a trusted insider using entirely legitimate access to take proprietary code with her to a competitor on the way out. Insider incidents like this often leave no red flags in a SIEM, because the credentials and access were completely valid.",
  },
  {
    id: "reused-password",
    title: "The Reused Password",
    briefing: "A regional retail chain notices its point-of-sale software has an admin session logged in from an unfamiliar device.",
    evidence: [
      "The login used the store manager's exact username and password for the POS admin panel.",
      "That same password appeared in a data breach dump from an unrelated shopping website two years earlier — the manager had reused it.",
      "Login attempts came in rapid bursts against hundreds of different retail chains' POS systems that same week, all testing leaked credential pairs.",
      "Once inside, the attacker installed a script to skim card numbers from every transaction.",
    ],
    categories: categories("Point-of-sale terminals", "Stolen/reused password", "Organized cybercrime group", "Financial gain"),
    resolution:
      "This is credential stuffing: attackers take passwords leaked in one breach and try them everywhere else, betting on password reuse. It worked here — a reused password from a totally unrelated site unlocked the payment system.",
  },
  {
    id: "forgotten-server",
    title: "The Forgotten Server",
    briefing: "A months-old, unpatched VPN vulnerability finally gets exploited — but not right away. The attacker waited.",
    evidence: [
      "The VPN appliance was running software with a critical vulnerability that had a patch available for 94 days before this incident.",
      "Initial access happened weeks before any suspicious activity — the attacker sat quietly, mapping the network.",
      "Eventually, the attacker pivoted to the internal credentials vault and extracted admin secrets for multiple systems.",
      "Forensics found custom-built tools with no matches in any public malware database, and infrastructure traced to state-linked hosting providers.",
    ],
    categories: categories("Admin credentials vault", "Unpatched software vulnerability", "Nation-state actor", "Corporate espionage"),
    resolution:
      "This has the hallmarks of a patient, well-resourced actor who exploited a known-but-unpatched vulnerability, then spent weeks quietly establishing persistence before going after the credentials vault. Patch management isn't glamorous, but 94 days of exposure was more than enough time.",
  },
  {
    id: "free-usb",
    title: "The Free USB",
    briefing: "Someone in accounting finds a USB drive in the parking lot labeled 'Executive Bonuses 2026.xlsx' and, well, curiosity wins.",
    evidence: [
      "The USB drive was plugged into a workstation in the finance department at 9:14 AM.",
      "The drive's only file launched a script the moment it was opened, installing a remote-access tool disguised as a font-cache updater.",
      "The malware's code contained comments protesting the company's recent layoffs, written in plain English.",
      "No data was ever offered for sale — instead, the attacker defaced three internal wiki pages with a public statement before being locked out.",
    ],
    categories: categories("Internal employee workstation", "Malicious USB drive", "Hacktivist", "Ideological statement"),
    resolution:
      "A classic USB drop attack — cheap, low-tech, and effective because curiosity beat caution. The attacker wasn't after money; the defaced wiki pages and embedded protest message point to someone making a statement about the layoffs, not a financially motivated criminal.",
  },
  {
    id: "vendors-update",
    title: "The Vendor's Update",
    briefing: "Your IT team installs what looks like a routine software update from a trusted vendor. Three days later, files across the network start getting encrypted.",
    evidence: [
      "The update, signed with the vendor's legitimate certificate, was installed on schedule by hundreds of the vendor's customers — including yours.",
      "The vendor later confirms their build server was compromised weeks earlier and used to slip malicious code into that specific update.",
      "The backdoor sat dormant for four days before beginning to encrypt files and exfiltrate the customer database.",
      "A ransom note appears demanding payment in cryptocurrency, threatening to leak the stolen customer records if unpaid.",
    ],
    categories: categories("Customer database", "Supply-chain compromise", "Organized cybercrime group", "Financial gain"),
    resolution:
      "A supply-chain attack: instead of breaching your company directly, attackers compromised a trusted vendor's build pipeline and rode in through a routine, digitally-signed update. It's one of the hardest attack paths to defend against, because the update itself looked completely legitimate.",
  },
];
