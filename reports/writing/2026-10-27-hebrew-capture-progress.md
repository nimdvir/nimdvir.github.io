# Hebrew article archive: capture progress (2026-10-27)

## Latest Work session result

| Measure | Result |
| --- | ---: |
| Stable inventory records | 198 |
| Verified unique Hebrew Markdown articles | 55 |
| Unique clean standalone HTML backups | 55 |
| Inventory IDs covered by those packages | 57 |
| Newly captured unique articles this session | 51 |
| Newly covered IDs, including two confirmed duplicates | 53 |
| IDs without a registered Hebrew body | 141 |
| Documented source-only unresolved records | 9 |
| Documented excluded wrong-person English record | 1 (W100) |

The remaining 141 IDs include W100, which is actually by Boaz Dvir and has no verified Hebrew/Nim portfolio relationship. The other 140 are still potential archival candidates, subject to source and authorship verification. This is substantial progress, not completion of the entire inventory. The 198 IDs and their order remain unchanged.

Every captured package contains the verified Hebrew body, clean HTML, source record, original-source link, reciprocal reading-copy links, and a copyable APA 7 citation. No full article translation was created. Bracketed English citation-title glosses are bibliographic metadata only. No Astro content, existing English articles, CV, design, or website components were changed. GitHub Pages publication was not triggered.

## Verification and preservation

- `python scripts/writing/check_inventory.py`: **198 records, zero problems**.
- `python scripts/writing/check_captures.py`: **55 unique packages, 57 covered IDs, zero problems**.
- `npm run build`: passed. The website source and configuration were unchanged by archival work.
- `python scripts/verify_site.py`: passed, 68 HTML files.
- `python scripts/verify_seo.py`: passed, 38 canonical pages.
- All 55 HTML reading copies rendered at 1000-pixel desktop and 390-pixel mobile widths. First-page contact sheets were inspected; text-block bounds on all **638 rendered pages** showed no horizontal overflow. Chromium could not be installed because its download failed; WeasyPrint was used. Its RTL auto-margin issue needed a renderer-only direction workaround; saved article HTML was not changed. Existing remote images were omitted from QA rendering only.
- All Markdown frontmatter and JSON source records parse; citations and reciprocal links are present. Recorded first/final paragraphs and long Markdown paragraphs match the HTML copies.
- All original URLs, original PDF/HTML paths, translation/page paths, Translate?, Priority, editorial ratings/reasons, English titles, and existing later statuses were compared to the session baseline and are unchanged. Notes are append-only. W100's factual author/subject attribution was corrected with evidence; its translation choices were preserved.
- The four baseline captures were reverified against live publisher responses. New source comparisons included raw text outside paragraph tags, source-specific paragraph boundaries, questions without question marks, caption/credit locations, original links, and excluded promotions.

## Review, availability, and authorship

| IDs | Finding and action |
| --- | --- |
| W090 / W003 | Identical publisher full bodies and canonical metadata; W090 shares W003 files. Both IDs retained. W090's older `needs checking` status remains, with resolved duplicate evidence in Notes and its source record. |
| W096 / W089 | Identical full bodies; W096 shares W089 files. No duplicate copy created. |
| W005 | Listed URL resolves to an unrelated medical column. Existing English text overlaps an abridged portion of W165, but full identity is unproven. Published status and English page unchanged; source-only record retained. |
| W100 | Verified English article by **Boaz Dvir**, January 18, 2021. Corrected factual attribution and set `not my writing`; no Hebrew body invented. |
| W101–W105, W110 | Six English Blogspot originals return 404 by direct retrieval and Firecrawl. Possible Hebrew counterparts are evidence only; no unsupported shared paths. |
| W111, W112 | Workbook hyperlinks are section pages, not unique articles. Title matches do not establish exact duplicates. |
| W104 | Plausible Hebrew Orly Shani/Fashion Star interview found, but its identity with the missing English post remains unproven. |
| W016, W083, W095, W197, W198 | Third-party work. Preserve Yuval Ganor, Amir Bogen, Dan Margalit/companion reporters, and nrg Maariv attribution. Exclude from Nim's writing-style corpus. W095 includes Nim's photo credit. |
| W106 | Coauthored by Dana Darvinsky and Nim. Original listed URL is unavailable; verified official NRG mirror retained separately. Style analysis must account for coauthorship. |
| W035, W108, W116, W126, W163, W164, W176 | Complete online editions captured. Additional print-only material advertised by the source was not recovered. |
| W107 | Complete online body, headline and final raw-tail paragraph verified. Older `needs checking` status remains with clarification in Notes. |

Other pre-existing inventory review flags remain for future processing; source-only blockers are sorted after fresh candidates in `--capture-queue`. W167, for example, still lacks a unique source URL and was not resolved this session.

## Images and licensing

