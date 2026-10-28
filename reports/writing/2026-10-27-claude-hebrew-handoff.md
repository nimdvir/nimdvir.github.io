# Claude handoff: verified Hebrew source corpus

As of the October 27, 2026 Work session, `data-source/writing/articles.csv` contains 198 stable IDs. It references **55 unique verified Hebrew Markdown articles and 55 clean HTML reading copies, covering 57 IDs** through two proven duplicate relationships. Fifty-one unique articles were newly captured in this session. There are 141 IDs without a registered Hebrew body; this includes the English wrong-person record W100.

## Find the source

Use each row's `Hebrew Markdown Path` and `Clean HTML Path`. The canonical package is `data-source/writing/originals/W000-topic/` with `article.he.md`, `article.he.html`, and `source-record.json`. Read the source record before translation: it documents verified text boundaries, authorship, online/print scope, source defects, media captions, and citation evidence. The CSV remains the sole inventory; do not create another translation-selection list.

- W090 shares W003's canonical files; W096 shares W089's. Separate duplicate-evidence records retain both IDs. Do not translate duplicate packages twice.
- W046's existing English draft remains at `data-source/writing/translations/W046-julianne-moore/article.en.md`.
- The six existing published English interview pages and all English drafts are unchanged.
- `Translate?` and `Priority` are unchanged for every ID. Hebrew capture does not select or authorize additional translations. Existing later statuses were retained; `needs checking` can coexist with a verified capture when an older inventory review flag remains, notably W090/W107.

## Authorship and voice

W016 (Yuval Ganor), W083 (Amir Bogen), W095 (Dan Margalit with separately credited companion reporting), W197/W198 (nrg Maariv) are third-party coverage, not examples of Nim's writing. W095 gives Nim a photograph credit. W106 is coauthored by Dana Darvinsky and Nim; retain both authors and qualify any style analysis accordingly. W100 is an English article by **Boaz Dvir**, not Nim, and is excluded from Nim's corpus.

For selected translations, follow `AGENTS.md`, `.agents/skills/translate-article/SKILL.md`, and `templates/writing/README.md`. Preserve every substantive paragraph, question, interviewer statement, answer, heading, quotation, joke, idiom, register shift, and historical context in the same order. Keep prompts bold and answers in their original paragraph boundaries. Do not add summaries, conclusions, invented quotations, factual corrections, or a smoother generic voice. Source quirks belong in review notes. Published Hebrew quotations are the translation source; do not claim to recover the original spoken English interview.

Keep the archival footer separate from the original story. Its bracketed English citation-title gloss is bibliographic metadata, not an article translation. Check existing English versions before making new drafts. Write authorized translations to the separate `translations/W000-topic/` folders, outside Astro content collections; do not publish the website.

## Source limits

The packages preserve complete accessible **online editions**. W035, W108, W116, W126, W163, W164, and W176 advertise longer print material that was not recovered. Do not translate an online excerpt as though it were the full print interview. Source records document this limit.

W005 has an incorrect publisher URL and only an abridged overlap with W165's verified interview; keep it unresolved. W101–W105/W110 Blogspot originals return 404. W111/W112 lack unique article URLs; title matches do not prove duplicates. Candidate Hebrew counterparts are recorded in their source-only records, with no invented text or shared paths.

Publisher photographs were not newly downloaded or rehosted. Original captions and provenance are retained; licensed replacements remain pending. Older W046/W089 retain remote publisher image references. Missing image references and empty publisher media containers do not justify inventing images or captions.

## Checks

Run `python scripts/writing/check_inventory.py` and `python scripts/writing/check_captures.py` after installing `requirements.txt`. Saved-package checks validate metadata, UTF-8/RTL HTML, reciprocal links, citations, boundaries, and Markdown/HTML paragraph agreement. They supplement the source comparisons in each record; they do not independently prove live completeness.

See [capture progress](2026-10-27-hebrew-capture-progress.md) for session results, blockers, validation, and commits. No full article translation was created during this session.
