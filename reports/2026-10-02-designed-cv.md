# Complete CV and approved publication

Nim requested replacement of About with a designed, complete CV and explicitly approved publication of the pending website changes on October 2, 2026.

## Changes

- The main navigation now says CV and opens `/cv/`.
- `/cv/` displays the complete September 2026 public CV, with a portrait and contact header, PDF download, section index, timeline styling for appointments and professional experience, education panels, and readable publication/course lists.
- All content remains visible in the HTML. There are no collapsed sections or abbreviated lists.
- The page renders all ten sections directly from `src/data/cv-public.md`, the same source used for the downloadable PDF. The source CV and existing PDF were not changed.
- The ten sections are Academic Appointments, Education, Professional Experience, Methods and tools, Research, Teaching Experience, Awards and honors, Service, Media coverage, and References.
- The old `/about/` address redirects to `/cv/` using Astro's static redirect output. It is excluded from the sitemap. The homepage now has one CV button, and author/profile structured data points to CV.
- The design supports light/dark themes, a compact mobile section index, same-tab internal navigation, and a print layout.

## Verification

- Compared every rendered CV section against the previous complete CV: all text and source links preserved. Ten sections, 34 headings, and 151 list entries.
- Production build passed.
- Existing link audit passed across 69 HTML files.
- SEO audit passed for 38 indexable pages. ProfilePage now describes CV; blog and publication authors link to CV. Four publication pages and two RSS items remain included.
- Eight browser cases passed at 320, 390, 768, and 1440 pixels in both themes.
- Four automated WCAG A/AA scans passed with no reported violations on the CV page. This is not a full accessibility certification.
- Checked the active CV navigation item, section anchors clearing the sticky header, About redirect, homepage CV button, same-tab PDF target, and print layout.
- Inspected desktop and mobile screenshots. A mobile section-number wrapping issue was corrected and the final screenshots regenerated.
- `git diff --check` passed.

Evidence: [content comparison](2026-10-02-cv/content-validation.json), [browser checks](2026-10-02-cv/browser-validation.json), and [screenshots](2026-10-02-cv/).

## Deployment

This update extends [PR #37](https://github.com/nimdvir/nimdvir.github.io/pull/37), which also contains the canonical-domain migration, publication pages, Scholar metadata, and RSS. Nim has approved merging and publishing the combined work. The merge and GitHub Pages workflow record the final deployment result.

The custom domain served the site over HTTP during preparation. HTTPS requests returned HTTP 502 through the execution environment's proxy. That limitation is separate from the repository build and will be checked again after deployment. No DNS or registrar settings were changed.
