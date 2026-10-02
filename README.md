# Nim Dvir’s personal website

An Astro portfolio for research, teaching, applied UX and AI projects, and journalism. Published with GitHub Pages at [nimdvir.github.io](https://nimdvir.github.io).

## October 2026 website

The responsive refresh was published on October 1 through PR #34. Production is the `main` branch; new work uses feature branches and pull requests.

- [Detailed execution report](reports/2026-10-01-website-refresh.md)
- [Visual review screenshots](reports/2026-10-01/screenshots/)
- [Legacy project migration inventory](migration/2026-10-01-project-inventory.md)
- [Blog and news templates and publishing instructions](templates/README.md)

## Run locally

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feat/my-website-update
npm ci
npm run dev
```

Open the local URL printed by Astro. For a production build:

```bash
npm run build
python scripts/verify_site.py
npm run preview
```

Use the Node version compatible with the existing Astro dependencies. The GitHub Pages workflow uses Node 20; this refresh was also built and checked under Node 24. Keep `package-lock.json` and use `npm ci`.

## Where to edit

| Path | Purpose |
| --- | --- |
| `src/pages/` | Homepage, biography, research, projects, teaching, media, CV, and detail templates |
| `src/content/projects/` | All 12 legacy portfolio case studies and original supporting links |
| `src/content/research/` | Research descriptions; the verified public set is defined in `src/data/profile.ts` |
| `src/content/publications/` | Publication, proceeding, dissertation, and preprint records |
| `src/content/interviews/` | Existing interviews and source attribution |
| `src/content/blog/` | Blog posts; only explicit `draft: false` entries dated today or earlier are built |
| `src/content/news/` | Short announcements and full news pages, with the same draft/date rule |
| `templates/` | Reusable blog, short-news, and full-news Markdown templates and authoring guide |
| `src/data/profile.ts` | Shared CV URL and social/professional links |
| `src/data/cv-public.md` | Public CV, based on September 16, 2026 source; excludes personal phone and referee contacts |
| `public/styles/site.css` | Shared design tokens, themes, typography, components, and responsive layouts |
| `public/js/theme-init.js` | Apply saved/system theme before first paint |
| `public/js/site.js` | Theme toggle, mobile navigation, short typing effect, and project filters |
| `public/design/index.html` | Unlisted design reference at `/design/`; public, not access-controlled |
| `public/files/Nim-Dvir-CV-2026-09.pdf` | Downloadable public CV |
| `public/portfolio/` | Compatibility redirects for legacy URLs |
| `reports/` | Durable execution reports, evidence, and review screenshots |

The `/design/` page loads the same CSS and scripts as the main website. Keep its token descriptions and specimens synchronized when changing the system. It is intentionally excluded from navigation and the sitemap and has `noindex` metadata. It must never contain secrets.

## Update the CV

Edit `src/data/cv-public.md`. The normal Astro build renders its HTML page and copies the committed PDF. To regenerate the PDF:

```bash
python -m pip install reportlab markdown lxml
python scripts/build-public-cv.py
```

The PDF generator uses ReportLab’s bundled fonts. Review the PDF after regeneration, then rebuild and verify the site.

## Add a post or news update

Copy a file from [templates](templates/README.md) into the appropriate content folder. Edit the title, date, summary, and body; keep `draft: true` until ready. Set `draft: false`, build, review, and publish through a pull request. The homepage shows the three latest published items of each type. Drafts are excluded from generated pages, but committed drafts remain visible in this public repository. Future dates require a rebuild on or after the date; there is no automatic publishing schedule.

## Publishing workflow

1. Work on a feature branch.
2. Build and run the local-link verifier.
3. Review phone, tablet, desktop, both themes, navigation, and download links.
4. Commit and push the feature branch; open a pull request for Nim’s review.
5. Merge into `main` only after approval. The existing GitHub Pages workflow then deploys it.

The historical `npm run deploy` command pushes `main`. Do not use it for review work.

## Content boundaries

Claims should be supported by the current CV, original project materials, or Nim’s explicit instructions. Student concepts are labeled as advised project work; proposals do not imply shipped commercial products or measured outcomes. Three older research drafts and four older essays remain in the repository for owner review but are not published as evidence; their former URLs lead to current research or writing indexes. See the execution report for details.
