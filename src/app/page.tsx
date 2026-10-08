import Link from "next/link";
import { resume as r } from "@/content/resume";
import { en as t } from "@/content/en";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import MotionControl from "@/components/MotionControl";
import Studio from "@/components/studio/Studio";

function Lines({ text }: { text: readonly string[] }) {
  return text.map((line, index) => (
    <span key={line}>
      {index > 0 && <br />}
      {line}
    </span>
  ));
}

export default function Home() {
  return (
    <div className="site-motion">
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <Header email={r.email} />
      <Studio surface="home" />
      <main id="main" tabIndex={-1}>
        <section id="home" className="hero">
          <div className="hero-copy">
            <h1>
              <Lines text={t.hero.headline} />
              <span className="role">{r.role.toUpperCase()}</span>
            </h1>
            <p className="intro">
              <Lines text={t.hero.tagline} />
            </p>
            <div className="actions">
              <a
                className="button"
                href="/resume/Iman-Hajiali-Resume.pdf"
                download
              >
                {t.download}
              </a>
              <a className="button secondary" href="#about">
                {t.hero.about}
              </a>
            </div>
          </div>
          <a href="#about" className="scroll-hint">
            {t.hero.scroll}
            <span aria-hidden="true">↓</span>
          </a>
        </section>
        <section id="about" className="section about">
          <div data-reveal>
            <p className="eyebrow">{t.about.label}</p>
            <h2>
              <Lines text={t.about.title} />
            </h2>
          </div>
          <div className="about-copy" data-reveal>
            <p className="lead">{r.introduction}</p>
            <p>{r.about}</p>
            <span className="location">
              {t.about.location} {r.location.toUpperCase()}
            </span>
          </div>
        </section>
        <section id="skills" className="section skills">
          <div className="skills-head" data-reveal>
            <p className="eyebrow">{t.skills.label}</p>
            <h2>
              <Lines text={t.skills.title} />
            </h2>
          </div>
          <div className="skills-layout">
            <div className="skill-list">
              {r.skills.map((s, i) => (
                <article data-reveal key={s.title}>
                  <span className="number">0{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <ul>
                      {s.items.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="experience" className="section experience">
          <p className="eyebrow" data-reveal>
            {t.experience.label}
          </p>
          <h2 data-reveal>
            <Lines text={t.experience.title} />
          </h2>
          <div className="timeline">
            {r.experience.map((e, i) => (
              <article key={e.company} data-reveal>
                <div className="timeline-index">0{i + 1}</div>
                <div>
                  <p className="muted">{e.category}</p>
                  <h3>{e.company}</h3>
                  <p className="job-role">{e.role}</p>
                </div>
                <div>
                  {e.date && <p className="date">{e.date}</p>}
                  <p>{e.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="foundations" className="section foundations">
          <div data-reveal>
            <p className="eyebrow">{t.foundations.label}</p>
            <h2>
              <Lines text={t.foundations.title} />
            </h2>
          </div>
          <div className="education" data-reveal>
            <p className="eyebrow">{t.foundations.education}</p>
            <h3>{r.education.title}</h3>
            <p>{r.education.school}</p>
            <p>
              {r.education.years} · {t.foundations.graduated}
            </p>
            <div className="languages">
              {r.languages.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
        </section>
        <section id="work" className="section work">
          <div className="section-top" data-reveal>
            <div>
              <p className="eyebrow">{t.work.label}</p>
              <h2>{t.work.title}</h2>
            </div>
            <p>
              <Lines text={t.work.description} />
            </p>
          </div>
          <div className="projects">
            {r.projects.map((p, i) => (
              <Link
                href={`/work/${p.slug}`}
                className={`project project-${i}`}
                key={p.slug}
                data-reveal
              >
                <div className="project-cover">
                  <span className="project-no">0{i + 1}</span>
                  <span className="project-word">
                    {i === 0 ? "Shandana." : i === 1 ? "NOURCHI" : "IMAN."}
                  </span>
                  <span className="project-category">{p.type}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <span className="project-link">{t.work.explore}</span>
              </Link>
            ))}
          </div>
        </section>
        <section id="contact" className="section contact">
          <div className="contact-scene" aria-hidden="true" />
          <div className="contact-content">
            <p className="eyebrow" data-reveal>
              {t.ending.label}
            </p>
            <h2 data-reveal>
              <Lines text={t.ending.title} />
            </h2>
            <a className="email" href={`mailto:${r.email}`}>
              {r.email}
            </a>
            <div className="actions">
              <a
                className="button"
                href={r.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {t.ending.linkedin}
              </a>
              <a
                className="button secondary"
                href="/resume/Iman-Hajiali-Resume.pdf"
                download
              >
                {t.download}
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <span>
          © {new Date().getFullYear()} {r.name}
        </span>
        <a href="#home">{t.footer.top}</a>
        <MotionControl />
      </footer>
      <Reveal />
    </div>
  );
}
