export type ProjectLinkKind = "live" | "npm" | "source" | "dataset";

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

export type ProjectStatus = "shipped" | "experiment";

export interface SmallProject {
  readonly name: string;
  readonly summary: string;
  readonly stack: readonly string[];
  readonly status: ProjectStatus;
  /** When set, the project name links here. */
  readonly href?: string;
}

export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: "pripremi",
    name: "pripremi.rs",
    kind: "live SaaS",
    summary:
      "Lesson plans for Serbian primary school teachers, generated in about 2 minutes. I built and run all of it: generation across OpenAI and Gemini with a quality gate and failover, the API, local card payments through OTP Bank (in final testing), and distribution through teacher communities. My own eval harness picks the models on cost per valid document, and 2,700+ tests run on every change, plus a live smoke test against production.",
    hardPart:
      "Building card payments straight through a local bank, with no Stripe-style layer in between. The bank reports a payment through browser redirects and server callbacks, and the design assumes any of them can arrive late, twice or not at all. Every path settles through one exactly-once claim on the payment record, subscription writes are ordered by event time, and a job every 15 minutes settles anything the callbacks missed. Failure cases log named markers like STUCK PAYMENT and AMOUNT MISMATCH, so they're searchable instead of silent.",
    stack: ["React", "TypeScript", "Express", "MongoDB", "OpenAI", "Gemini", "OTP Bank"],
    links: [{ kind: "live", href: "https://pripremi.rs" }],
    note: "source private, happy to walk through it",
  },
  {
    id: "vir",
    name: "vir",
    kind: "open source · npm",
    summary:
      "Turns Claude Code and Codex session transcripts into a local, plain-markdown knowledge base and serves it back to the agent mid-session over MCP, so past decisions get consulted instead of rediscovered. Listed on awesome-claude-code, with 1,400+ tests, 60+ npm releases and an Obsidian plugin in the community directory with 180+ downloads.",
    hardPart:
      "Keeping signal above noise without burning money. Of 1,386 transcripts on my machine, only 410 were worth a note. A heuristic pre-filter runs before any LLM call, Haiku classifies and drops anything at or below 0.6 confidence, and only survivors reach the expensive distill step, routed to Haiku or Sonnet by category and size. Stripping tool output cut one 517-call session from about 217k to 95k input tokens. Its own retrieval eval later switched off a reranking default I had shipped, because it made search worse.",
    stack: ["TypeScript", "Node.js", "SQLite", "MCP", "Anthropic API", "Ollama"],
    links: [
      { kind: "live", href: "https://virwiki.dev" },
      { kind: "npm", href: "https://www.npmjs.com/package/@djolex999/vir-cli" },
      { kind: "source", href: "https://github.com/djolex999/vir" },
    ],
  },
  {
    id: "serbeval",
    name: "serbeval",
    kind: "open source · benchmark",
    summary:
      "A public benchmark for how well language models handle Serbian: grammar, pravopis, the aorist, jat, č/ć and Cyrillic/Latin consistency, the things translated English tests can't check. The official set has 351 items checked against Pravopis 2010, 30 models are on the leaderboard, and I opened a PR to add it to EleutherAI's lm-evaluation-harness (not merged yet). After public feedback that it had become too easy, v2 added 76 verified whole-passage corrections.",
    hardPart:
      "Trusting the answer key. The first version had gold answers that contradicted their own explanations, so every changed answer was checked against the text of Pravopis 2010, and every spelling answer against its dictionary. Every gold error found so far sat where strong models disagreed, so those disagreements became the list to check by hand. Where the authorities themselves disagree, like foto-aparat and fotoaparat, both spellings count.",
    stack: ["Python", "lm-evaluation-harness", "pytest", "OpenRouter", "Hugging Face"],
    links: [
      { kind: "source", href: "https://github.com/djolex999/serbeval" },
      { kind: "dataset", href: "https://huggingface.co/datasets/djolex999/serbeval" },
    ],
  },
];

export const smallProjects: readonly SmallProject[] = [
  {
    name: "GrowthQ",
    summary:
      "An AI content product from GrowthQ Lab, the studio I co-founded in 2025: branded social media content generated from a per-brand profile. Selected for NTP Niš Launcher (7 of 108 teams), grant-funded, and pitched to investors at Web Summit Lisbon (2025) and GITEX Europe Berlin (2026). A US-market version is in development.",
    stack: ["React", "TypeScript", "Express", "MongoDB", "OpenAI", "Kie.ai"],
    status: "shipped",
    href: "https://growthq.rs",
  },
  {
    name: "sterija",
    summary:
      "A bilingual site with Maru, a Claude-powered chat assistant that reserves its worst-case cost before answering, keeps a per-IP daily budget and rate limit, and is checked by an eval suite.",
    stack: ["Astro", "Cloudflare Workers", "Claude API"],
    status: "shipped",
  },
  {
    name: "Fokus",
    summary:
      "An always-on-top desktop focus timer with a floating widget and global-shortcut capture, released in 14 versions for macOS and Windows.",
    stack: ["Tauri", "Rust", "React", "SQLite"],
    status: "shipped",
    href: "https://github.com/djolex999/fokus",
  },
  {
    name: "angler",
    summary:
      "A photo-culling tool I'm building for The Next Angle, a photo and video studio I invest in. An offline Python CLI scores shots on faces, sharpness, exposure and bursts and writes Lightroom ratings as XMP sidecars.",
    stack: ["Python", "OpenCV", "ONNX Runtime"],
    status: "experiment",
  },
];
