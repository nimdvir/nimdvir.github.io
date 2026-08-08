# Updated Curated Migration Plan

## Highlights

- Final target IA remains `Home`, `About`, `Research`, `Projects`, `Teaching`, `Media`, `Contact`.
- Wave 1 implementation prioritizes `Research`, `Projects`, `Teaching`, `About`, and `Home`; `Contact` can stay as footer and CTA content until the core migration is stable.
- The repo will contain only optimized, web-ready local assets. Originals, oversized files, and raw downloads stay outside the repo under `C:\Users\nd115232\Pictures\Portfolio`.
- The image strategy is hybrid: keep 10–20 essential identity and layout images local in the Astro repo, and use Cloudinary for galleries, archives, teaching/media sets, and larger legacy image groups.
- The first implementation wave will use separate content collections for `projects`, `research`, `publications`, `talks`, and `courses`, while preserving the current `blog` and `interviews` collections.
- The three legacy-backed research pages are `Sticky Words`, `Less Is More`, and `Information Engagement`.
- `Words on Trial`, `Transparency in Online Marketing`, and `AI Pedagogy` are in scope, will be mentioned explicitly, and will be treated as forward-looking research expansion pages built on the same research infrastructure.
- No images should be served directly from the old site. Cloudinary URLs should be used for remote gallery/archive delivery, with transformations for format, quality, width, and crop where appropriate.
- Maintain a simple `migration/image-inventory.csv` so each image is traceable as local, Cloudinary, staged, archived, or skipped.
- This plan is intended to be implemented in a follow-up chat session. The immediate next execution work is foundation setup, collection scaffolding, asset governance, and then full page builds.

---

## 1. Purpose

This is the execution-ready version of the migration plan for `nimdvir.github.io`.

The goal is to migrate the strongest material from the legacy site into the current Astro site without recreating the old Google Sites experience. The new site should present a coherent academic-professional identity across research, applied work, teaching, and media, while also keeping the codebase maintainable and the asset workflow disciplined.

This plan is more implementation-oriented than `migration-plan-full.md`. It keeps the best architectural decisions from that document, narrows ambiguous scope, and turns the migration into an ordered set of phases that can be executed in a future chat session.

---

## 2. Decision Summary

### 2.1 Final information architecture

Final target navigation:

```text
Home
About
Research
Projects
Teaching
Media
Contact
```

Implementation priority order:

```text
1. Research
2. Projects
3. Teaching
4. Home / About consistency
5. Media polish
6. Contact route if still needed
```

### 2.2 Key implementation decisions

1. Keep `Research` and `Projects` as separate top-level sections.
2. Use Astro content collections instead of continuing to hard-code major content in page files.
3. Use the existing `research` route namespace rather than creating a second research route family in wave 1.
4. Add first-wave collections for `projects`, `publications`, `talks`, and `courses` instead of keeping those structures implicit.
5. Use a hybrid image policy: local for identity and layout images, Cloudinary for galleries, archives, and large media sets.
6. Treat the old-site scrape and local archive folders as source material, not as the destination UX.
7. Build the three legacy-backed research pages first, then extend the same system to the newer research pages.
8. Maintain an `image-inventory.csv` during migration so image location and delivery mode stay auditable.

### 2.3 What this means in practice

The next implementation chat should not begin by rewriting copy at random. It should begin by setting up the content model, asset rules, and page scaffolding that make the migration clean and repeatable.

---

## 3. Final Site Structure

### 3.1 Final route map

