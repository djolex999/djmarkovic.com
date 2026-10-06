export type ProjectLinkKind = "live" | "npm" | "source";

export interface ProjectLink {
  readonly kind: ProjectLinkKind;
  readonly href: string;
}

export interface FeaturedProject {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly summary: string;
  readonly hardPart?: string;
  readonly stack: readonly string[];
  readonly links: readonly ProjectLink[];
  /** Shown in place of a source link, e.g. "source private". */
  readonly note?: string;
}

export interface SmallProject {
  readonly name: string;
  readonly summary: string;
  readonly stack: readonly string[];
  /** When set, the project name links here. */
  readonly href?: string;
}

export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: "pripremi",
    name: "pripremi.rs",
    kind: "live SaaS",
    summary:
      "Lesson plans for Serbian primary school teachers, generated in seconds. I built and run all of it: the generation pipeline, the API, Paddle subscriptions priced for the local market, and distribution through teacher communities.",
    stack: ["React", "Express", "MongoDB", "Claude API", "Paddle"],
    links: [{ kind: "live", href: "https://pripremi.rs" }],
    note: "source private, happy to walk through it",
  },
  {
    id: "vir",
    name: "vir",
    kind: "open source · npm",
    summary:
      "Turns Claude Code session transcripts into a local, plain-markdown knowledge base and serves it back to the agent mid-session over MCP, so past decisions get consulted instead of rediscovered.",
    hardPart:
      "Keeping signal above noise without burning money. Of 1,386 transcripts on my machine, only 410 were worth a note. A heuristic pre-filter runs before any LLM call, Haiku classifies and drops anything at or below 0.6 confidence, and only survivors reach the expensive distill step, routed to Haiku or Sonnet by category and size. Stripping tool output cut one 517-call session from about 217k to 95k input tokens.",
    stack: ["TypeScript", "Node.js", "MCP", "Anthropic API", "Ollama"],
    links: [
      { kind: "live", href: "https://virwiki.dev" },
      { kind: "npm", href: "https://www.npmjs.com/package/@djolex999/vir-cli" },
      { kind: "source", href: "https://github.com/djolex999/vir" },
    ],
  },
];

export const smallProjects: readonly SmallProject[] = [
  {
    name: "Sift",
    summary: "A Telegram bot that turns anything you send it into a searchable digest.",
    stack: ["Django", "Next.js"],
  },
  {
    name: "Novera",
    summary:
      "A node-based AI image studio; pipelines are drawn as graphs and run through a job queue.",
    stack: ["React Flow", "BullMQ"],
  },
  {
    name: "GrowthQ",
    summary:
      "co-founded; AI social media content for small businesses, generated from a per-brand profile. Selected for NTP Niš Launcher (7 of 108 teams), grant-funded.",
    stack: ["Node.js", "LLM + image models"],
    href: "https://ntp.rs/en/aktuelnosti/5552/",
  },
  {
    name: "Fokus",
    summary: "An always-on-top desktop focus widget with global-shortcut capture.",
    stack: ["Tauri", "SQLite"],
  },
  {
    name: "Serbian TTS pipeline",
    summary:
      "Transcription, LLM text cleanup, SSML markup and voice synthesis for long-form audio.",
    stack: ["Whisper", "Claude", "ElevenLabs"],
  },
];
