# Personal website refresh — execution report

**Date:** October 1, 2026

**Repository:** [nimdvir/nimdvir.github.io](https://github.com/nimdvir/nimdvir.github.io)

**Review branch:** `feat/responsive-portfolio-2026-10-01`

**Starting commit:** `ce4611700c2d2770445781c6a5e409a01373b13e`

## Outcome

Rebuilt the personal website around a responsive, shared design system inspired by the CCE 2026 website. The site presents Nim as a researcher, educator, and builder, with clearer paths into research, applied work, teaching, biography, and contact information. All 12 legacy portfolio projects now have case-study pages. The current CV is available as accessible HTML and as a downloadable public PDF.

Work is delivered on a review branch, following the repository’s branch-first preference. The production branch, deployment workflow, custom-domain arrangements, and original Drive documents are unchanged. Delivery details are recorded at the end of this report.

## Request coverage

| Requested work                        | Implementation                                                                                                                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Responsive personal website           | Fluid typography, bounded layouts, three/two/one-column grids, mobile menu, narrow-screen fixes, responsive images                                                                  |
| CCE contact information and biography | Updated introduction, current university role, professional email, office, university phone, and shared profile data                                                                |
| CCE portrait                          | Original CCE headshot copied locally to `public/images/nim-dvir-cce.jpg`                                                                                                            |
| All social links                      | Email, LinkedIn, Instagram, Google Scholar, GitHub, UAlbany faculty page, personal domain; existing ORCID, ResearchGate, and Web of Science retained; CCE repository link in footer |
| Typing effect                         | Short, single-pass homepage tagline, with complete no-JavaScript text, static screen-reader text, and reduced-motion support                                                        |
| Light/dark mode                       | System preference on first visit, explicit accessible toggle, saved preference, pre-paint initialization                                                                            |
| Sticky navigation                     | Shared sticky header, current-page state, mobile menu, Escape/outside-click/link-close behavior                                                                                     |
| Highlighted text                      | Shared yellow marker treatment plus blue-to-violet emphasis, both designed for both themes                                                                                          |
| Secret design page                    | `public/design/index.html`, served at `/design/`, unlisted, `noindex,nofollow`, excluded from sitemap                                                                               |
| All old projects                      | 12 case studies, 13 original document links, 4 prototype links, existing images plus 8 newly recovered images, legacy redirects                                                     |
| Current CV and stronger positioning   | September 16, 2026 CV incorporated into biography, appointments, research, teaching, publication records, and public CV                                                             |
| Permanent execution report            | This report, migration inventory, validation evidence, screenshots, and updated maintainer README committed with the work                                                           |

The design page is publicly reachable by its URL. “Secret” means unlisted, not authenticated or suitable for private information.

## Sources and reconciliation

1. **Existing personal-site repository**, starting commit above. Preserved Astro, the lockfile, static GitHub Pages architecture, original interview articles, analytics configuration, icons, and existing asset library.
2. **[CCE 2026 repository](https://github.com/nimdvir/cce-2026)** at `49a218727bf88d8e6ede5eec386e8f61d47235ca`. Read the introduction, biography, styles, scripts, and portrait. Adapted its blue/violet accents, theme behavior, sticky navigation, typing, highlights, and contact information into one coherent personal-site system. The reference repository was not modified.
3. **[Legacy personal website](https://www.nimdvir.com)**. Reviewed every project page, original text, embedded image references, supporting document links, and prototype URLs. The complete mapping is in [the migration inventory](../migration/2026-10-01-project-inventory.md).
4. **[CV folder supplied by Nim](https://drive.google.com/drive/folders/1ggvgIOJ_F9id8eg2pwNsABxSjc7gSYye)**. Used the September 16, 2026 Markdown and PDF versions. Original Drive permissions and content were left intact.

The current appointment is **Lecturer, August 2025–present**, following **Visiting Assistant Professor, August 2021–August 2025**. Current updates include the 2026 FRAP-B award of $3,242, the mental-health-court language collaboration, interactive database/business courseware, online BITM 330 work, student research mentoring, and CCE 2026 faculty development. The textbook retains its stated review status rather than being described as a published Cengage title.

The biography and structured data were reconciled with the CV, including education and the current role. Publication records were expanded to nine entries, with correct coauthor attribution, external links, and distinctions among papers, proceedings, dissertation, and preprints. Six supported research topics are published.

## Design and implementation

### Shared visual system

`public/styles/site.css` is the central source for tokens and component styling. Light mode uses a near-white canvas, ink text, blue and violet accents, and yellow highlights. Dark mode uses deep blue-gray surfaces, light text, and adjusted accent colors. The site uses Inter with a system-font fallback, a maximum content width of 1180px, generous spacing, modest radii, restrained borders, and clear action hierarchy.

The homepage leads with the portrait and “Technology works better with people first,” then connects methods, selected projects, research, courseware, and contact. Copy prioritizes what Nim studies, builds, and teaches. Case-study roles distinguish professional work from advised student projects. Metrics and outcomes without adequate context were not promoted as headline claims.

The public design reference demonstrates colors, type, gradients, marker text, buttons, cards, chips, filters, timelines, callouts, metrics, feature panels, contact treatments, and layout/interaction guidance. It loads the same CSS and JavaScript used by the website.

### Interaction and accessibility

- Theme choice applies before page paint, persists when storage is available, and falls back gracefully when it is not.
- Mobile navigation uses a real button, expanded state, keyboard support, and automatic closing after navigation. Without JavaScript, the navigation remains visible.
- The typing effect runs once and completes quickly. Reduced-motion users see the complete text immediately; assistive technology receives a static equivalent.
- Project filters retain all 12 entries in the document and announce the visible count.
- Shared pages include a skip link, visible focus styles, semantic landmarks, descriptive image alternatives, and appropriately sized principal controls.
- Grid changes at 960px and 650px support tablet and phone layouts. Long links/headings and the teaching metrics were adjusted after real browser overflow checks.
- Print styles and an HTML CV support reading and printing without relying on the PDF.

### CV publication

The original CV was restricted to named Drive users, so the website does not depend on a restricted Drive download. A public version was created at `/cv/` and `/files/Nim-Dvir-CV-2026-09.pdf`.

The public version uses the already-public university contact details. Personal mobile/citizenship details and referees’ private contact information were excluded; references are available on request. Duplicate or mismatched syllabus links were removed. Source statements and academic history otherwise remain the basis of the CV, with clearer publication-category labeling. The original documents were not edited or made public.

`src/data/cv-public.md` is the editable source. `scripts/build-public-cv.py` generates the 12-page PDF using ReportLab’s bundled fonts. The PDF is committed, so ordinary Astro builds do not require Python dependencies.

## Legacy content migration

The project set is Costco Mobile App, Dexcom G7+, Barrier Free Living, Nasher Sculpture Center, Golf Buddy, Fieldstones, Zang Toi, ClaimFame, Time Out Tel Aviv, Facebook Content Strategy, Trackimo, and E-Commerce Prototypes. Five previously missing entries were added, and seven existing entries were refreshed. Old `/portfolio/projects/...` paths redirect to their matching new case studies.

All 13 original supporting-document URLs and all four interactive prototype links are retained. Source documents remain with their original owners. Existing local project imagery is reused. Of 33 additional legacy image URLs attempted, **8 were recovered**, **23 returned HTTP 403**, and **2 returned HTTP 404**. Failed media references were not inserted into the new pages. This is a complete migration of the project roster and available supporting material, not a claim that every inaccessible embedded screenshot was recovered.

### Earlier unsupported drafts

Three research drafts and four essays in the starting repository contained claims that could not be substantiated from the supplied CV or original materials. Their source Markdown files remain unchanged for owner review, but they are not published as current evidence. Their old routes redirect to the research or writing index.

Research drafts: `responsible-ai-toolkits`, `behavioral-signals-in-recommendation`, `civic-tech-codesign`.

Essay drafts: `designing-ai-for-accountability`, `field-notes-from-participatory-research`, `measuring-engagement-that-matters`, `teaching-digital-citizenship-with-ai-assistants`.

The public writing/media pages instead foreground the existing, attributed journalism and six preserved interview articles. This keeps potentially useful drafts in version control without presenting unsupported firsthand studies or metrics as established accomplishments.

## Verification and evidence

| Check                     | Result                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency install        | `npm ci` completed using the existing lockfile; no manifest or lockfile changes                                                                                           |
| Production build          | `npm run build` passed; 34 Astro pages plus static compatibility/design files                                                                                             |
| Static integrity          | `python scripts/verify_site.py` passed across 62 HTML files: local targets, assets, fragments, image alternatives, landmarks, 12 projects, CV, and design-page exclusions |
| Responsive browser matrix | 35 content routes × 320/390/768/1440px × light/dark = 280 checks; no horizontal overflow after corrections                                                                |
| Browser errors            | No page JavaScript errors observed in the route matrix                                                                                                                    |
| Interaction checks        | Theme persistence, mobile menu, Escape, project filters, typing completion, sticky header, and no-JavaScript navigation/text passed                                       |
| Accessibility automation  | axe-core WCAG 2 A/AA and 2.1 AA rules on 10 representative routes in both themes: 20 scans, zero detected violations                                                      |
| PDF review                | 12 pages rendered; first page and contact sheet reviewed; every page contains text; no blank trailing page                                                                |
| Visual review             | Phone and desktop homepages in both themes, project listing, portrait/assets, and PDF layout inspected                                                                    |
| Patch hygiene             | `git diff --check` passed                                                                                                                                                 |

Browser testing used local Chromium through Playwright against the production build. The browser could load the built files through an in-process local server. The remote browser surface could not access the workspace localhost, so no hosted preview is claimed.

Evidence:

- [Responsive and interaction results](2026-10-01/browser-results.json)
- [Accessibility results](2026-10-01/accessibility-results.json)
- [Light desktop screenshot](2026-10-01/screenshots/home-light-1440.jpg)
- [Dark desktop screenshot](2026-10-01/screenshots/home-dark-1440.jpg)
- [Light phone screenshot](2026-10-01/screenshots/home-light-390.jpg)
- [Dark phone screenshot](2026-10-01/screenshots/home-dark-390.jpg)

Automated scans do not establish complete accessibility conformance. Physical-device testing, Safari/Firefox testing, and a full screen-reader audit were not performed. The PDF was visually checked but is not represented as a tagged, accessibility-certified PDF; the HTML CV is the primary accessible reading format.

## Maintenance and known boundaries

- External prototype/document destinations are retained as published by the original portfolio; their availability depends on the owners’ sharing settings. No access control was changed or bypassed.
- Google Fonts, existing icon resources, analytics, and some historical media sources remain external dependencies. Local fallbacks and text labels preserve core navigation and reading if optional resources fail.
- Full recovery of the unavailable Google Sites images requires a source export or replacement image files.
- The custom domain was not repointed, and no alternate hosting platform was introduced. Production publishing remains the existing GitHub Pages workflow triggered by `main`.
- The old package script named `deploy` pushes `main`; it was not run.
- Keep the public CV and PDF synchronized after future edits. Keep `/design/` specimens aligned with the shared CSS.

## Reproduce and review

```bash
git fetch origin
git switch feat/responsive-portfolio-2026-10-01
npm ci
npm run build
python scripts/verify_site.py
npm run preview
```

Review the homepage, `/projects/`, one or two case studies, `/teaching/`, `/cv/`, and the unlisted `/design/` page in both themes. Use the committed screenshots for a quick visual review without setting up a local server. The existing GitHub Pages workflow will publish only after the reviewed changes reach `main`.

Before merge, rollback is simply leaving the review branch unmerged. After a future merge, revert the merge commit and let the existing Pages workflow deploy the previous state. Do not force-reset a shared production branch.

## Delivery record

The implementation, public CV, migration inventory, screenshots, and validation evidence are included in the review branch. Pull request and remote verification details are added here after upload.
