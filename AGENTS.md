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

- Work directly on `main`, keep files organized, and commit/push requested work there. Nim authorized this workflow on October 24, 2026. Do not create a review branch or require a PR unless Nim asks.
- Saving to `main` and publishing are separate actions. Pushes run build and verification only. Never publish or run the Pages workflow with `publish: true` until Nim explicitly approves publication.
- Keep source packages, translation drafts and templates outside `src/content/` until publication is requested. The current interviews collection does not enforce `draft` visibility.
- For this repository, these instructions replace earlier branch-first and push-approval wording in templates, reports and the article-inventory skill. Other article-preservation and translation rules still apply.
- For review in ChatGPT, present Markdown as formatted text directly in the chat by default. Do not require Nim to download Markdown files. Offer a native ChatGPT Page for a longer standalone reading view; the repository remains authoritative.
- Nim explicitly approved publishing PR #37, including the complete designed CV and pending domain/discoverability changes, on October 2, 2026.
- Build with `npm run build` and check links with `python scripts/verify_site.py`.

## Writing pipeline

- Nim's article list is `data-source/writing/articles.csv`; its columns are explained in `data-source/writing/README.md`.
- Use `.agents/skills/capture-article/SKILL.md` for Hebrew-first extraction and archive inventory updates, then `translate-article` for Claude translation after Nim selects articles. Hebrew capture does not authorize translation.
- Nim's writing-voice profile is `data-source/writing/voice-profile.md`, with its evidence record in `voice-profile-evidence.json`. Read it before translating or drafting on Nim's behalf; the individual article leads where they differ. The profile is a draft until Nim reviews it.
- Python dependencies for the scripts in `scripts/writing/` are in `requirements.txt`.
