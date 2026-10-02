# Personal website instructions

## Writing

- Do not use em dashes in new or revised copy.
- Let specific facts describe Nim's work. Avoid slogans, self-promotion, grand claims, and sales language.
- Write naturally, with contractions and occasional dry humor when it fits. Do not invent anecdotes or force jokes into every page.
- Preserve attribution, research status, and the distinction between Nim's work and student work he advised.
- Nim approved the revised content outline and publication on October 2, 2026. Future substantial copy revisions should follow the same review process.

## Navigation

- The main navigation uses CV in place of About. `/about/` redirects to the complete CV at `/cv/`.
- Internal pages, local files, and section anchors open in the same tab.
- External websites open in a new tab with `rel="noopener noreferrer"`.
- The CCE workshop is a separate site even though it shares the GitHub Pages hostname.
- Email and telephone links use their normal handlers.
- Do not add a global `base target="_blank"`.

## Review and publishing

- Make changes on a feature branch and open a pull request for review.
- Do not merge or publish to `main` unless Nim explicitly approves publication.
- Nim explicitly approved publishing PR #37, including the complete designed CV and pending domain/discoverability changes, on October 2, 2026.
- Build with `npm run build` and check links with `python scripts/verify_site.py`.
