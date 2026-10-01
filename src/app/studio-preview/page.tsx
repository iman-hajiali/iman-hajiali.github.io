import Link from "next/link";
import Studio from "@/components/studio/Studio";
import "../studio-layout.css";

export const metadata = {
  title: "Camera study — Iman Hajiali",
  robots: { index: false, follow: false },
};

const chapters = [
  {
    id: "home",
    label: "01 / OPENING",
    title: "Iman Hajiali.",
    body: "Product Designer. Start behind the character, then scroll around the desk to meet him.",
  },
  {
    id: "about",
    label: "02 / THE TURN",
    title: "Meet Iman.",
    body: "The camera reaches the front of the desk as the character turns his attention toward the visitor.",
  },
  {
    id: "skills",
    label: "03 / SKILLS",
    title: "Ideas take shape.",
    body: "Iman leaves the desk and guides us into a new space. He points toward the interface pieces taking shape.",
  },
  {
    id: "experience",
    label: "04 / EXPERIENCE",
    title: "A story of making.",
    body: "Project memories emerge from the workspace while the camera shifts around them.",
  },
  {
    id: "foundations",
    label: "05 / FOUNDATIONS",
    title: "A fresh perspective.",
    body: "An overhead view reveals the notebook and the foundation behind the work.",
  },
  {
    id: "work",
    label: "06 / SELECTED WORK",
    title: "A closer look.",
    body: "Three project displays emerge as the story reaches the selected work.",
  },
  {
    id: "contact",
    label: "07 / CONTACT",
    title: "Let’s connect.",
    body: "Return to a welcoming view of the studio, with a small wave from the character.",
  },
];

export default function StudioPreview() {
  return (
    <main id="main" className="studio-preview">
      <div className="preview-header">
        <Link href="/">← Back to resume</Link>
        <span>Camera study · rigged character review</span>
      </div>
      <Studio />
      {chapters.map((chapter) => (
        <section id={chapter.id} key={chapter.id} className="preview-step">
          <div className="preview-copy">
            <p className="eyebrow">{chapter.label}</p>
            <h1>{chapter.title}</h1>
            <p>{chapter.body}</p>
          </div>
        </section>
      ))}
    </main>
  );
}
