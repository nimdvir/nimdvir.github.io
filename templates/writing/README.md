# Preserve and translate an article

Use `data-source/writing/articles.csv` to choose work by permanent ID. This workflow separates the Hebrew extraction from the English translation, while keeping the same article ID in both. It supersedes the proposed folder layout in `reports/2026-10-01-interview-workflow.md` for this repository workflow.

## Files and folders

| Purpose | Template or location |
| --- | --- |
| Shared website tag vocabulary | `src/data/tags.json`; readable guide in `templates/TAGS.md` |
| Hebrew extraction template | `templates/writing/hebrew/article.he.md` |
| English translation template | `templates/writing/english/article.en.md` |
| Hebrew source package | `data-source/writing/originals/W000-subject/` |
| English translation package | `data-source/writing/translations/W000-subject/` |
| Formatted example preview | `reports/writing/previews/W046-julianne-moore.html` |

The source package contains `article.he.md`, a clean article-only `article.he.html` keeper and `source-record.json`. The translation package contains `article.en.md` and `translation-review.json`. When image files can be captured, keep them under the source package's `images/` folder and record both their original URL and local filename. Otherwise embed the original image URL and record `source-linked`; a linked image is not an archived image file.

These working folders are outside Astro's content collections and are not generated as website pages. The repository is public, so committed source packages and drafts are still readable on GitHub. Do not put private material in them.

## Hebrew-first archive agreement (October 2026)

- ChatGPT handles capture of the full Hebrew article into the existing `originals/W000-slug/article.he.md`, a text-only `article.he.html` keeper and a provenance `source-record.json`. Claude handles English translation later; capture does not automatically initiate translation.
- All 198 inventory IDs are eventual Hebrew capture candidates, including interviews, features, columns, reports and third-party coverage **about** Nim. For pieces not authored by Nim, preserve the original byline and label them as third-party coverage; do not use them as Nim style samples.
- Prioritize High-value original interviews and exclusive reporting, then notable coverage about Nim, then Medium/Low items. Never skip a record silently; record blocked/missing sources, duplicates and authorship doubts without inventing text.
- Every captured Markdown file ends with a clearly separated **archival** citation section: APA 7 (romanized Hebrew title with bracketed English translation as appropriate), a direct original URL and a relative link to `article.he.html`. Make the citation copyable as a plain-text fenced block. The HTML footer repeats the citation and the source link.
- Record the canonical Markdown path in `articles.csv` -> `Hebrew Markdown Path` and the article-only HTML path in `Original HTML Path` after both files are checked. If an earlier `Original HTML Path` points to a publisher PDF or other evidence, do **not** replace that pointer; keep it and put the additional HTML backup path in Notes/source-record.
- Set Status to `captured` only when it was `not started`. Preserve `translated`, `page created`, and `published` statuses and never change Translate?, Priority, or other editorial choices.
- Preserve full original Hebrew text, headings, questions, quotations, dates and captions. Do not contaminate it with editorial corrections, translations or invented sections. Place all non-original notes *after* the article divider or in `source-record.json`.
- Source image URLs and original captions are provenance, not automatically reusable photos. Do not download/rehost publisher-owned images or imply a photo depicts the original interview unless the license and context support it. Replacements must be from genuinely free-to-reuse sources with license URL, photographer and attribution recorded. Never say a remotely linked image is a local backup.
- Work directly on `main`, but **do not publish** the GitHub Pages site or move drafts into `src/content/` without separate explicit approval.

## 1. Extract the complete Hebrew article

Read the original, not just a search excerpt. Preserve its title, subtitle, byline, publication date/time, paragraph sequence, section headings, questions, speaker labels, quotations, relevant images, captions and photo credits. Remove navigation, ads, comments, sharing controls and unrelated recommendations.

Do not rewrite the Hebrew or silently fix apparent errors. Preserve quoted speech, humor and historical wording; put ambiguities and apparent errors in `source-record.json`. If the source has no subtitle, heading or pull quote, do not invent one.

Keep every interviewer prompt bold and in its own paragraph, including statements without question marks. Preserve the answers' paragraph boundaries and quotation marks. A rhetorical question in a narrative paragraph is not automatically an interviewer prompt.

