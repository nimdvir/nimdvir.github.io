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

## Home gallery

- "Home gallery" is the rotating photo gallery on the home page. Each slide is an entry in `src/data/home-gallery.ts`; the component is `src/components/HomeGallery.astro`. Upload new photos to Cloudinary first, then add an entry. When adding photos, suggest other good candidates too.

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
- Nim's writing-voice profile is `data-source/writing/voice/voice-profile.md`, with its evidence record in `voice-profile-evidence.json`. Read it before translating or drafting on Nim's behalf; the individual article leads where they differ. The profile is a draft until Nim reviews it.
- Python dependencies for the scripts in `scripts/writing/` are in `requirements.txt`.

## Article formatting

- Every article page and blog post gets a side navigation automatically (`src/components/ReadingNav.astro`, used by the article and blog post templates; the text element carries `data-reading-body`). It lists only the article's `##` subheadings, as teasers ("Five Years Back, at NYU"), marks what the reader has passed, and shows minutes left and an "Up next" article. On narrow screens it rests as a small circle under the header (a progress ring with the section number, "2/4"). It opens for a moment to name each new subheading as the reader reaches it, then shrinks back; tapping the circle opens the full list. No timer on small screens.
- Format every translation so this works: each intertitle from the Hebrew is a `##` subheading. Don't invent subheadings the original doesn't have. When an article has fewer than two, up to five of its own interview questions, spread through the piece, stand in; a piece with neither still gets "Up next".
- Each interviewer prompt is its own paragraph, entirely in bold (styled as a question by `markQaPrompts` in `astro.config.mjs`). Bold inside a sentence, such as a name, stays inline; never bold a whole paragraph that isn't a prompt.
- Article pages open with the big picture, then the person's name (interviews), title, subtitle and one meta line, with a small "Archived Hebrew" link at the top.
