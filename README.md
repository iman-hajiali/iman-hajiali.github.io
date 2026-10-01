# Iman Hajiali — Interactive Resume

This repository contains the English-first, resume-focused 3D portfolio and
the GitHub Pages deployment workflow. The 3D scene is optional to reading the
resume: the essential content is prerendered as HTML.

For local development, run `npm ci` and `npm run dev`. Open
http://localhost:3000. To use another port, run `npm run dev -- -p 3001`.

Quality checks: `npm run typecheck`, `npm run build`, then `npm test`. Static output is generated in `out/`. This project uses static export, so it intentionally does not use `next start`. Use the development server for local review; use a static host for `out/` at release time.

Code formatting: `npm run format` / `npm run format:check`.

## Editing

- Resume and project content: `src/content/resume.ts`
- Home-page interface copy and navigation labels: `src/content/en.ts`
- Responsive accessible navigation: `src/components/Header.tsx` and its CSS Module
- Central visual tokens and responsive layouts: `src/app/globals.css`
- Home page: `src/app/page.tsx`
- Project detail routes: `src/app/work/[slug]/page.tsx`
- Full-screen CRT loader and scene: `src/components/studio/`
- Optimized web character: `public/models/iman-scroll-character-optimized.glb`
- Character optimization and geometry diagnostics: `scripts/`
- Motion and camera study: `/studio-preview` (`src/app/studio-preview/page.tsx`)
- Downloadable resume: `public/resume/Iman-Hajiali-Resume.pdf`

## Current milestone

The revised 3D studio remains behind accessible HTML content. A lightweight,
full-screen loader covers the page until the entire scene is ready; a timeout
restores access to the resume if WebGL or asset loading fails. The current rig
does not support independent finger articulation. Project detail pages are
factual summaries, not completed case studies. Final project screenshots are
still needed. No Lighthouse score is claimed without measurement.

## Next milestone

Measure performance on desktop and mobile, then tune further as needed.
Independent finger movement would need a richer rig or shape keys. Confirm
missing project dates rather than inventing them.

Content is separated from presentation. The home-page UI has an English dictionary; project-page copy and resume data still need locale dictionaries when adding Persian. Future localization should add language route selection with corresponding lang/dir metadata. English is the only implemented language.

The GitHub Actions workflow builds and deploys the static export on pushes to
`main`. Modeling experiments and editable source models remain local and are
not included in this public repository.
