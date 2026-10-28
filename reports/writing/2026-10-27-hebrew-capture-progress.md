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

## Continuing Work session: batch 1

Five further original interviews verified and registered: W011 (Chiwetel Ejiofor), W052 (Jennifer Lopez), W080 (Fantastic Four cast), W165 (Michael Fassbender), W186 (Ryan Gosling). The inventory now references nine unique Hebrew Markdown and clean HTML packages. Each new source record includes source-response and text-block hashes, first/final paragraph checks, prompt counts, image provenance and the APA citation. Publisher articleBody metadata independently matched all substantive source text in order.

The four baseline packages were checked against fresh HTTP 200 publisher responses. Every substantive body text node, including raw tails, is present. W010's sidebar photo credit, אלירן אביטל, was recovered and added; its article body is unchanged. New licensed replacement photos remain pending. W005's listed source URL resolves to an unrelated medical column; W165 records the evidence without modifying the existing published English article or claiming W005 is fully resolved.

Inventory validation, Astro build, local site verification and SEO verification pass. Standalone HTML rendering is being checked with WeasyPrint; the Chromium download was unavailable in this environment. Further batches are in progress. No deployment or translation was performed.

## Continuing Work session: batch 2

Five more verified packages: W122 (Aaron Eckhart and Yvonne Strahovski), W163 (Noa Tishby), W171 (Darren Star), W174 (Spike Lee), W176 (Seth Rogen and Zac Efron). The inventory now references 14 unique Hebrew Markdown/HTML packages. W163 and W176 are complete online editions; their publishers advertise additional print-only material that has not been captured. W174 required recovery of substantive text outside normal paragraph tags.

Added `scripts/writing/check_captures.py` to validate UTF-8 YAML metadata, canonical IDs, Hebrew RTL HTML, reciprocal archive links, copyable citations, recorded first/final paragraphs, and Markdown paragraph agreement with HTML. This supplements the existing inventory validator and does not assert live publisher completeness by itself. Dependencies are listed in `requirements.txt`.

## Continuing Work session: batch 3

W021 (Eva Mendes), W023 (Matthew Broderick), W035 (Patti Stanger), W097 (Karim Rashid), W108 (Ester Rada) add five verified packages, bringing registered unique packages to 19. W097's direct response was HTTP 403; Firecrawl recovered the full publisher HTML and its source paragraphs/captions were checked in order. W035/W108 capture complete online editions, not the additional print-only material they advertise. Archive and inventory validators pass. A trailing space inside W108's subtitle emphasis was removed so Markdown renders the intended emphasis; its wording is unchanged.

## Continuing Work session: batch 4

W003 (Julia Louis-Dreyfus) and third-party coverage W083, W197, W198 now have complete verified packages. W083 is by Amir Bogen; W197/W198 retain the nrg Maariv byline. These coverage records remain `not my writing` and have `styleSample: false`. W003 remains `published`; no English page was changed.

W090/W003 and W096/W089 are confirmed duplicates: full-body hashes, publisher canonical links and structured article metadata agree. Both IDs remain in the inventory with shared canonical Hebrew and HTML paths and separate duplicate-evidence source records. W090 retains its existing `needs checking` status; its note now records the resolved duplicate evidence. There are 23 unique packages covering 25 inventory IDs. Both validators pass.

## Continuing Work session: batch 5

Nine further packages: W001 (Jamie Foxx), W002 (Jim Carrey), W004 (Lady Gaga), W006 (RuPaul), W056 (Tim Burton at MoMA), W058 (Michael Lucas film-set reporting), W093 (silent meditation retreat), W158 (Homeland set visit), W172 (Steve Buscemi). Published English-page statuses were retained. Xnet's current W093/W158 responses expose no article-specific photograph URLs; photo recovery is explicitly pending and no unrelated default image was substituted. W011/W165/W186 reading copies also now retain the source trailer captions at their original positions. There are 32 unique packages covering 34 inventory records; both validators pass.

## Continuing Work session: batch 6

Ten more verified packages: W118 (Randy Harrison), W125 (David Duchovny), W126 (Mel B), W182 (Emma Watson), W185 (Mike Henry), W071 (LGBTQ television), W079 (returning to Israel), W087 (online bystanders), W094 (Annapurna memoir), W159 (Anni-Frid Lyngstad feature). NRG responses were explicitly decoded as Windows-1255 despite misleading HTTP charset headers. W159 preserves literal source punctuation defects and remains a feature using attributed secondary quotations, not a claimed direct interview. W126 is the complete online edition, with print continuation outside capture scope.

Cross-review restored W174's trailer caption and W176's relevant Hollywood Reporter hyperlink, and removed a Facebook promotion from W126. No original substantive wording was changed. All 42 unique packages, covering 44 IDs, pass the saved-package and inventory validators.
