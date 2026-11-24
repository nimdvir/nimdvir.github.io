# Prompt: independent writing-style report on Nim Dvir's journalism

Use this prompt as written, in any AI agent that can read files in this repository. Each agent writes one report. The reports will be merged later, so yours must stand on its own.

## Your task

You're one of several AI agents writing an independent report on how Nimrod (Nim) Dvir writes. Analyze his Hebrew journalism very carefully and completely, then write a bilingual writing guide: one that would let a writer, human or AI, produce new text that reads exactly like Nim, in Hebrew and in English. Accuracy matters more than speed or length. Base every claim on his actual words.

Repository root: `C:\Users\nd115232\github\nimdvir.github.io`. Paths below are relative to it. You need read access to these files. If you can't read them, say so and stop. Don't analyze from memory or from the web.

## Keep it independent

Other agents are writing the same report. To keep yours independent, don't open or search:
- anything in `data-source/writing/voice/` except this prompt. That includes `voice-profile.md`, `voice-profile-evidence.json`, `voice-comparison/`, `voice-page.astro` and every other file in `writing-style/`
- `data-source/writing/translations/` and `data-source/writing/cross-check/`
- the English versions on the website (`src/content/`)
- `reports/` and `.agents/`, including the translate-article voice brief
- the web, for anything about Nim or his writing

If any of these is already in your context, say so in your method section and don't rely on it.

## The corpus

- Read every `data-source/writing/originals/W###-<slug>/article.he.md`. There are 104. Each has YAML frontmatter (title, subtitle, author, byline, publisher, date) followed by the article.
- Metadata is in `data-source/writing/articles.csv` (UTF-8 with BOM). Useful columns: ID, Type, Publication, Date, Status, Author / Byline, Duplicate Of, Notes. `data-source/writing/README.md` explains each column.
- Use `article.he.html`, the PDFs and `source-record.json` only to settle a doubt about the text, for example whether a line is a caption.
- Exclude the 6 articles with Status `not my writing`: W016, W083, W094, W095, W197, W198. W094 carries Nim's byline, but Nim says it isn't his: don't quote it or count it. Folders with no `article.he.md` are source records only; skip them.
- Treat W106 as weak evidence: it's co-written with Dana Darbinsky. Read it, but never base a trait on it alone, and flag any quote from it.
- That leaves 98 articles by Nim, from 2005 to 2019, in Ynet, nrg Maariv, Xnet/Pnai Plus, At and Israel Hayom. Most are interviews; the rest are features, columns, reviews and reports. Confirm these counts yourself and report any difference. Check every frontmatter byline for other co-authors.
- Read in date order (the Date column), so you can see how the writing changes over time.

## Whose words are whose

Each article mixes several kinds of text. Sort them before you draw conclusions:
1. Nim's narration: scene-setting, description, commentary, transitions. Direct evidence of his voice.
2. Nim's questions and remarks to interviewees. Direct evidence of how he interviews.
3. Interviewees' answers. Not his voice. His choices about which answers to include, where to place them and how to frame them are evidence.
4. Headlines, subtitles, captions and pull quotes. Editors often wrote or changed them. Weak evidence; label it.
5. Publisher boilerplate and house style: date lines, "בראיון ל-ynet", editor notes in brackets, credits. Keep venue conventions apart from personal habits.

When a funny or striking line belongs to an interviewee, credit the interviewee.

## How to read

1. Read every eligible article in full, start to finish. No sampling, no skimming, no keyword search in place of reading.
2. As you read, keep notes on each article, in your working memory or a temporary location outside the repository: ID, venue, date, type and rough length; the first and last sentence, verbatim; how it's built; interview moves; humor and its target; register mixing; recurring words and phrases; punctuation habits; where Nim himself appears; the strongest lines, verbatim, each tagged with its kind (1 to 5 above).
3. If you can run sub-agents, give each one a batch of 10 to 15 articles, this note format, and a requirement for verbatim quotes. Do the synthesis and the quote checking yourself.
4. Second pass: test every candidate trait against the whole corpus. Count the articles that show it and the ones that contradict it, then rate it:
   - stable: 5 or more articles, across at least 2 venues or periods
   - context-dependent: 3 or more articles, but only in a certain genre, venue, period or subject
   - occasional: 2 to 4 articles, no clear pattern
   - one-off: 1 article
   Only stable and context-dependent traits count as habits.
5. Measure where you can and say how: sentence and paragraph length, parentheses, rhetorical questions, first person, transliterated English per 1,000 words of narration, and so on. Small scripts are fine; don't save them in the repository. If a measure can't separate narration from quotes, say so.
6. Look for what he doesn't do, too. Absences are part of a style.
7. Look for change by period (2005 to 2019), venue, genre and subject (Hollywood or Israeli, light or grave).