No new publisher photo was downloaded, rehosted, or represented as rights-cleared. New reading copies retain captions and credit provenance with placeholders; licensed replacement research remains pending. Existing W046/W089 remote image references were retained. W003 has three empty inline image URLs; W089 has two missing references. Xnet W092/W093/W107/W158 expose incomplete or absent article-photo references; unrelated default/furniture images were excluded. W107 has two empty media containers without source captions. No image or caption was reconstructed.

## Commits and Claude handoff

Eight article batches were committed and saved to `main` through the connected GitHub app after the checkout's unauthenticated Git push failed. The resulting remote trees were checked against the local commit trees before each ref update. Publication remains separate and was never requested.

- [Batch 1](https://github.com/nimdvir/nimdvir.github.io/commit/38f1bc8f9789e2ec81510ddf17d0cfda1712d5ba)
- [Batch 2](https://github.com/nimdvir/nimdvir.github.io/commit/2fd83a590f3caaadd0be4ae0fa0366b946d08533)
- [Batch 3](https://github.com/nimdvir/nimdvir.github.io/commit/f91da86b364dc99c45d79e74e0489d7faa8c901e)
- [Batch 4](https://github.com/nimdvir/nimdvir.github.io/commit/ccd97ba6512a0411bf4713c6dcd43a9d35cd2119)
- [Batch 5](https://github.com/nimdvir/nimdvir.github.io/commit/e1eb1cf30bd7162f2c8636c4d67b7030e532576c)
- [Batch 6](https://github.com/nimdvir/nimdvir.github.io/commit/bc74b154e30cc90241a8e1b9c95d244a99cb15bd)
- [Batch 7](https://github.com/nimdvir/nimdvir.github.io/commit/1c6d1b3356dcc4c5a7fed1e089ca86b9b7e0914d)
- [Batch 8](https://github.com/nimdvir/nimdvir.github.io/commit/ec65166a185a3e170f3ad7ccd0878c6cc27e3264)

[Claude handoff](2026-10-27-claude-hebrew-handoff.md) explains the canonical source locations, unchanged translation fields, duplicate handling, voice preservation, coauthorship, and print/media limits. Use the CSV as the sole authoritative inventory.

## Next priorities

Continue with remaining original interviews, especially W018 (Split cast), W029 (Dudi Cohen), W128 (Adi Neumann), W140 (Vered Feldman/Ofri Prishkolnik), W147 (Orna Datz), W149 (Hanna Laslo), W155 (Sarai Givaty), and W168 (Dana Semo), then other firsthand features, columns, criticism, and routine reporting. Work through existing review flags and archive sources for the missing portfolio posts without treating subject overlap as proof of duplication. Licensed images can follow text capture.

## Earlier baseline and incremental batch notes

The following sections preserve the earlier four-article snapshot and the session's incremental checkpoints. Their intermediate counts are historical; the table above is the current result.

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

## Continuing Work session: batch 7 and source-identity review

Five more packages bring the total to 47 unique articles covering 49 IDs: W162 (Raja Ram), W184 (New York drag reporting), W195 (Emma Stone feature), W114 (Murakami running-book review), W116 (Ben Shani). W116's online edition promotes a longer print feature; only the complete online text is claimed.

Ten source-only records now document unresolved identities or availability without fabricated article bodies: W005, W100–W105, W110–W112. Six Blogspot URLs return 404 both directly and via Firecrawl. W111/W112 workbook links lead to section pages rather than unique articles. W104's plausible Orly Shani original is recorded as a candidate, not a proven match. None of those suspected relationships supports safely sharing canonical Hebrew paths.

W100 is actually an English article by **Boaz Dvir**, dated January 18, 2021. Its author/subject attribution was corrected and its status set to `not my writing`; its editorial rating, Translate?, Priority and original URL were retained. It is not verified coverage about Nim and must not enter his style corpus. W005 retains its published status and all existing English content despite its incorrect source URL. Both validators pass.

## Continuing Work session: batch 8

Eight final packages: W016 (Yuval Ganor's response to Nim), W095 (Dan Margalit column and credited companion news; Nim photograph credit), W098 (Gila Gamliel), W106 (Sex and the City 2 review, Dana Darvinsky and Nim), W164 (Michael Lewis), W062 (holiday homesickness), W092 (Buddhism class), W107 (dogs in New York). W106 preserves its dead listed source URL and supplies the verified official NRG mirror separately. W107's full final paragraph was recovered from raw HTML text. Source bodies, source credits, prompts, captions and citations all verified. Existing `not my writing` and later statuses were retained; W107's older `needs checking` status remains with a clarification note.

Final inventory: **198 records, 55 unique Hebrew Markdown articles, 55 clean HTML copies, 57 IDs covered, 51 newly captured unique articles, 141 IDs without a registered Hebrew body**. Both archive validators pass. All 55 reading copies rendered at desktop and mobile widths; the 638 rendered pages have no text blocks extending outside page width. No newly licensed replacement photos were added.