Primary routes:

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/research.astro`
- `src/pages/research/[...slug].astro`
- `src/pages/projects.astro`
- `src/pages/projects/[...slug].astro`
- `src/pages/teaching.astro`
- `src/pages/media.astro`
- `src/pages/contact.astro` or footer CTA only if a dedicated route remains unnecessary

Existing supporting routes preserved:

- `src/pages/blog.astro`
- `src/pages/blog/[...slug].astro`
- `src/pages/interviews/[...slug].astro`

### 3.2 Final top-level page responsibilities

#### Home

Purpose:

- executive summary of who Nim is
- strongest entry point into Research, Projects, Teaching, and Media
- concise academic-professional identity

Planned sections:

- hero
- short identity statement
- at-a-glance metrics
- featured research
- selected applied work
- teaching snapshot
- media snapshot
- contact CTA

#### About

Purpose:

- biography and credibility page
- education, affiliation, awards, skills, service, and links

Planned sections:

- about Nim
- education (migrate the `Education` block from the old `/home` page verbatim, then refresh as needed)
- qualifications and skills (migrate the `Qualifications and skills` block from the old `/home` page)
- awards and honors (migrate the `Awards` block from the old `/home` page)
- research and professional identity
- career timeline
- service and affiliations
- selected courses
- contact and profile links

Note on source:

- the old `/home` page renders `Education`, `Qualifications and skills`, and `Awards` as discrete blocks directly on the homepage — in the new IA these belong on `About`, not on the new `Home`. Capture all three blocks explicitly during phase 7.

#### Research

Purpose:

- academic home page
- research agenda plus featured project pages
- publications, manuscripts, and talks surfaced in a structured way

Planned sections:

- research identity
- research agenda
- research interests keyword list (migrate verbatim from the old portfolio Research section: `Artificial Intelligence, Machine Learning, User Experience, Ethics of AI, Human-Computer Interaction, Decision-Making, Digital Learning, Computational Linguistics, Information Behavior, Behavioral Economics, Natural Language Processing (NLP), Content Strategy, Design Research, Computers and Society`)
- featured research projects
- selected publications (mapped from old `Refereed articles and proceedings`)
- manuscripts in progress (mapped from old `Manuscripts in preparation (advanced stages)`)
- talks and presentations (mapped from old `Conference presentations and invited talks`)
- methods and toolkits
- collaboration CTA

#### Projects

Purpose:

- applied UX, AI, content strategy, and design work
- no longer mixed with research projects in the main listing

Planned sections:

- intro / positioning
- filters or categories
- featured applied case studies
- cross-links to related research where relevant

#### Teaching

Purpose:

- preserve the current teaching page as a strong base
- enrich it selectively with better historical/course content and curated visuals

Planned sections:

- teaching philosophy
- graduate courses
- undergraduate courses
- signature pedagogy
- student work or teaching materials if available
- student feedback
- teaching gallery

#### Media

Purpose:

- preserve journalism, bylined writing, press coverage, and on-camera identity
- keep the current `interviews` collection as the base pattern

Planned sections:

- bylined journalism and articles (work written by Nim)
- conducted interviews (current `interviews` collection — preserved as-is)
- press coverage and news items (coverage about Nim)
- video appearances (currently 2 hardcoded iframes — move to structured data in wave 1 or 2)

Wave 1 rule:

- add a `Press Coverage` section and a `Bylined Work` section to `media.astro` as structured lists (publication, title, date, link) — no new collection needed, hardcoded arrays are acceptable initially
- preserve and expand the existing video appearances section

Wave 2 rule:

- if the lists grow, promote `Bylined Work` and `Press Coverage` to content collections (`articles/` and `press/`)

#### Contact

Purpose:

- optional dedicated page in the final structure
- not a critical blocker for the migration itself

Wave 1 rule:

- contact can stay in footer and CTA sections until core migration work is stable

Contact form decision:

- the old site embeds a Google Form for contact. GitHub Pages cannot host a server-side form handler
- wave 1 default: drop the form, keep a prominent `mailto:ndvir@albany.edu` link plus the social/profile links already in the footer
- if a form is genuinely needed later, re-embed the existing Google Form via `iframe` rather than introducing a third-party form provider

### 3.3 Final content collection structure

Wave 1 collection target:

```text
src/content/
  blog/
  interviews/
  research/
  projects/
  publications/
  talks/
  courses/
  config.ts
