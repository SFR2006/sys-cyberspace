import type { MysteryCase } from "../../types/games";

// A fully fictional whodunnit — no real person, club, or place is depicted.
// "404 Not Found" and "ByteForce" are invented campus clubs; "Tea & Honey"
// is an invented café. The story is inspired by real cyberstalking/doxxing
// patterns (public-post scraping, EXIF leaks, impersonation, insider
// misuse), told as one connected case instead of a disconnected vignette.

/** Portrait photos for the chat bubbles and suspect lineup — keyed by character, not by suspect id. */
export const AVATARS: Record<string, string> = {
  nora: "/avatar-nora.png",
  priya: "/avatar-priya.png",
  devon: "/avatar-devon.png",
  sam: "/avatar-sam.png",
  suki: "/avatar-suki.png",
};

export const MYSTERY_CASE: MysteryCase = {
  title: "Who Is Ghost_Iris?",
  subtitle: "A Syberspace Mystery",
  intro:
    "Nora, a member of the campus coding club 404 Not Found, is being watched online by someone who knows too much. Work through each chapter's evidence, decode the flag hidden inside it, and once you've gathered enough, accuse the culprit in the finale.",
  chapters: [
    {
      id: "new-followers",
      number: 1,
      title: "New Followers",
      briefing:
        "Nora starts getting DMs from a brand-new account, Ghost_Iris — created two days ago, zero posts, zero followers. It already seems to know her sense of humor.",
      messages: [
        { sender: "Ghost_Iris", anonymous: true, intensity: 1, text: "just wanted to say hi 🙂 i think we'd get along" },
        { sender: "Ghost_Iris", anonymous: true, intensity: 1, text: "you always post the funniest stuff lol" },
        { sender: "Nora", avatarKey: "nora", text: "lol ok nice try, is this you being weird again Sam?" },
        { sender: "Ghost_Iris", anonymous: true, intensity: 1, text: "not who you think 🙂" },
        { sender: "Nora", avatarKey: "nora", text: "...wait who is this. do we know each other" },
      ],
      evidence: [
        "Ghost_Iris's account was created two days ago with zero followers and zero posts of its own.",
        "Everything referenced in its messages traces back to something Nora posted publicly in the last month.",
      ],
      choice: {
        label: "How is Ghost_Iris getting this information?",
        options: ["Phishing email", "Scraping her public posts (OSINT)", "A leaked database of club members", "Malware on her phone"],
        answer: "Scraping her public posts (OSINT)",
      },
      challenge: {
        category: "Crypto",
        difficulty: 1,
        data: "ZFILY{WBISPJ_PZUA_WYPCHAL}",
        answer: "SYBER{PUBLIC_ISNT_PRIVATE}",
        hint: "Every letter's shifted forward by 7 — shift each one back by 7 to decode (a Caesar cipher).",
        explainer:
          "Nothing here was 'hacked' — it was all sitting in plain sight. Public posts are exactly that: public. Ghost_Iris didn't need to break in anywhere; she just paid attention.",
      },
      taunt: "she left this scrambled note behind: \"crack it, and maybe i'll tell you who i am 🙂\"",
      clue: "Whoever this is doesn't need any special access yet — just patience and a public profile to read.",
    },
    {
      id: "the-selfie",
      number: 2,
      title: "The Selfie at Tea & Honey",
      briefing:
        "Nora posts an untagged selfie from Tea & Honey, a café near campus. An hour later, Ghost_Iris name-drops the exact place.",
      messages: [
        { sender: "Ghost_Iris", anonymous: true, intensity: 2, text: "saw you at tea & honey today, cute jacket btw" },
        { sender: "Nora", avatarKey: "nora", text: "i never said where i was. i didn't tag the location. how does she know that" },
      ],
      evidence: [
        "The selfie's image file still carried its original EXIF metadata, including embedded GPS coordinates.",
        "Those coordinates resolve to Tea & Honey's exact address.",
      ],
      choice: {
        label: "What let Ghost_Iris pinpoint her real-world location?",
        options: ["A hidden tracking cookie", "EXIF geolocation data left in the photo file", "Her phone carrier's records", "A friend tipped her off"],
        answer: "EXIF geolocation data left in the photo file",
      },
      challenge: {
        category: "Forensics",
        difficulty: 2,
        data: "selfie_final2.jpg — EXIF data\nCamera: iPhone 14 Pro\nTaken: 2026-03-14 15:22:07\nGPS: 40.7291 N, 73.9965 W\nUserComment: U1lCRVJ7TUVUQURBVEFfTkVWRVJfTElFU30=",
        answer: "SYBER{METADATA_NEVER_LIES}",
        hint: "That UserComment field isn't normal text — it's Base64. Decode it.",
        explainer:
          "Base64 isn't encryption at all — it's just a reversible way to represent binary-safe text, and anyone who looks can decode it instantly. It shows up constantly in real forensics work, hiding in plain sight inside metadata fields exactly like this one.",
      },
      taunt: '"crack this one too, if you\'re actually paying attention."',
      clue: "She's not just reading posts anymore — she's cross-referencing real-world details against them. That takes real attention, not luck.",
    },
    {
      id: "the-copycat",
      number: 3,
      title: "The Copycat DM",
      briefing:
        "A message goes out from what looks exactly like Nora's own account, asking a friend in 404 Not Found for her class schedule \"to plan a surprise.\" Nora never sent it — same name, same photo, everything.",
      messages: [
        { sender: "Nora", avatarKey: "nora", text: "hey can you send me your tues/thurs schedule again? planning something 👀" },
        { sender: "Friend", text: "omg yes obviously, here—" },
        { sender: "Nora", avatarKey: "nora", text: "wait... why do you have my profile picture? who is this?" },
        { sender: "Ghost_Iris", anonymous: true, intensity: 3, text: "your friends are so easy to fool lol" },
      ],
      evidence: [
        "The impersonating account used a near-identical username and Nora's own profile photo, copied from her public page.",
        "The friend never double-checked — the account looked right, so trust did the rest.",
      ],
      choice: {
        label: "What technique fooled Nora's friend?",
        options: ["Malware", "Account impersonation / social engineering", "A brute-forced password", "A supply-chain attack"],
        answer: "Account impersonation / social engineering",
      },
      challenge: {
        category: "Web",
        difficulty: 3,
        data: "Fragment intercepted from the impersonator's traffic:\n%53%59%42%45%52%7b%54%52%55%53%54%5f%42%55%54%5f%56%45%52%49%46%59%7d",
        answer: "SYBER{TRUST_BUT_VERIFY}",
        hint: "Every pair of digits after a % is a hex-encoded ASCII character — this is just URL (percent) encoding.",
        explainer:
          "Percent-encoding isn't meant to hide anything — it's just how URLs safely represent characters they can't use directly. Plenty of real phishing links lean on the fact that most people never bother decoding what they click.",
      },
      taunt: "\"still think you can catch me? decode this and find out.\"",
      clue: "She's confident enough now to impersonate Nora directly and fool people close to her — this isn't a stranger; she knows the friend group.",
    },
    {
      id: "the-deleted-message",
      number: 4,
      title: "The Deleted Message",
      briefing:
        "Nora deletes an old message in the club's Discord, embarrassed by an old joke. A day later, Ghost_Iris quotes it back to her, word for word.",
      messages: [{ sender: "Ghost_Iris", anonymous: true, intensity: 4, text: "delete it all you want, i already saw it. you'll never catch me" }],
      evidence: [
        "The quoted message was deleted from the channel entirely — it no longer exists in the visible chat history.",
        "404 Not Found's Discord only retains deleted messages in logs visible to server moderators.",
      ],
      choice: {
        label: "How could Ghost_Iris have seen a deleted message?",
        options: ["She guessed correctly", "Insider misuse of moderator-level access", "A phishing link Nora clicked", "A public code repository leak"],
        answer: "Insider misuse of moderator-level access",
      },
      challenge: {
        category: "Logs",
        difficulty: 4,
        data: "Recovered from the server's deleted-message cache (raw bytes):\n11 1b 00 07 10 39 03 01 01 07 11 11 1d 0b 11 1d 03 1d 15 07 03 12 0d 0c 3f",
        answer: "SYBER{ACCESS_IS_A_WEAPON}",
        hint: "Every byte was XORed with the same key byte: ASCII 'B' is 0x42.",
        explainer:
          "Fitting, given the message: getting cocky enough to quote a deleted message is exactly what narrows this down to a very short list of people — whoever this is has moderator-level access to the server's deleted-message cache, raw bytes and all.",
      },
      taunt: "\"go ahead. decode it. i already know you won't catch me.\"",
      clue: "This is the big one: only someone with moderator-level access to the 404 Not Found Discord could have seen that deleted message. That rules out anyone who isn't a mod in this server.",
    },
  ],
  suspects: [
    {
      id: "devon",
      name: "Devon Alvarez",
      role: "Former 404 Not Found co-president candidate",
      motive: "Lost the last club election to Nora and never quite let it go.",
      isCulprit: false,
      avatarKey: "devon",
      clearing:
        "Devon was traveling out of state for a family event during the Tea & Honey incident — flight records and a dozen dated photos confirm it. She's also never held a moderator role in the server.",
    },
    {
      id: "sam",
      name: "Sam Osei",
      role: "404 Not Found member, hackathon teammate",
      motive: "Publicly clashed with Nora after a hackathon loss.",
      isCulprit: false,
      avatarKey: "sam",
      clearing:
        "Server logs from the exact night of the impersonation incident show Sam actively defending Nora in the group chat, not attacking her. He's a regular member with no moderator permissions.",
    },
    {
      id: "suki",
      name: "Suki Reyes",
      role: "President of ByteForce, 404 Not Found's rival club",
      motive: "Lost last year's CTF Nationals to Nora's team by a single point.",
      isCulprit: false,
      avatarKey: "suki",
      clearing:
        "Suki's real messages are formally punctuated with no emojis — nothing like Ghost_Iris's casual, lowercase tone — and she publicly congratulated Nora's team after the loss. She was also never a member of 404 Not Found's server, so she never had access to it.",
    },
    {
      id: "priya",
      name: "Priya Chen",
      role: "404 Not Found member, handles Discord onboarding & moderation",
      motive: "Obsessive fixation — the attention and control, not revenge or money.",
      isCulprit: true,
      avatarKey: "priya",
      clearing:
        "Priya is one of the only members with moderator access to the server — able to see deleted messages. Her real messages in the club chat use the exact same lowercase, emoji-heavy tone as Ghost_Iris, down to identical typos. Each time she went further and nothing happened, she got a little more confident she'd never get caught — until quoting that deleted message gave her away.",
    },
  ],
  motiveOptions: ["Financial gain", "Personal revenge", "Obsessive fixation for attention & control", "Ideological statement"],
  correctMotive: "Obsessive fixation for attention & control",
  finaleReveal:
    "It was Priya all along. What started as reading Nora's public posts escalated step by step — a leaked location, an impersonation, and finally a message Nora thought was gone forever. Each time nothing happened, Priya got a little more confident she'd never get caught. That confidence is exactly what gave her away: quoting a deleted message only a moderator could see narrowed the entire server down to one person. Case closed.",
};
