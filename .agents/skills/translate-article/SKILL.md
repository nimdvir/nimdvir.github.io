---
name: translate-article
description: Work through Nim's article list (data-source/writing/articles.csv) - find the next article Nim chose to translate and record progress. Use when asked to translate, capture or publish one of Nim's Hebrew articles, or to update the article list.
---

# Translate an article from Nim's list

This skill currently covers only reading and updating the list. Capture, translation and page steps will be added later; until then follow `reports/2026-10-01-interview-workflow.md` for those.

1. Read `AGENTS.md` first and follow it.
2. Read `references/inventory.md` for how the list works.
3. Run `python scripts/writing/check_inventory.py --queue`. Take the first row in the queue whose Status is not `published`, unless Nim names a different ID.
4. After each step, update that row's Status and path columns, then run the check again.

Hard rules:

- Never change Translate?, Priority, or Notes that Nim wrote. Add your own notes after his, separated by `; `.
- Never redo a step whose Status shows it is done, unless Nim asks.
- Work on `main` locally and commit. Do not push without Nim's explicit approval: pushing to `main` publishes the site.