```

### 3.4 Why separate `publications`, `talks`, and `courses` in wave 1

This is the answer to the earlier open question.

If those collections are added in wave 1, the plan is:

1. Create them early so the content model is normalized before page rewriting begins.
2. Use them as data sources first, not necessarily as standalone top-level pages.
3. Render `publications` and `talks` inside `Research` in wave 1.
4. Render `courses` inside `Teaching` in wave 1.
5. Decide later whether `publications`, `talks`, or `courses` deserve dedicated archive pages.

This gives the site stronger structure now without forcing unnecessary page proliferation in the first implementation cycle.

---

## 4. Exact Migration Scope

### 4.1 Legacy-backed research pages to build

These are direct migration-backed research pages because they clearly exist in the old-site material and are already central to the current academic identity.

| Friendly title | Old-site academic subtitle | Old-site URL |
| --- | --- | --- |
| `Sticky Words` | Computation and Language | `/portfolio/ongoing-research/sticky` |
| `Less Is More` | Computers and Society | `/portfolio/ongoing-research/less-is-more` |
| `Information Engagement` | Computers and Society | `/portfolio/ongoing-research/information-engagement` |

Rules:

- keep the friendly title as the page heading and slug
- capture the academic subtitle in frontmatter (e.g. `subtitle:` or `category:`) so the research card can show both
- preserve the old URL in the redirect map (see section 11)

These will become full research entries in `src/content/research/` and will render through the existing research route pattern.

### 4.2 Forward-looking research pages to include in the plan

These are not being dropped. They are explicitly included in this roadmap.

1. `Words on Trial`
2. `Transparency in Online Marketing`
3. `AI Pedagogy`

How they will be handled:

- They will be mentioned explicitly in the migration roadmap.
- They will use the same `research` collection and page templates as the legacy-backed trio.
- They will be implemented after the legacy-backed trio is scaffolded.
- They should be labeled as current or emerging research pages if their source materials come from current manuscripts, CV material, notes, or newer work rather than directly from the old site.

This means they are in scope for the broader site refresh, but they are not being misrepresented as pure old-site migrations.

### 4.3 Applied projects to migrate in the main wave

These are the core applied case studies to carry over:

1. `Costco Mobile App`
2. `Dexcom G7+`
3. `Barrier Free Living`
4. `Nasher Sculpture Center`
5. `Timeout Tel Aviv`
6. `Zang Toi`
7. `Facebook Content Strategy`

These will become content entries in `src/content/projects/` and will render through a rebuilt projects index and detail route.

### 4.4 Optional wave-2 applied projects

These are worth keeping visible in the plan, but not required for the first implementation cycle:

1. `Golf Buddy`
2. `Fieldstones`
3. `ClaimFame`
4. `Trackimo`
5. `Prototypes`

Rule:

- only migrate if there is enough clean copy, enough asset support, and the project still strengthens the portfolio

### 4.5 Research support material to migrate

From the old portfolio page and related sources:

- curated publication list
- curated manuscripts list
- curated talks and presentations list

This material will be normalized into:

- `src/content/publications/`
- `src/content/talks/`

and rendered first inside `Research`.

### 4.6 Teaching content to migrate

Teaching migration scope is selective.

Will migrate:

- missing or stronger historical course details
- a normalized `courses` collection to back the Teaching page
- selected visuals that materially improve teaching warmth and credibility

Will not migrate blindly:

- every old teaching fragment
- raw photo dumps
- CV-style overlong lists if they reduce clarity

### 4.7 Media content to migrate

Media is not the core migration gap, because the current site already has a usable `interviews` collection.

Wave 1 media scope:

- preserve current interview archive
- expand metadata if needed
- add selected supporting imagery only if it clearly improves the page

Wave 2 media scope:

- broader archive enrichment
- public scholarship or commentary sub-structure if desired later

### 4.8 Home and About content to migrate

Will migrate:

- strongest concise bio language from the old site
- role/title consistency updates
- profile links and structured-data consistency
- selected positioning language that improves the homepage and about page

Will not migrate:

- old layout logic
- repetitive CV language
- outdated institutional wording or stale claims

---

## 5. Source Material and Asset Policy

### 5.1 Source-of-truth content sources

Primary content sources:

- `scraped_site/pages/portfolio.md`
- `scraped_site/pages/portfolio_ongoing-research_*.md`
- `scraped_site/pages/portfolio_projects_*.md`

Secondary content and document sources:

- `G:\My Drive\2-work\Portfolio`
- `G:\My Drive\2-work\Portfolio\blogportfolio`
- `G:\My Drive\2-work\Portfolio\research`

Third-party live sources to also inventory (the old nav mixes these domains, so content may not be identical across them):

- `https://www.nimdvir.org/` (primary `.org` site)
- `https://www.nimdvir.com/` (legacy `.com` site)
- `https://sites.google.com/view/nimdvir/` (legacy Google Sites version that some old nav links still point to)

