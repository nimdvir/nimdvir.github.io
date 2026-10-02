# Website copy and navigation revision

October 2, 2026. Nim approved the revised outline and asked to proceed after reviewing the link fix in PR #36.

## Changes

- Replaced slogans and repeated collaboration pitches with page titles, specific descriptions, roles, and dated research status.
- Shortened Home to the introduction, news, recent posts, and current work. Added a labeled Home link with a house icon throughout the shared navigation and mobile menu.
- Removed the global new-tab target. Internal pages, local files, and section anchors stay in the current tab; external sites open a new tab with opener protection. The CCE site is a separate destination on the same hostname.
- Published `Rebuilding this website` as the first blog post. The existing website news item now links to it.
- Revised all 12 project descriptions and six published research descriptions. Kept all original project document, prototype, and image links. Original interview articles remain unchanged.
- Updated the HTML CV and regenerated its 10-page PDF. Removed promotional summaries and unsupported outcome percentages from the public copy. Preserved appointments, education, publication records, and dated manuscript status. Fixed the HTML heading hierarchy while preserving the PDF layout.
- Updated authoring templates and repository guidance to avoid em dashes, slogans, and self-promotion. Archived quotations and formal publication titles retain their source wording.
- Kept the CCE favicon, faculty-profile icon button, and theme picker. Adjusted the menu breakpoint to fit the added Home item.

## Verification

- Astro production build: passed, 37 generated routes.
- Existing integrity check: passed for 65 HTML files, local links, assets, fragments, image alternatives, the 12-project archive, CV, and unlisted design page.
- Browser checks: 16 representative routes at 390, 1100, 1101, and 1440 pixels in light and dark modes, 128 cases. No horizontal overflow or site JavaScript errors. Link targets and the Home active state were checked throughout.
- Browser interactions: Home and About reused the current tab; the external faculty link opened a new tab without an opener; the theme picker switched modes.
- Four axe-core WCAG A/AA scans on the revised Home, About, Teaching, and blog-post pages found no violations in dark mode. These checks are not a complete accessibility audit.
- Visual review: homepage on phone and desktop; PDF page contact sheet and final first page. PDF text extraction confirms ten nonblank pages.
- Original project materials and interview content preservation checks: passed.
- `git diff --check`: passed.

The browser checks used local Chromium with external resources blocked. External destinations, third-party embeds, and font services were not availability-tested. Link behavior was checked with JavaScript enabled; the global new-tab setting is also absent from the static HTML.

Evidence: [validation results](2026-10-02/validation.json), [desktop dark](2026-10-02/home-dark-1440.jpg), [desktop light](2026-10-02/home-light-1440.jpg), [phone dark](2026-10-02/home-dark-390.jpg), [phone light](2026-10-02/home-light-390.jpg).

Publication is handled through [PR #36](https://github.com/nimdvir/nimdvir.github.io/pull/36) and the existing GitHub Pages workflow. This record precedes the merge; the final deployment state is recorded in GitHub.
