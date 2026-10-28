---
name: capture-article
description: Capture Nimrod Dvir's journalism and third-party portfolio coverage in complete original-language Hebrew Markdown plus a clean HTML reader, then register each capture in the canonical inventory. This is separate from Claude's later translation.
---

# Capture original articles: Hebrew archive

## Trigger and scope

Use for requests to archive, download, collect, preserve, capture, or process Nim's published articles. **Do not translate.** User has approved Hebrew Markdown and article-only HTML on repository `main`. GitHub `main` does not automatically publish the site; do not trigger manual Pages publication.

1. Read `AGENTS.md`, `templates/writing/README.md`, `data-source/writing/README.md`.
2. Open `data-source/writing/articles.csv`; use immutable IDs as the unit of work and `Hebrew Markdown Path` to avoid duplicate captures. Use `python scripts/writing/check_inventory.py --capture-queue` for a suggested queue, then manually consider original exclusive reporting and coverage of Nim. Do not alter `Translate?` or `Priority`; those control **English translation only**.
3. Prefer High-value celebrity interviews, exclusive reporting and personal/portfolio coverage, then the remainder. Validate that a piece is actually Nim's work before marking him author; articles **about** Nim go in the archive with the actual byline and cannot be used as samples of his own writing.
4. Locate the publisher's full accessible article. Do not attempt to reconstruct articles from snippets or summaries. If inaccessible, mark it as blocked for review, retain its source URL and skip the full-body file instead of fabricating text.
5. Save the complete, unchanged Hebrew copy to `data-source/writing/originals/W000-topic/article.he.md`; the source package also gets `article.he.html` (readable, self-contained CSS, no ads/nav/comments) and `source-record.json` (original URL, byline, date, extraction and verification notes, original image positions, captions and credits). The HTML is a *clean backup of article text*, not a browser snapshot or an image archive.
6. Preserve headline, subtitle, byline, first and final substantive paragraphs, section headings, every journalist question/prompt as a separate bold paragraph, speaker labels, quotes, original paragraph boundaries, captions and relevant publisher photos' provenance. Do not insert factual corrections, translated titles or image substitutions inside the original story. A source sidebar image may be preserved at the end with its original placement recorded.
7. Do **not** rehost publisher pictures just because the URL resolves. Later editorial replacement photos must carry a reuse-permitting license, photographer, credit, source URL and context; they are never presented as the original interview photographs. Missing original image URLs remain explicit in `source-record.json`; never silently insert broken embeds.
8. After the story, add a visible divider and `## מקור, גיבוי וציטוט (מידע ארכיוני; לא חלק מהכתבה המקורית)` with plain-text fenced APA 7 citation (romanize Hebrew title, bracketed English translation), original URL, relative `article.he.html` link, and a truthful note about whether images are local or remote. Include citation/source links in the HTML footer. Do not label a link to a publisher image as a downloadable local archive.
9. Verify full-body completeness and count substantive blocks and journalist prompts, image captions and all embedded URLs. Compare to a source copy where possible; document uncertain source typos or missing material in `source-record.json`. On any serious completeness doubt, retain draft with `needs checking` in the inventory rather than `captured`.
10. **Only after verification** set `Hebrew Markdown Path` and `Clean HTML Path` (preserve `Original HTML Path` unchanged; it may hold a distinct source PDF/HTML archive), and set `Status=captured` for `not started` rows. Preserve `translated`, `page created`, and `published` if they already reflect later work. Keep all other fields unchanged except append-only source notes needed for the archive. Run `python scripts/writing/check_inventory.py` and inspect that no unrelated CSV row changed.
11. Avoid moving source packages into Astro `src/content/` or triggering GitHub Pages publication. Claude later uses `Hebrew Markdown Path` for `article.en.md` and translation tracking.

## Acceptance checklist

- [ ] Full original Hebrew text verified and not editorially rewritten
- [ ] Markdown and HTML readable, valid UTF-8, no ads or navigation
- [ ] APA citation, publisher URL, and HTML backup link present
- [ ] All source image locations/captions preserved as provenance
- [ ] No unlicensed photo files or misleading photo replacements
- [ ] CSV path(s) point to the correct files, status reflects actual stage
- [ ] No re-extraction of existing IDs, no translation or deployment

For proof-of-concept examples review W046 (Julianne Moore) and W089 (Killing Eve). These existing packages keep source-linked images rather than downloaded copies.
