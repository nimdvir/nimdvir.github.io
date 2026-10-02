# Domain and scholarly discoverability

Prepared October 2, 2026, on `feat/domain-discoverability-2026-10-02` from main commit `b4b47f5cffcbfb85e5abbcf2c2eeb75722ce39c1`.

This report describes the initial feature branch. Nim subsequently approved publication and requested that About become the complete CV. See [the CV update](2026-10-02-designed-cv.md) and PR #37 for the combined release.

## Changes

- Set Astro's site URL to `https://nimdvir.com`. The shared layout, canonical URLs, Open Graph and Twitter URLs, schema identity URLs, robots.txt, sitemap, and RSS now use this origin. Robots.txt is generated from Astro's site configuration.
- Updated 23 legacy redirect-page canonicals to the new domain. Existing page paths remain available.
- Kept internal pages, files, anchors, and known personal-domain aliases in the same tab. External sites, including the separate CCE workshop, open a new tab. The global `base target` was already removed in the previous revision.
- Added factual search titles for Home, About, Research, Projects, and Teaching. Visible page headings retain their existing wording.
- Added a stable Person identifier, a ProfilePage entity on About, BlogPosting entities on blog articles, and breadcrumbs on research, project, blog, and publication detail pages. Person images now always use Nim's portrait rather than a page's project image.
- Added `/rss.xml` for published blog and news entries, feed discovery in the shared layout, and RSS links on Blog and News. Short news entries have stable archive anchors. Draft and future entries use the existing editorial publication filter.
- Added a publication-page template, validated content fields, Highwire citation tags, ScholarlyArticle metadata, original abstracts, citations, and source/licensing links. Publication pages are separate from the existing research project descriptions and are linked from Research.
- Corrected the noindex 404 page's canonical path to `/404.html`.

## First publication pages

| Page | Source version | Full text |
| --- | --- | --- |
| `/publications/ways-of-words/` | arXiv:2305.09798, May 16, 2023 | Unchanged v1 PDF hosted beside its abstract |
| `/publications/words-that-stick/` | arXiv:2307.14511, July 26, 2023 | Unchanged v1 PDF hosted beside its abstract |
| `/publications/predictive-model-information-engagement/` | arXiv:2307.14500, July 26, 2023 | Unchanged v1 PDF hosted beside its abstract |
| `/publications/when-less-is-more/` | Informing Science, volume 21, 2018, pp. 19–39 | Publisher PDF link |

The three arXiv records list five authors. The pages preserve their order and use the cited preprint dates, not the date of this website update. Dated manuscript review statuses from the September CV remain separate from the preprint venue and date.

The original author-written abstracts are reproduced from the source records and labeled as such. They are not new website copy or AI summaries. The three arXiv records grant CC BY 4.0; the Informing Science record grants CC BY-NC 4.0. Attribution and license links are visible on each page.

The arXiv PDFs were checked for recognizable title pages, all five authors, searchable text, references, and a size below 5 MB. First-page renders were inspected. Their bytes are unchanged. `citation_pdf_url` is emitted only for an existing local PDF in the same directory as its abstract page, as required by Scholar's documentation. The publisher PDF for When Less Is More returned HTTP 412 during retrieval, so it remains an external source link and has no fabricated local copy or PDF metadata tag.

The other eight existing publication records retain their source links. They have not been represented as verified abstract pages. The dissertation's existing research project URL is preserved.

## Authoring

Use [the publication template](../templates/publication.md) and [the authoring guide](../templates/README.md).

- `draft: true` hides a publication record from generated pages.
- `pageReady: true` generates the individual page after its required source fields are supplied and checked.
- Existing bibliography-only records default to `pageReady: false` and remain listed.
- `workingPaper: true` puts the record in Working papers. Review status is separate from citation metadata.
- Local PDFs require a source URL and a reuse license. External PDFs may be linked using `pdfSource`.

## Verification

- Astro production build passed: 41 generated page routes, plus robots.txt and RSS endpoints.
- `python scripts/verify_site.py` passed: 69 HTML files, local links/assets/fragments, image alternatives, landmarks, all 12 projects, CV, and the unlisted design page.
- `python scripts/verify_seo.py` passed: 39 indexable canonical pages with unique titles/descriptions, canonical/social/schema URLs, four scholarly pages, two RSS items, exact sitemap coverage, robots.txt, and absolute internal links.
- Browser checks passed for nine representative routes at 390 and 1440 pixels in light and dark themes: 36 combinations, no horizontal overflow or site JavaScript errors.
- Eight axe scans passed with no WCAG A/AA violations in the tested pages and themes. This is an automated check, not a complete accessibility certification.
- Interactions verified: Research to publication stays in the same tab; local PDF targets the same tab; original paper source opens a protected new tab; RSS news anchor resolves.
- Temporary draft/future blog and news fixtures plus a draft publication were absent from generated HTML/XML. An invalid publication citation date correctly failed the build. Fixtures were removed and the final build passed.
- `git diff --check` passed. No new or revised site prose contains an em dash. Source PDFs are unmodified scholarly documents.

Evidence: [browser checks](2026-10-02-seo/browser-validation.json), [content checks](2026-10-02-seo/content-validation.json), [PDF provenance](2026-10-02-seo/pdf-sources.json), and screenshots in [this directory](2026-10-02-seo/).

The browser audit served local build output under the intended canonical origin. External requests were blocked in that browser run; it does not establish third-party service availability or live production behavior. The schema audit checks emitted structure and consistency; no claim is made about Google indexing or rich-result eligibility.

## Before publication

Public HTTP checks found the GitHub Pages address redirecting to `http://nimdvir.com/`, which returned the site. Requests to `https://nimdvir.com/`, `https://www.nimdvir.com/`, and the HTTPS robots URL returned HTTP 502 through the execution environment's proxy. This does not establish whether the underlying cause is domain provisioning, TLS, or the proxy. Verify the HTTPS domain and HTTPS redirects from a normal browser before merging this canonical migration.

No DNS records, registrar settings, GitHub Pages domain settings, Google Search Console properties, Bing Webmaster Tools properties, or external profile links were changed. The repository requires Nim's approval before merging or publishing.

After the approved deployment:

1. Check Home, a publication page, `/robots.txt`, `/sitemap.xml`, and `/rss.xml` over HTTPS. Verify that the old host and the `www` variant redirect to the canonical host while preserving page paths.
2. Verify `nimdvir.com` ownership in Google Search Console and submit `https://nimdvir.com/sitemap.xml`. Existing Google verification and Analytics markup are preserved, but their presence alone does not verify a domain property.
3. Submit the same sitemap to Bing Webmaster Tools if desired.
4. Update editable institutional and scholarly profiles to the canonical domain.
5. Add the remaining publication pages when their complete original abstracts and exact citation details are available.

## Primary references

- [Google Scholar inclusion and citation metadata](https://scholar.google.com/intl/en-us/scholar/inclusion.html)
- [Google ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google Article documentation](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google breadcrumb documentation](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Astro RSS documentation](https://docs.astro.build/en/recipes/rss/)
- [The Ways of Words source record](https://arxiv.org/abs/2305.09798)
- [Words That Stick source record](https://arxiv.org/abs/2307.14511)
- [Predictive Model source record](https://arxiv.org/abs/2307.14500)
- [When Less Is More publisher record](https://www.informingscience.org/Publications/4015)
- [When Less Is More Crossref record](https://api.crossref.org/works/10.28945/4015)