Check text outside normal paragraph tags as well as text inside them. Compare the first and final paragraphs, count substantive text blocks and interviewer prompts, and check each image/caption against the source. Record sidebar images as sidebar images rather than guessing an original inline position. Record missing credit as null; do not invent a photographer or claim image reuse has been cleared.

## 2. Translate into a separate English file

Copy the English template to the translation folder. Translate from the checked Hebrew extraction, retaining all substantive content and its order. Preserve the original voice and meaning, including the interviewer's jokes and follow-up statements. Do not add a summary, new narrative, new sections or a conclusion.

Translate title, subtitle, image descriptions and captions. Use established English names and work titles, recording ambiguous choices separately. Preserve historical statements unless Nim asks for corrections. Quoted English dialogue is a translation of the published Hebrew; do not represent it as the recovered wording of the original spoken English interview.

The presentation order is title, subtitle, byline/date/source, introduction, source images and headings in their original positions, then the article's original sequence of narrative and Q&A. Each interviewer prompt is `**bold**` with a blank line before and after. Answers use normal paragraphs. An optional pull quote may repeat an exact translated excerpt for display if the source has one or Nim requests it; it must not replace body text or introduce new wording. A caption is separate from the interview text.

## 3. Review and record progress

Compare the English draft paragraph by paragraph with the Hebrew. Check all prompts, response paragraphs, speaker attribution, titles, numbers, dates, images and captions. Remove template instructions and placeholders from real files. Record translation choices and source problems separately from the article body.

Update only the selected article's Status, Translation Path, English title and review flags. Preserve permanent ID, Translate?, Priority and existing Notes; append progress notes rather than replacing them. `translated` means an English draft exists, not that Nim has approved publication. Never select more articles automatically because one example was requested.

## Saving and publication

Work directly on `main` and save requested work there. Main pushes build and verify the repository but do not deploy the site. Only after Nim explicitly approves publication may the Pages workflow be run manually with `publish: true`. Keep translation drafts in the working folders until then. For ChatGPT review, show the Markdown as formatted chat text by default rather than requiring a file download.

## Existing website compatibility

The current interviews layout renders its own title, byline, date and citation. Do not add a duplicate H1 to the English body. Its `summary` field is metadata and is not displayed as a subtitle, so keep the translated subtitle at the beginning of the Markdown body for now. Optional cover images should not duplicate the same image in the body without a deliberate design choice.

The current interviews collection does **not** filter on `draft`. Keeping `draft: true` in the working translation records its state, but does not protect a file copied into `src/content/interviews/`. Keep drafts in the translation workspace until Nim asks for publication. Adding subtitle, draft filtering, pull-quote and image-caption support to the live interview layout is a separate implementation step. Non-interview articles should not be forced into the interviews collection.

Tag archives are also a separate implementation step. `templates/TAGS.md` describes the single shared tag vocabulary and the intended cross-collection archives; it does not claim those routes already exist.

## Example: W046, Julianne Moore

- Original: https://www.ynet.co.il/articles/0,7340,L-3219720,00.html
- Hebrew: `data-source/writing/originals/W046-julianne-moore/article.he.md`
- Article-only HTML keeper: `data-source/writing/originals/W046-julianne-moore/article.he.html`
- English: `data-source/writing/translations/W046-julianne-moore/article.en.md`
- Formatted preview with English/Hebrew toggle: `reports/writing/previews/W046-julianne-moore.html`
- Completeness: 25 substantive text blocks, including all 8 interviewer prompts; 2 source-linked article images with captions. The source image files could not be retrieved by the available image-fetch tool, so the images remain remote references.
- Two substantive paragraphs appeared as raw HTML tail text after empty paragraph tags. Both were recovered and retained. The second image was in a source sidebar and is retained after the body in the linear Markdown.
- The original gives Moore's age as 46 and uses two Hebrew variants for Freedomland. The Hebrew is unchanged; the translation retains the age and uses the established English film title. No new section headings or pull quote were added to this example.

The preview demonstrates typography and layout for review. It does not change the live site or publish the English draft.