Phase 0 must explicitly diff content across these three live sources before assuming the scrape is complete.

### 5.2 Source-of-truth asset sources

Preferred asset sources:

1. `C:\Users\nd115232\Pictures\nimdvir.github.io-personalsite-images`
2. `C:\Users\nd115232\Pictures\Blog24\media`
3. `G:\My Drive\2-work\Portfolio\research`
4. existing repo assets in `public/images`
5. `scraped_site/images` or live legacy-site downloads only for gaps

### 5.3 Practical image decision rule

Use this rule during migration:

- if the image is part of the site's identity or layout, keep it local
- if the image is part of a gallery, archive, or large media set, use Cloudinary

In practice, that means:

- local: headshot, logo, favicon, homepage hero, section hero, core project thumbnails, essential open-graph or brand-supporting images
- Cloudinary: teaching galleries, media/interview sets, archive imagery, larger legacy image groups, and any image family where responsive remote transformations reduce maintenance cost

### 5.4 Local asset tier

Target local image count:

- keep roughly 10–20 essential images in the Astro repo

Expected local categories:

- brand and identity assets
- homepage and section layout assets
- essential project and research card images
- any image that should remain reliable even if a third-party media service changes

Recommended local destinations:

- `public/images/...` for stable directly served assets
- `src/assets/images/...` for images that benefit from Astro's local image pipeline

### 5.5 Cloudinary asset tier

Use Cloudinary for:

- teaching galleries
- media and interview image sets
- legacy archive imagery
- larger image groups that benefit from responsive transformations

Cloudinary delivery rule:

- use Cloudinary URLs with transformations for width, crop, quality, and auto-format where appropriate

Typical transformation goals:

- `f_auto`
- `q_auto`
- width-specific delivery
- cropping or fill behavior for cards when needed

### 5.6 Consolidation rule

All originals should be consolidated outside the repo under:

```text
C:\Users\nd115232\Pictures\Portfolio
```

Suggested subfolders:

```text
Portfolio/
  research/
  projects/
  teaching/
  media/
  blog/
  documents/
  archive/
```

### 5.7 Repo asset rule

Inside the repo:

- keep only optimized web-ready images
- keep only the essential local image set
- keep only curated public documents
- ignore raw, staging, and original asset folders in `.gitignore`
- do not hotlink or serve images directly from the old site

This is path-based, not size-based, because Git does not support ignore rules by file size threshold.

### 5.8 Image inventory requirement

Create and maintain:

```text
migration/image-inventory.csv
```

Minimum columns:

```csv
source_file,source_folder,canonical_name,page_destination,delivery_mode,repo_path,cloudinary_url,status,notes
```

Where `delivery_mode` is one of:

- `local`
- `cloudinary`
- `staged`
- `archived`
- `skip`

---

### 5.9 Carousels and section hero imagery

The old site uses image carousels at the top of `Home` and at the top of each portfolio section (`Research`, `Projects`, `Teaching`, `Media`).

Wave 1 decision:

- do not replicate the carousel pattern
- replace each old carousel with a single static section hero image (local for `Home` and `About`, Cloudinary for section pages if image families are large)
- if a carousel is genuinely needed later, treat it as a wave-2 enhancement and pick one lightweight implementation rather than per-section custom code

Reason:

- carousels add JS weight, hurt accessibility, and rarely improve engagement; a single strong hero image is consistent with the academic-professional identity the plan targets

---

## 6. What I Adapted From `migration-plan-full.md`

### 6.1 Kept from the full plan

1. Separate `Research` and `Projects` as top-level pages.
2. Keep Astro as the destination architecture.
3. Move content out of hardcoded page arrays into content collections.
4. Add project-level depth to research rather than leaving the research page list-only.
5. Use local assets as the default strategy.
6. Preserve the current Teaching and Media pages as the structural baseline.
7. Treat the old site as source material, not as the target UX.

### 6.2 Adapted for implementation clarity

1. Promoted `publications`, `talks`, and `courses` into first-wave collections.
2. Split research work into `legacy-backed` and `forward-looking` pages so the implementation order is clear.
3. Tightened the asset policy into an explicit hybrid local-and-Cloudinary rule with optimized-only repo storage.
4. Converted the broad strategy into a phase plan that can be executed in a follow-up chat.
5. Preserved `Contact` in the final IA but lowered its implementation priority.

