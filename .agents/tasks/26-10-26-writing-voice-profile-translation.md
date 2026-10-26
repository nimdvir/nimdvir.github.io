---
id: "beb317c1-4eb6-4769-b851-981a05494ec6"
title: "Create Nim's writing-voice profile for the article archive and English translations"
created: "2026-10-26"
status: "next"
priority: "p2"
kb_reference: pending
tags: ["writing", "blog", "portfolio", "translation", "voice", "personal-website"]
---

# Create Nim's writing-voice profile for the article archive and English translations

**Next action:** Select a representative, authorship-verified sample of Nim's Hebrew journalism from `data-source/writing/articles.csv`, analyze his voice and humor, and draft an evidence-based style profile for Nim to review *before* using it to guide further translation or writing.

## Context

This is a milestone of the **existing** article-collection, Hebrew-to-English translation, and personal-website portfolio workflow, not a replacement pipeline or a second inventory. The current inventory contains stable article IDs W001-W198, source/evidence fields, type, selection, priority, status, original files, and translation paths. Nim chooses which articles to translate and in what order. Do not reset the queue, change his choices, or assume every inventoried item is authored by him.

Nim wants the English versions of his published articles, and his future blog and portfolio writing, to sound recognizably like him rather than like generic AI copy. A writing-prompt suggestion he saved on 2026-10-26 emphasized analyzing tone, variation in sentence length, vocabulary, and humor from actual writing samples before drafting. Expand that idea into a reliable, reusable method, with source examples and his editorial approval. **Style should shape natural English, but factual and semantic fidelity to each original article takes priority.**

## Checklist

### 1. Assemble a representative sample
- [ ] Review `data-source/writing/articles.csv` and available original Hebrew article packages; preserve existing article IDs, `Translate?`, `Priority`, `Notes`, and progress.
- [ ] Choose an initial set of approximately 12-20 complete, clearly attributed articles, spanning interviews, columns/opinion pieces, features and/or reviews, multiple publications and periods where possible. Record the sample IDs and any gaps.
- [ ] Exclude unverified bylines, partial snippets, quotations primarily spoken by interviewees, and suspected duplicates from voice conclusions until verified. Distinguish Nim's language from editors' headlines, publication house style, interviewees' answers, and copied press material.
- [ ] Link each finding to specific article IDs and brief source passages, without treating a small or uneven sample as representative of his entire career.

### 2. Extract Nim's authentic voice
- [ ] Describe overall tone, personality, point of view, level of formality, emotional register, and shifts by audience and genre.
- [ ] Examine vocabulary, word choice, idioms, slang, cultural references, technical vs everyday language, recurring phrases, and distinctive ways of explaining ideas.
- [ ] Study sentence length **and variation**, syntax, clause structure, rhythm, punctuation, paragraph length, transitions, opening hooks, and endings.
- [ ] Study storytelling and argument structure: scene-setting, detail selection, descriptive density, rhetorical questions, directness, pacing, interview prompts and follow-ups, and changes in voice between narration and questions.
- [ ] Analyze humor in detail: dry wit, irony, sarcasm, playful exaggeration, understatement, timing, incongruity, self-deprecation (only if evidenced), and when he deliberately avoids humor. Do not manufacture jokes or turn every sentence into a punchline.
- [ ] Identify genre-specific patterns and how the Hebrew voice may need to be realized differently in idiomatic English.
- [ ] Record evidence, exceptions, confidence/limitations, and **do / do not** examples, not generic adjectives like "engaging" or "professional."

### 3. Translate without losing the writer
- [ ] Apply the approved voice profile in the existing Hebrew extraction -> English translation -> review workflow. Preserve meaning, facts, ordering, quotes, speaker attribution, irony, humor, intent, nuance, and paragraph structure.
- [ ] Adapt idioms when needed to sound natural in English, but flag nontrivial interpretation choices. Do not add anecdotes, editorial opinions, jokes, sections, claims, or omitted passages.
- [ ] Preserve original title/subtitle, interview questions, relevant images, captions and credits, original article links, archived article-only originals, publication/byline/date, and citation information according to existing templates.
- [ ] Run a content-faithfulness comparison against Hebrew **separately from** a voice/naturalness review. Never let stylistic polish conceal semantic drift.
- [ ] Respect Nim's explicit translation selections, retain drafts outside live `src/content/`, and require his approval before publishing.

