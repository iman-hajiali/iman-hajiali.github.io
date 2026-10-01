// Interface copy is separate from resume facts and scene choreography.
// Future Persian dictionaries should share these keys and supply lang/dir routing.
export const en = {
  navigation: [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#work", label: "Work" },
  ],
  skip: "Skip to content",
  menu: "Menu",
  closeMenu: "Close",
  contact: "Get in touch",
  download: "Download Resume",
  hero: {
    headline: ["Iman", "Hajiali"],
    tagline: ["Thoughtful design.", "Built for people."],
    about: "About me",
    scroll: "SCROLL TO MEET ME",
  },
  about: {
    label: "01 / ABOUT ME",
    title: ["Good design starts", "with understanding."],
    location: "BASED IN",
  },
  skills: {
    label: "02 / WHAT I BRING",
    title: ["From a first thought", "to a working experience."],
    fallback: "Sketch. Refine. Build.",
  },
  experience: {
    label: "03 / THE JOURNEY SO FAR",
    title: ["Learning by making.", "Growing through collaboration."],
  },
  foundations: {
    label: "04 / FOUNDATIONS",
    title: ["A design perspective.", "A technical foundation."],
    education: "EDUCATION",
    graduated: "Graduated",
  },
  work: {
    label: "05 / SELECTED WORK",
    title: "A closer look.",
    description: [
      "Three projects.",
      "Different challenges, thoughtful decisions.",
    ],
    explore: "Explore project",
  },
  ending: {
    label: "LET’S TALK",
    title: ["Something good", "starts with hello."],
    linkedin: "LinkedIn",
  },
  footer: { top: "Back to top ↑", credit: "Designed with care." },
} as const;