Don't start with a theory. Let the traits come from the reading, and drop any that the second pass doesn't support.

## What to analyze

Cover at least these, and add anything else you find:
- Overall voice and persona: his stance toward his subjects, toward the celebrity machine, toward the reader
- Vocabulary and register: high and low Hebrew mixed together, slang, loanwords, transliterated English, nicknames and epithets, recurring words and phrases, intensifiers, hedges
- Sentences and rhythm: length and variation, openers, fragments, lists, repetition, tense, word order
- Punctuation: parentheses, dashes, colons, ellipses, exclamation marks, quotation marks, "(!)"
- Paragraphs: their length, and where the strongest line sits
- Humor: kinds, targets, mechanics, placement, and where it stops
- Figurative language and cultural references: where his comparisons come from
- Structure: openings, introducing a subject, background, transitions, signposting, Q&A versus narrative, endings; headlines and subtitles, with the editor caveat
- Interviewing: length and form of questions, follow-ups, rapport, challenge, handling evasion, how answers are framed in the narration
- Author presence: first person, self-deprecation, personal disclosure, stated opinion, addressing the reader
- Tone limits: grave subjects, fairness, where generosity and bite meet
- The assumed reader: what he explains and what he leaves unexplained
- Variation by period, venue and genre

## Evidence rules

- Support every trait with verbatim Hebrew quotes and article IDs (W###). A habit needs at least 3 different IDs.
- Copy quotes exactly. Before you finish, check every quote against its file with an exact-string search, and fix or delete any that don't match. Never put a paraphrase in quotation marks.
- Give every trait its rating from the second pass, and mark weak evidence (headlines, captions, W106).
- Say plainly what the corpus can't show. It has no English writing by Nim, so all English guidance is inferred from the Hebrew; label it as inference.
- Any example you write yourself is a demonstration, not evidence. Label it "Demonstration (invented)" or "הדגמה (לא מתוך הכתבות)".

## The report

Save one Markdown file, UTF-8 with LF line endings:
`data-source/writing/voice/writing-style/writing-style-report-<model>-<YY-MM-DD>.md`
`<model>` is a short lowercase name for you (`claude`, `gpt`, `gemini`, `deepseek`) and `<YY-MM-DD>` is today's date. If that file already exists, add `-2`. Don't open, edit or overwrite any other report.

Don't use em dashes in your own prose, in either language. Quotes keep their original punctuation. Write plainly, with no hype and no filler.

Structure:

**Header:** title, date, model, corpus counts (read, excluded, weak), one line confirming you didn't read the earlier analyses.

**Part A, in Hebrew (חלק א: מדריך כתיבה בעברית).** Hebrew prose, Hebrew quotes.
1. שיטה וראיות: the corpus, the exclusions, how you sorted whose words are whose, how you verified the quotes.
2. הקול בקצרה: one paragraph, then the 10 to 15 core traits, strongest first.
3. One section for each area in "What to analyze". Each trait gets a description, quotes with IDs, its rating, and its scope: where it appears and where it doesn't.
4. שינוי לפי תקופה, במה וז'אנר.
5. מדריך מעשי: rules to keep every time; rules that depend on genre or subject; what Nim doesn't do; a checklist for a new Hebrew piece; two or three short labeled demonstrations of a plain paragraph rewritten in his voice.

**Part B, in English (Part B: Writing as Nim in English).** A complete guide, not a summary of Part A.
1. How the voice carries into English: for each core trait, the Hebrew quote, a literal English gloss, and how to get the same effect in natural English.
2. What doesn't carry over, such as transliterated English, Israeli pop-culture references, and effects that come from Hebrew grammar or register, with the best English substitute for each.
3. A practical guide in English: rules to keep every time, context rules, what not to do, a checklist, and two or three labeled English demonstrations.

**Part C: Open questions for Nim.** Things only he can confirm, such as which headlines were his.

**Part D: Source table.** Every article in the corpus: ID, Hebrew title, venue, date, type, status (used, weak or excluded, with the reason), and how much it informed the report (heavy, some, light).

There's no length limit. Be complete and dense with evidence, and cut repetition.

## Before you finish

Check that:
- all 98 eligible articles were read in full and appear in Part D
- every quote matches its file exactly, with the right ID and speaker
- no excluded article is quoted or counted
- every habit cites at least 3 IDs, and weak evidence is labeled
- Part A and Part B are both complete
- your own prose has no em dashes
- you changed no file except your report

Then reply in chat with the file path, the counts, your five strongest findings, and anything you couldn't check.
