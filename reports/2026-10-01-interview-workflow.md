# Workflow for preserving and translating interviews

Date: October 1, 2026. Status: recommendation for Nim's review; no new interview has been published.

## Recommended approach

Keep an original source copy, a clean Hebrew transcript, and a reviewed English Markdown article. Publish the English article through the existing `interviews` collection so it inherits the site's layout, theme, related interviews, and citation section. Extract the main article only: no site navigation, ads, comments, recommendations, or unrelated articles.

## Example checked

- Original: https://www.ynet.co.il/articles/0,7340,L-4141079,00.html
- Publisher: Ynet.
- Author: Nimrod Dvir, New York.
- Published: November 2, 2011, 16:39 as displayed by the publisher. No timezone is stated here.
- Interviewee: Matthew Broderick.
- Proposed English headline: *Social Justice in the Big Apple: An Interview with Matthew Broderick*.
- This page's main article was readable on October 1, 2026. It has a headline, subheader, introduction, section headings, interviewer prompts, answers, and image captions. Preserve that order.

## Repeatable steps

1. **Identify and capture the source.** Record the URL, publisher, original title, byline, displayed publication date, and access date. Save the original page as a self-contained HTML/MHTML file where supported and a print-to-PDF copy. Check that the entire article is present. Keep raw snapshots in the existing private source workspace, outside this public repository. A link alone is not an archival copy.
2. **Extract the main article.** Use the article body, not the whole page. Save UTF-8 Markdown in Hebrew, with the headline and subheader separated from the body. Preserve section headings, paragraph order, questions, quotations, captions, and photo credits. Compare the first and final paragraphs against the original to catch incomplete extraction.
3. **Translate faithfully into English.** Translate the headline, subheader, body, and captions. Keep every interviewer prompt in **bold**, including prompts that do not end with a question mark. Keep answers as normal paragraphs and section headings as `##`. Retain humor, quotation boundaries, names, and dates. Verify established English film titles. Do not turn a translation into a summary or invent missing passages.
4. **Review the translation.** Compare it paragraph by paragraph against the clean Hebrew source. Check speaker attribution, all interviewer prompts, proper nouns, omitted content, and any ambiguous phrases. Mark unresolved passages in the working draft rather than publishing guesses. Label the final page as an English translation from the Hebrew original and record the reviewer and revision date in the source record.
5. **Prepare images or source evidence.** Preserve original captions and credits. Use images available for republication or supplied by Nim, hosted with the site's existing image workflow. If a complete page cannot be saved, retain screenshots of the article in the private source folder and record missing parts. Screenshots preserve evidence; they do not replace readable text. Do not silently scrape blocked images or publish the full news page, including its unrelated assets and scripts.
6. **Create the interview Markdown.** Add the reviewed English text under `src/content/interviews/matthew-broderick.md`. Reuse the existing interview schema and layout. Put the translated subheader first in the Markdown body because the current template uses `summary` for metadata but does not display it beneath the headline. Avoid duplicating the headline in the body.
7. **Show provenance and citation.** Include an obvious “Read the original in Hebrew” link, a translation note, author, publisher, original publication date, and a copyable citation. A public downloadable archive can be added separately if appropriate; otherwise keep preservation files private and link to the publisher. The existing template already renders a citation section and source link. A dedicated copy-citation button, original-title field, and translation metadata would be small future template improvements, not features already implemented by this recommendation.
8. **Review on the branch.** Build, inspect the article in both themes and at phone width, check source/image links and question formatting, and compare the citation with the source metadata. Open the page for Nim to review before merging it to the live site.

## Suggested source package

Use the existing private article-source workspace; do not create a separate knowledge-base system.

| File | Purpose |
| --- | --- |
| `source-record.md` | Original URL, title, author, publisher, dates, image credits, capture method, omissions, reviewer |
| `original.html` or `original.mhtml` | Original page capture when available |
| `original.pdf` | Visually checkable source backup |
| `article.he.md` | Main article only, in Hebrew |
| `article.en.md` | Reviewed English translation |
| `images/` | Selected usable images and their credits; private source screenshots if needed |

Only the final English article and intended public images belong in the public website. The current repository ignores `migration/originals/` and `migration/staging/`; those ignored paths are not durable backups.

## Existing-schema starter

This is a draft template, not a completed translation. Do not publish the bracketed placeholders.

```yaml
---
title: 'Social Justice in the Big Apple: An Interview with Matthew Broderick'
interviewee: 'Matthew Broderick'
date: 'Nov 2, 2011'
tags: ['Interview', 'Film', 'Media']
summary: '[Faithful English translation of the original subheader]'
source: 'Ynet'
sourceUrl: 'https://www.ynet.co.il/articles/0,7340,L-4141079,00.html'
---
```

Follow the frontmatter with the translated subheader, a short translation/source note, the introduction, the original section sequence, and alternating bold interviewer prompts and normal answers. Add `image` and `heroImage` only when usable image URLs are ready.

## Suggested citation display

For the source, use the original article title with an English translation in brackets, rather than implying that Ynet originally published the English wording. The visible citation should identify Dvir, N.; November 2, 2011; Ynet; and the source URL. Label the on-site version separately as an English translation. A future copy button can copy plain text while the citation remains selectable without JavaScript.

## Reusable instruction

> Prepare an English interview page from the supplied original article and source files. Extract only its headline, subheader, main text, section headings, interviewer prompts, and relevant captions/credits. Preserve all content and paragraph order; translate faithfully without summarizing. Make every interviewer prompt bold. Follow the existing interview collection and layout. Include author, original date, publisher, a prominent original-language link, a translation note, and a source citation. Preserve a private original capture where available and document any missing content or images. Do not publish placeholders or unsupported details. Build and check the draft in both themes at phone and desktop widths, then leave it on the review branch.