---

## 7. What I Chose Not To Adapt Directly From The Full Plan

These items are not rejected permanently. They are either deferred, narrowed, or intentionally handled differently.

### 7.1 Not adapted directly

1. Full old-site parity.

Reason: the goal is curation, not exhaustive reproduction.

1. Rebuilding Media into a large multi-subtype archive immediately.

Reason: the current site is already ahead of the old site in this area.

1. Creating dedicated archive pages for `publications`, `talks`, and `courses` in the first implementation pass.

Reason: the collections should exist now, but the first rendering target is the `Research` and `Teaching` pages.

1. Treating `Words on Trial`, `Transparency in Online Marketing`, and `AI Pedagogy` as if they were direct old-site migrations.

Reason: they belong in the roadmap and will be implemented, but they should be categorized honestly as current research expansion pages.

1. A large wave-1 tooling surface with many new scripts and abstractions beyond what the migration actually requires.

Reason: implementation should focus on content model, assets, and pages first.

### 7.2 Explicitly deferred

1. Dedicated `Contact` route if footer and CTA treatment is sufficient initially.
2. Optional older projects with weak assets or stale positioning.
3. Deep media and archive restructuring beyond current interviews.
4. Additional archive pages for publications, talks, and courses until the core sections are stable.

---

## 8. Phase Plan

This is the implementation sequence for the next chat session and subsequent follow-ups.

### Phase 0 - Preparation and migration matrix

Goal:

- freeze scope before editing the site

Tasks:

- create the migration matrix from the scrape and local sources
- mark each legacy item as `migrate`, `optional`, or `skip`
- decide which documents are public-safe

Deliverables:

- `migration/migration-matrix.md` — a markdown table with columns: `item`, `type` (research/project/publication/talk/course), `source_file`, `status` (migrate/optional/skip), `notes`
- document inventory
- source folder inventory

---

### Branching and deployment rule

All migration work happens on a branch named `migration/wave-1`. Do not commit incomplete pages to `main`. Phase 8 ends with a PR merge into `main`, which triggers GitHub Pages deployment. The existing live site on `main` is not touched until the PR is ready.

---

### Phase 1 - Foundation and schema work

Goal:

- create the content model the site will use

Tasks:

- verify the current state of `src/pages/projects.astro` and `src/pages/research.astro` before touching them — if they contain hardcoded arrays, the phase 3 and 4 rebuilds replace that code entirely; if they already partially use collections, extend rather than replace
- update `src/content/config.ts`
- add collections for `projects`, `publications`, `talks`, and `courses` — create empty folders and schemas now even though content population for `publications`, `talks`, and `courses` happens in phase 6
- extend the existing `research` collection schema as needed
- confirm existing `blog` and `interviews` still build cleanly

Deliverables:

- updated collection schemas
- empty collection folders ready for content import

Why this phase comes first:

- the next phases build full pages; full pages should not be built on top of hardcoded arrays if the plan is to migrate at scale

### Phase 2 - Asset governance and staging

Goal:

- make the repo safe for image and document migration

Tasks:

- update `.gitignore`
- define ignored staging folders if needed
- consolidate originals outside the repo under `C:\Users\nd115232\Pictures\Portfolio`
- identify the 10–20 essential images that stay local
- decide which repo assets stay in `public/images` and which move to `src/assets/images`
- prepare the Cloudinary upload set for teaching, media, archive, and larger legacy image groups
- create `migration/image-inventory.csv`
- ensure no image is planned to be served directly from the old site
- use the existing VS Code tasks `Upload current image to Cloudinary` and `Upload all images to Cloudinary` (defined in `.vscode/tasks.json`) for the Cloudinary upload workflow — no new scripts are needed for this phase

Deliverables:

- clean asset policy
- staging workflow
- hybrid local-versus-Cloudinary decision list
- image inventory CSV
- no raw or original asset leakage into the repo

### Phase 3 - Projects implementation

Note on ordering:

- projects are implemented before research not because they are higher priority, but because the content model for projects is simpler (no cross-references to `publications` or `talks`), making phase 3 the right place to validate the collection scaffolding before the more interconnected research system is built in phase 4

Goal:

- replace the hardcoded projects page with a real content-driven system

Tasks:

