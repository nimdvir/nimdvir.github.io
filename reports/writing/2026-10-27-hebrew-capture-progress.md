# Hebrew article archive: capture progress (2026-10-27)

## Responsibility and workflow

- Hebrew article extraction, clean Markdown and clean HTML archive, source provenance, APA citation and inventory updates: ChatGPT.
- English translation and translation review: Claude, later, on Nim's selection. **Do not translate automatically during Hebrew capture.**
- Commit requested archive work to GitHub `main` without triggering the separate website publication workflow.
- Source of truth: `data-source/writing/articles.csv`. Stable IDs never change.
- Capture instructions: `.agents/skills/capture-article/SKILL.md`; translation instructions: `.agents/skills/translate-article/SKILL.md`.

## Progress

Four complete Hebrew Markdown articles are now identified in the 198-row inventory; **194 more IDs are not yet captured in that field**. Capture is independent of whether an English version is already published or drafted.

| ID | Subject | Source | Hebrew Markdown | Clean HTML | Inventory status |
| --- | --- | --- | --- | --- | --- |
| W007 | Megan Hilty and Katharine McPhee, *Smash* | Ynet (2013) | `data-source/writing/originals/W007-smash-interview/article.he.md` | `data-source/writing/originals/W007-smash-interview/article.he.html` | captured |
| W010 | Bill Masters, *Seinfeld* screenwriter | Ynet (2009) | `data-source/writing/originals/W010-bill-masters/article.he.md` | `data-source/writing/originals/W010-bill-masters/article.he.html` | captured |
| W046 | Julianne Moore | Ynet (2006) | `data-source/writing/originals/W046-julianne-moore/article.he.md` | `data-source/writing/originals/W046-julianne-moore/article.he.html` | translated (existing draft retained) |
| W089 | Jodie Comer and Sandra Oh, *Killing Eve* | Israel Hayom (2019) | `data-source/writing/originals/W089-killing-eve/article.he.md` | `data-source/writing/originals/W089-killing-eve/article.he.html` | captured |

W007 and W010 were newly extracted on 2026-10-27 from accessible full publisher articles. Four unrelated Ynet promotion blocks were excluded from W007 while retaining the story and interview prompts; both records include original publisher image locations/captions and a source-linked sidebar image as provenance. No publisher photo was downloaded or rehosted. W046 and W089 were previously extracted and received APA 7 and archive-source footers on 2026-10-27 without rewriting their Hebrew story text.

## Inventory changes

- Added `Hebrew Markdown Path` and `Clean HTML Path` fields, with complete paths for these four IDs.
- Preserved the separate `Original HTML Path` (which may contain source PDFs or older evidence), `Translation Path`, `Translate?`, `Priority`, and existing editorial notes.
- Changed W007 and W010 from `not started` to `captured`. Preserved later statuses for W046 and W089.
- Updated `scripts/writing/build_inventory.py` column schema, `scripts/writing/check_inventory.py` path checks and its new `--capture-queue` option, and both writing workflow documents.

## Next suggested archival candidates

1. More high-value celebrity interviews and firsthand reporting (e.g., W011 Chiwetel Ejiofor; W052 Jennifer Lopez; W080 Fantastic Four cast).
2. Important third-party coverage **about** Nim (including W083, W197, W198), with the **actual** original author correctly attributed, not Nim. Such coverage is portfolio evidence and **not** a writing-style sample.
3. Remaining Medium, Low and Unrated originals, provided the full source can be verified. Preserve duplicate IDs for provenance; don't invent missing text.
4. Work in small batches, verify each source's first and final substantive paragraphs, captions, question blocks and completeness before writing its CSV paths.

## Images and backups

- Text-only HTML is a clean reading archive, not an exact publisher webpage snapshot.
- Publisher images are not free to reuse merely because a URL is publicly accessible. New W007/W010 Markdown and HTML preserve captions but use no publisher photos. Older W046/W089 archive files still have source-linked publisher images, not downloaded photos.
- For later replacement images, require a genuinely reusable license (e.g., clearly documented CC BY/CC0), photographer, source and attribution record. A generic actor portrait must not be misrepresented as a photograph from the original interview.
- No new English translations or live site pages were created as part of this capture phase.

## Verification

The four selected CSV records have distinct paths to verified GitHub files. The CSV retained all 198 IDs and 194 unrelated records; unrelated columns in the four selected records were preserved. The full local Astro build and local `check_inventory.py` execution were not run in this connected environment; verify them in a local checkout or CI before treating this as a completed repository-wide audit.
