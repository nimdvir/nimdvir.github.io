---
name: translate-article
description: Translate a selected verified Hebrew article into English later; Claude is assigned this stage. Use the published article inventory and templates, not fresh scraping where the Hebrew capture already exists.
---

# English article translation (Claude stage)

1. Read repository `AGENTS.md`, `templates/writing/README.md`, and `data-source/writing/README.md`.
2. Use `articles.csv` and its `Hebrew Markdown Path` field to locate the verified Hebrew source. Do not re-extract a source that has been captured.
3. Translate only articles Nim explicitly selects (`Translate? = Yes` with a Priority, or an explicit single-article request). Capturing Hebrew is not a translation request.
4. Save English drafts in `data-source/writing/translations/W000-slug/article.en.md`, following the English template, preserving every paragraph, question, quotation and joke. No fabricated English interview quotations, editorial additions or claims of original English speech.
5. Compare the complete English draft with Hebrew, then update only its translation fields and preserve all captured paths and the source author's byline. Do not duplicate the archival APA source footer in the translated article body without deliberate formatting.
6. Push requested files to `main` per `AGENTS.md`; pushing does not publish the GitHub Pages website. Publication requires a separate explicit request.

The Hebrew capture stage is maintained in `.agents/skills/capture-article/SKILL.md` and never silently assigns translation work.