### 4. Create reusable outputs
- [ ] Produce a source-grounded **Nim writing-voice profile** with examples, genre-specific notes, signature traits, known exceptions, and a concise one-page quick reference.
- [ ] Create a reusable **style-analysis prompt** and a separate **English translation / blog drafting prompt** (templates below), incorporating authentic samples and variables rather than a vague "sound exactly like me" instruction.
- [ ] Create a reviewer checklist/rubric for fidelity, voice, humor, natural English, structure, attribution and image/citation/SEO readiness.
- [ ] After approval, save the reusable style reference in the repository's appropriate `templates/writing/` or agent-skill location and link it from the `translate-article` workflow. Supplement, rather than silently overwrite, the broader KB `notes/writing-style-guide.md`.

### 5. Test, revise, and integrate
- [ ] Test the profile on at least two previously untranslated pieces from **different genres**, then compare English with full Hebrew originals paragraph by paragraph.
- [ ] Test the writing prompt on one short (~500-word) sample blog/portfolio post, **clearly labeled as a new draft rather than an original article**. Check whether humor and voice feel genuine, not exaggerated or synthetic.
- [ ] Ask Nim to mark what sounds right and wrong; refine the profile and prompts from his feedback.
- [ ] Preserve existing article-package conventions, website-wide tags, copyable citation/original URL, archived originals, source images/credits, and SEO metadata when each approved article is published.
- [ ] Update the existing workflow and task status only after the guide has been reviewed. No unapproved website publication.

## Reusable prompt A: analyze the voice (adapted from the saved screenshot)

> You are analyzing the **real writing style of Nimrod (Nim) Dvir**, not inventing a generic author persona. I will provide several articles that I wrote, each identified by article ID, language, publication, date, and genre. Analyze my tone, register, voice, vocabulary, sentence-length variation, rhythm, syntax, punctuation, paragraph structure, openings and endings, storytelling, rhetorical techniques, interview style, and especially the kind, timing, and intensity of my humor. Distinguish my words from editors' headlines and interviewees' statements. Use brief specific passages, cite their article IDs, and note differences between genres and between Hebrew and English. Tell me what makes the writing recognizably mine, which patterns are uncertain, what an AI writer should do or avoid, and how to preserve the style in natural English. Do not flatter, stereotype, or invent signature traits. First return an evidence-based writing-voice profile and a compact style checklist. Wait for my corrections before applying it.

## Reusable prompt B: apply the approved voice (translation or new writing)

> Use my **approved writing-voice profile** plus the attached original sample articles. Task: [faithfully translate article W### from Hebrew to English / draft a new blog post on TOPIC for AUDIENCE, about LENGTH words]. Reproduce my typical level of formality, word choice, sentence-length variation, pacing, interview/narrative conventions and humor **where appropriate**, without canned AI phrases or forced jokes. For a translation, preserve every substantive element and its order, the original's meaning and tone, all quotes and attribution, and images/captions/citation metadata; flag ambiguous idioms instead of silently guessing. Do not add or omit material. For a new blog post, use only the facts I provide and flag missing evidence. After drafting, check (1) meaning/factual fidelity, (2) voice and natural English, (3) humor and nuance, and (4) completeness/provenance. Tell me where the voice profile may not fit this genre.

## Acceptance criteria

- Style profile is grounded in multiple **verified** original articles across genres, with traceable source IDs and examples.
- The profile covers every dimension in the source screenshot: **tone, sentence-length variation, vocabulary, and humor**, plus syntax, pacing, rhetoric and genre.
- Two separate prompts, a reusable style checklist, and review examples exist.
- Tests show faithful English translations and a natural sample blog draft, with Nim's approval before embedding the rules in agents or publishing.
- Article inventory and already completed translations remain intact.

## Canonical references

- Website repository and writing pipeline: https://github.com/nimdvir/nimdvir.github.io
- Source inventory and fields: `data-source/writing/articles.csv`, `data-source/writing/README.md`
- Original and translation templates: `templates/writing/README.md`
- Existing translation agent: `.agents/skills/translate-article/SKILL.md`
- Wider KB writing guide: https://drive.google.com/file/d/1fbbTN7x4Sg3oDBEOG_d22Uo7BwtvU_ac/view
- Source of prompt idea: screenshot supplied by Nim in ChatGPT, 2026-10-26 (Google Play Store writing/prompt recommendation).