- create `src/content/projects/*.md`
- rebuild `src/pages/projects.astro`
- create `src/pages/projects/[...slug].astro`
- migrate the seven main applied projects

Deliverables:

- projects index page
- project detail pages
- no research entries mixed into the main applied-work listing

### Phase 4 - Research implementation, legacy-backed trio

Goal:

- make `Research` credible and substantial immediately

Tasks:

- create the three legacy-backed research entries
- rebuild or expand `src/pages/research.astro`
- surface featured research projects
- wire publications and talks schema references only — actual content entries are populated in phase 6; stub the renders with empty collection queries so the page still builds cleanly

Deliverables:

- `Sticky Words` page
- `Less Is More` page
- `Information Engagement` page
- improved research overview page

### Phase 5 - Research implementation, forward-looking expansion

Goal:

- extend the same research system to the newer research work

Tasks:

- create `Words on Trial`
- create `Transparency in Online Marketing`
- create `AI Pedagogy`
- label statuses accurately as published, under review, in progress, or pilot

Deliverables:

- three additional research pages
- consistent research portfolio depth beyond the legacy material

Important note:

- this phase is part of the site refresh plan even though these pages are not strictly direct legacy migrations

### Phase 6 - Publications, talks, and courses integration

Goal:

- make the new collections visible in the site

Tasks:

- create `src/content/publications/*.md`
- create `src/content/talks/*.md`
- create `src/content/courses/*.md`
- render publications and talks on `Research`
- render courses on `Teaching`

Deliverables:

- normalized scholarly lists
- normalized course inventory
- easier long-term maintenance for Research and Teaching

Why not separate full pages yet:

- because the first rendering target is section-level integration, not more top-level pages

### Phase 7 - Home, About, Teaching, Media, and Contact polish

Goal:

- align the surrounding pages with the migrated core content

Tasks:

- update `index.astro`
- update `about.astro`
- selectively enrich `teaching.astro`
- lightly refine `media.astro`
- decide whether `contact.astro` is necessary now; until it is built, remove `Contact` from the nav link list and replace it with a scroll-to anchor pointing to the footer CTA — do not leave a broken nav link in the deployed site
- before touching `media.astro`, fetch and inventory the old `/portfolio` Media section (anchor `#h.syohxzf1deac`) and confirm the actual articles, interviews, press items, and video appearances present — do not assume hardcoded arrays in `media.astro` already cover the old content

Deliverables:

- coherent cross-linking across the site
- consistent title, bio, and metadata
- no stale identity conflicts across pages

### Phase 8 - QA and deployment readiness

Goal:

- make the migration shippable

Tasks:

- run `npm run build`
- review the project and research routes
- verify image and document links
- verify Cloudinary-delivered gallery and archive images resolve correctly
- verify local identity and layout images remain local
- verify GitHub Pages settings

Deliverables:

- buildable site
- consistent content
- deploy-ready migration branch

---

## 9. Implementation Starting Point For The Next Chat

The next implementation chat should begin with:

1. `Phase 1` foundation and schema updates
2. `Phase 2` asset governance and `.gitignore`
3. `Phase 3` projects page rebuild

After that, the chat should move into:

1. `Phase 4` research trio
2. `Phase 5` forward-looking research pages
3. `Phase 6` publications, talks, and courses integration

This means the follow-up chat will not stop at planning. It should create the collections, wire the routes, and start building full pages.

---

## 10. Key File Targets

- `src/content/config.ts`
- `src/content/projects/`
- `src/content/research/`
- `src/content/publications/`
- `src/content/talks/`
- `src/content/courses/`
- `src/pages/projects.astro`
- `src/pages/projects/[...slug].astro`
- `src/pages/research.astro`
- `src/pages/research/[...slug].astro`
- `src/pages/teaching.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `.gitignore`

---

## 11. Old-Site Compatibility (Redirects and Domain)

This section was added after cross-checking the curated plan against the live `https://www.nimdvir.org/` site. None of it was covered earlier and all of it is required before phase 8 ships.

### 11.1 Redirect strategy

The old site is structured as a single `/portfolio` page with hash anchors plus per-item pages under `/portfolio/projects/...` and `/portfolio/ongoing-research/...`. After migration those URLs will 404 unless explicitly redirected. Many of them are linked from CVs, papers, LinkedIn, and Google Scholar, so silent breakage is not acceptable.

