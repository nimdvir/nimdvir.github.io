# Old-site migration plan

## Problem

Migrate the strongest content and visuals from the legacy site (`nimdvir.org` / `nimdvir.com`) into the current Astro site in `C:\Users\nd115232\Documents\GitHub\nimdvir.github.io`, while avoiding duplicate work, cleaning up assets, and optimizing images before they are committed.

## Current-state findings

- The new site already has first-class routes for `index`, `about`, `research`, `projects`, `teaching`, and `media`.
- The repo already supports image compression with `npm run optimize:images`.
- The repo also contains `src\components\OptimizedImage.astro`, which can be used later for high-value local images that should benefit from Astro image generation.
- The attached folder already contains many assets that overlap with `public\images`, especially for `portfolio`, `teaching`, `Me`, `logo`, and `404`.
- The old `portfolio` page is richer than the current site in three areas:
  - research detail (publications, manuscripts, talks)
  - teaching detail (full course history)
  - additional project coverage (for example ClaimFame, Trackimo, Prototypes, and some research thumbnails)

## Migration strategy

Use the existing page structure instead of recreating the old site. Treat the legacy site as a content and asset source, then fold selected pieces into the current information architecture:

- old home/about content -> `src\pages\index.astro` and `src\pages\about.astro`
- old research sections -> `src\pages\research.astro` and/or `src\content\research\*.md`
- old project cards/case studies -> `src\pages\projects.astro`
- old teaching lists and visuals -> `src\pages\teaching.astro`
- old media/interview scans -> `src\pages\media.astro` and `src\content\interviews\*.md`

## Recommended migration scope

### Phase 1: content-first updates

1. Expand `research` with the strongest legacy material:
   - selected publications
   - manuscripts in preparation
   - conference talks
   - concise research-interest keywords only where they strengthen the page
2. Expand `projects` with missing legacy items:
   - ClaimFame
   - Trackimo
   - Prototypes
   - any missing research/project thumbnails that support current cards
3. Expand `teaching` with the fuller historical course list from the old site, but keep the new visual style and avoid turning the page back into a long CV dump.
4. Review `about` and `index` only for bio facts, positioning, and contact language that are still current.

### Phase 2: asset migration and optimization

Preferred asset source order:

1. attached local folder
2. existing repo assets
3. download from old site only for gaps

Recommended asset destinations:

- `public\images\...` for assets that match the current site pattern
- `src\assets\...` only for any hero or feature images that should later use `OptimizedImage.astro`

Optimization rules:

- keep originals outside the repo until selections are final
- rename cryptic files before commit
- convert oversized JPG/PNG assets to optimized JPG/WebP where appropriate
- keep GIFs only when animation matters; otherwise replace with static or WebP
- run `npm run optimize:images` after assets are placed in the repo

### Phase 3: cleanup and consistency

1. remove duplicate or near-duplicate assets from the migration set
2. standardize naming and folder structure
3. verify that copy, dates, titles, and institution names are current
4. check internal linking between home, about, research, projects, teaching, and media
5. decide whether to add redirects from old paths only if the old domain will point here later

## Recommended downloads from the old site

Download only if an equivalent local file is missing or lower quality than the legacy source:

- research thumbnails / visuals for:
  - Less is More
  - Information Engagement
  - Computers and Society
- project visuals for:
  - ClaimFame
  - Prototypes
  - Trackimo
- any higher-quality hero or section art that is currently only represented by compressed local copies
- optional interview scan images if they will actually be surfaced on the media page

Do not bulk-download every Google Sites image. Most value is concentrated in a small set of research and project images, and the attached folder already covers much of the current site.

## Asset notes from the attached folder

- Already useful and likely reusable:
  - `Me\headshot2025.jpg`
  - `portfolio\*.png/jpg` project images
  - `teaching\me-teaching*.{jpg,jpeg,webp}`
  - `teaching\appriciation-letters.jpg`
  - `portfolio\interviews\*.jpg`
- Likely redundant with repo assets:
  - `logo\diamond-logo.png`
  - `logo\diamond.jpg`
  - `logo\favicon*.png`
  - `404\yorkies.gif`
  - `404\yorkshire-cute.gif`

## Execution plan

1. Inventory and decide scope
   - compare old-site content against current pages
   - mark each legacy section as migrate, rewrite, or skip
2. Curate assets
   - copy the best local assets from the attached folder into a temporary working set
   - list remaining image gaps that require download from the old site
3. Download missing legacy images
   - fetch only the shortlisted visuals
   - rename them to stable, descriptive filenames
4. Optimize assets
   - compress and convert selected images
   - keep only one canonical file per visual
5. Migrate content page by page
   - research
   - projects
   - teaching
   - media / interviews
   - home / about touchups
6. Final polish
   - tighten copy
   - fix links
   - remove leftovers and duplicates
   - build and review

## Notes / decisions

- Preserve the new site's cleaner structure and visual language; do not recreate the old Google Sites layout.
- Treat the old site as source material, not as the target UX.
- Prioritize high-signal content over exhaustive CV-style dumps.
- Favor local assets already in the attached folder before scraping more remote images.
