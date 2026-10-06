export const site = {
  url: "https://djmarkovic.com",
  name: "Djordje Marković",
  role: "Full-stack & AI engineer",
  location: "Belgrade, Serbia",
  description:
    "Djordje Marković, full-stack and AI engineer in Belgrade. Shipped products, open-source LLM tooling, and notes on the hard parts.",
  repo: "https://github.com/djolex999/djmarkovic.com",
  // Set to "/cv.pdf" once public/cv.pdf exists.
  cv: null,
  contact: {
    email: "djordje@djmarkovic.com",
    github: "https://github.com/djolex999",
    linkedin: "https://www.linkedin.com/in/djmarkovic",
  },
} as const satisfies {
  url: string;
  name: string;
  role: string;
  location: string;
  description: string;
  repo: string;
  cv: `/${string}.pdf` | null;
  contact: { email: string; github: string; linkedin: string };
};