GitHub Pages does not support server-side redirects. Two viable options:

1. Static stub pages with `<meta http-equiv="refresh" content="0; url=/new-path">` and a `<link rel="canonical">` to the new URL
2. A single client-side router page that reads `location.pathname` and redirects via JS

Wave 1 default: use option 1 (stub pages). It is crawlable, works without JS, and keeps each old URL traceable in git.

### 11.2 Required redirect map

At minimum the following old URLs must map to new URLs before phase 8:

| Old URL | New URL |
| --- | --- |
| `/portfolio` | `/research` or `/projects` landing (decide one) |
| `/portfolio/ongoing-research/sticky` | `/research/sticky-words` |
| `/portfolio/ongoing-research/less-is-more` | `/research/less-is-more` |
| `/portfolio/ongoing-research/information-engagement` | `/research/information-engagement` |
| `/portfolio/projects/golf-buddy` | `/projects/golf-buddy` |
| `/portfolio/projects/barrier-free-living` | `/projects/barrier-free-living` |
| `/portfolio/projects/nasher-sculpture-center` | `/projects/nasher-sculpture-center` |
| `/portfolio/projects/fieldstones` | `/projects/fieldstones` |
| `/portfolio/projects/dexcom` | `/projects/dexcom-g7-plus` |
| `/portfolio/projects/costco` | `/projects/costco-mobile-app` |
| `/portfolio/projects/zang-toi` | `/projects/zang-toi` |
| `/portfolio/projects/claimfame` | `/projects/claimfame` |
| `/portfolio/projects/timeout` | `/projects/timeout-tel-aviv` |
| `/portfolio/projects/facebook` | `/projects/facebook-content-strategy` |
| `/portfolio/projects/prototypes` | `/projects/prototypes` |
| `/portfolio/projects/trackimo` | `/projects/trackimo` |

Anchor-only links on the old `/portfolio` page (`#h.83cijt6vi5jr` for Research, `#h.zg3cbdmv6clr` for Projects, `#h.y38ei9lqq6nl` for Teaching, `#h.syohxzf1deac` for Media) cannot be intercepted server-side. If those are referenced externally, the `/portfolio` redirect stub should include JS that inspects `location.hash` and forwards to `/research`, `/projects`, `/teaching`, or `/media` accordingly.

### 11.3 Domain decision

The old material lives on three domains: `nimdvir.org`, `nimdvir.com`, and `sites.google.com/view/nimdvir`. The new site lives at `nimdvir.github.io`.

Wave 1 decision (must be made before phase 8 ships):

1. Keep `nimdvir.github.io` as the canonical URL and accept that external links to `.org` and `.com` will still resolve to the old Google Sites content until those sites are taken down
2. Point `nimdvir.org` (preferred) at GitHub Pages via DNS CNAME plus a `public/CNAME` file in the repo, take down the Google Sites version, and have `nimdvir.com` 301 to `nimdvir.org` at the registrar level
3. Take down both `.org` and `.com` entirely and rely on `github.io`

Recommended: option 2. It preserves SEO and external link equity, makes the redirect map in 12.2 actually effective, and avoids two parallel sites with the same identity.

Whichever option is chosen, the decision should be recorded in `migration/migration-matrix.md` so subsequent phases do not re-litigate it.

### 11.4 Sunset of the old site

When the domain decision is implemented:

- archive a full local copy of the old Google Sites content under `C:\Users\nd115232\Pictures\Portfolio\archive\old-google-site\` before takedown
- save a copy of the live HTML for the 12 project pages and 3 research pages, in case the redirect map needs adjustment later
- do not delete the `scraped_site/` folder in the repo — it is the durable source of truth

---

## 12. Acceptance Criteria For This Plan

This plan is complete if it gives the next implementation chat enough specificity to start building without reopening scope decisions.

That means:

1. The final IA is clear.
2. The migration scope is explicit.
3. `publications`, `talks`, and `courses` have a defined plan.
4. `Words on Trial`, `Transparency in Online Marketing`, and `AI Pedagogy` are explicitly included and categorized honestly.
5. The phase order makes it clear when full pages will actually be built.
6. The asset policy is unambiguous.
7. The local-versus-Cloudinary rule is explicit and actionable.
