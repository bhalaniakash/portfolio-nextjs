# Akash Bhalani: portfolio

The personal portfolio of Akash Bhalani, a full stack web developer in Ahmedabad. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP with ScrollTrigger, Motion and Lucide.

This project lives next to the original site in `../bhalaniakash.github.io`. That original site is unchanged.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, all routes prerendered
npm run start      # serve the production build
npm run lint
```

Requires Node.js 20.9 or newer. Developed on Node 24.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, about, selected work (pinned horizontal gallery), WalletWise architecture, experience, skills ecosystem, certifications, contact |
| `/projects/walletwise` | Case study |
| `/projects/realtime-chat` | Case study |
| `/projects/tic-tac-toe` | Case study with an interactive rules demo |
| `/sitemap.xml`, `/robots.txt` | Generated from `app/sitemap.ts` and `app/robots.ts` |
| `/opengraph-image`, `/projects/*/opengraph-image` | Generated social cards |
| `/resume/akash-bhalani-resume.pdf` | Resume (see below) |

## Editing content

Text content lives in typed files under `data/`, separate from the components:

- `profile.ts`: name, headline, bio, facts, portrait, resume path
- `projects.ts`: `projects` are public projects with case studies (adding one creates a page, a sitemap entry and a social card). `resumeProjects` are in-house Brainer Hub projects built to office requirements for clients; the company and its clients own them, so they are text cards only.
- `experience.ts`: work history and education, from the resume. Brainer Hub: Software Engineer, Jan 2025 to present. `projects` lists in-house office projects (owned by the company and its clients).
- `skills.ts`: skill groups. Each skill has `contexts` (professional, public project, hands-on, coursework, or resume only), a short factual `note`, and optional `links` to case studies or repositories. These replace proficiency bars.
- `architecture.ts`: the WalletWise request path (nodes, connections and the numbered steps) used by the architecture diagram.
- `certifications.ts`, `social-links.ts`
- `writing.ts`: empty. Adding an article turns on the Writing section and its nav link.

Every claim in these files was checked against the resume (`data/Akash_Soni-1.pdf`), the public GitHub repositories, or Akash's direct confirmation. Please keep that standard: if something cannot be verified, leave it out.

## Configuration

| Setting | Where | Notes |
| --- | --- | --- |
| Search Console | `GOOGLE_SITE_VERIFICATION` env var | The `content` value of Google's HTML verification tag. Optional. |
| Site URL | `NEXT_PUBLIC_SITE_URL` env var | Defaults to `https://bhalaniakash.github.io`. Drives canonical URLs, sitemap, robots and Open Graph tags. Set it to the real domain before deploying. |
| Contact form | `contactEndpoint` in `lib/site.ts` | Uses the same Formspree form as the original site (`mldnlylp`). The form shows success only after Formspree confirms delivery, and otherwise shows the error with a mailto fallback. A honeypot field (`_gotcha`) filters basic spam. |

No secrets are used anywhere in the project.

## Design and architecture notes

- **Server Components by default.** Client components are limited to interactive pieces: header, hero canvas, scroll statement, parallax, skills filter, certificate dialog, contact form, reading progress and the Tic Tac Toe demo.
- **Cache Components** (Next 16 default) is on. Every page is prerendered. The footer year is a `"use cache"` component revalidated daily, because `new Date()` is not allowed in the prerendered shell.
- **Motion system.** Timing tokens live in `lib/motion.ts`. Three layers, each used where it is simplest:
  - **CSS** for entrances: hero mask lines and words, and `.reveal` with `data-reveal="left|right|scale|clip"`, driven by CSS scroll-driven animations (`animation-timeline: view()`). `--reveal-step` staggers siblings. No script touches these elements, so they cannot cause hydration mismatches; browsers without view timelines show the content in place.
  - **GSAP + ScrollTrigger** for scroll choreography. `components/motion/motion-scope.tsx` wires data attributes: `[data-hero]` (pinned hero and its exit), `[data-sheet]` (pages that turn in and make the previous page recede), and `[data-drift]` (headings that travel with the scroll). Dedicated scenes: `work-gallery.tsx` (pinned horizontal projects), `skills-ecosystem.tsx` (tiles that drop into place), `architecture-story.tsx` (diagram drawn step by step), `timeline-line.tsx`.
  - **Motion** for component state: skills detail panel, page progress bar, About word-by-word statement.
- **Pinning uses CSS `position: sticky`**, not ScrollTrigger pins, so page height is known before hydration and direct links land correctly. Scroll scenes are created in idle callbacks (`lib/idle.ts`) to keep hydration short.
- **In-page links** scroll by layout offset (`lib/scroll.ts`), because the browser's anchor scrolling measures transformed boxes while a page is mid-turn. The header highlights the section past 40% of the viewport and keeps the URL hash in step.
- Three.js is not used: every effect works with CSS transforms, SVG and canvas.
- **No-JS safety.** Reveal styles, the hero pin and the horizontal gallery apply only after an inline script adds `.js` to `<html>`. Without JavaScript every section renders fully, in a vertical layout.
- **Reduced motion.** With `prefers-reduced-motion`, nothing is pinned, the gallery becomes a vertical list, pages do not turn or recede, tiles do not fall, reveals are immediate, the canvas draws one still frame, and view transitions are instant. The pinned gallery and page turns also switch off below 1024px and 768px respectively.
- **Page transitions** use React's built-in `<ViewTransition>`. The project image morphs from the home card into the case-study hero. Routes stay ordinary links, so deep links and the back button work normally.
- **Hero visual** (`components/animations/signal-field.tsx`) is a canvas dot field. It pauses off-screen and in hidden tabs, caps device pixel ratio at 2, and reacts to the pointer only on fine-pointer devices.
- **Images** were converted to WebP with metadata stripped. The portrait was cropped, and the Tic Tac Toe screenshot was cropped to the board. The chat app has no screenshot, so it uses an SVG drawing labelled "Illustration".

## Resume

`public/resume/akash-bhalani-resume.pdf` is an unchanged copy of Akash's resume, `data/Akash_Soni-1.pdf`. To update it, replace both files (or just the one in `public/resume/`). The PDF lists the Brainer Hub title as "Full Stack Developer", while the site shows "Software Engineer" as Akash confirmed. Update the PDF so they match.

## Deploying

The site is not deployed. Choose a host first:

- **Vercel or any Node host:** works as is (`npm run build && npm run start`). Image optimisation and the security headers in `next.config.ts` apply.
- **GitHub Pages (static):** needs `output: "export"` and `images.unoptimized: true` in `next.config.ts`. Headers in `next.config.ts` do not apply on Pages, and the Cache Components setup should be tested with export before relying on it.

## Google Search Console checklist

1. Deploy, and set `NEXT_PUBLIC_SITE_URL` to the final domain.
2. In [Search Console](https://search.google.com/search-console), add a **URL prefix** property for the site address. Choose the **HTML tag** method, copy only the `content` value, set it as the `GOOGLE_SITE_VERIFICATION` environment variable in Vercel, redeploy, then click Verify. (A custom domain can use a Domain property with a DNS TXT record instead.)
3. Under **Sitemaps**, submit `https://<domain>/sitemap.xml`.
4. Use **URL Inspection** on `/` and each `/projects/...` page, and choose **Request indexing**.
5. Watch **Pages** (indexing report) for errors such as "Crawled, currently not indexed" or redirect problems.
6. Use **Performance** to see queries such as "Akash Bhalani", clicks and impressions. Data usually appears within a few days.
7. Link the new site from the GitHub profile (`blog` field), LinkedIn and X. These are the same URLs listed in the `sameAs` structured data.

Indexing and ranking have not been verified. They can only be checked after deployment.
