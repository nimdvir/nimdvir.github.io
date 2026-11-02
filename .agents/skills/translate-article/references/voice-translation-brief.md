# Translating Nim Dvir into English: the working brief

Read this whole file before touching a package. It supplements `data-source/writing/voice-profile.md` (read sections 2, 3C, 3D, 3F, 6, 8 and 9 of that file too) and overrides the earlier draft translations, which Nim rejected on October 31, 2026 as "clunky and really not my style."

## 1. What went wrong in the first drafts

The October 30 drafts were accurate and complete, and they read like a crib. Hebrew word order survived into English, slang went flat, Israeli terms were left as transliterations that mean nothing to an English reader, and publisher photo credits were printed under photos that are not on the page. Nim's own examples:

| Hebrew | Rejected draft | What Nim wants |
| --- | --- | --- |
| כדי להיות מחובר עד כמה שניתן לאמריקה המציאותית, הפקת הסרט עשו המירב במטרה להכניס את השחקנים לאווירה. | To be connected as closely as possible to the real America, the film's production did everything it could to put the actors in the atmosphere. | To keep the film as close as possible to the real America, the production went out of its way to put the actors inside it. |
| "אני מרגיש שבהרבה סרטים עושים פטיש לאלימות, הופכים אותה לקולית." | "I feel that a lot of films make a fetish of violence, they make it cool." | "I feel like a lot of films fetishize violence. They make it cool." |
| וכמו האופנובנק, גם אתה יודע לרכב על אופנוע? | And like the Ofnobank, do you know how to ride a motorcycle too? | So, like your idol, you can ride a motorcycle? |
| ריאן גוסלינג: "האופנובנק הוא האליל שלי" | Ryan Gosling: "The Ofnobank Is My Idol" | Ryan Gosling: "The Motorcycle Bandit Is My Idol" |
| *ריאן גוסלינג. רוצה לשדוד ולא יכול (צילום: Gettyimages)* | printed on the page under no photo | kept in the translation file as provenance; the page builder drops it |

"This makes me sound dumb," he said of the first two. The target is English that a sharp native-speaking magazine journalist would have written, with Nim's rhythm, judgment and humor intact. Fidelity to meaning comes first; fluency is not optional.

## 2. The two reference translations

Read both before you start. They set the standard:

- `data-source/writing/translations/W004-lady-gaga/article.en.md`
- `data-source/writing/translations/W186-ryan-gosling/article.en.md`

and compare each against its Hebrew in `data-source/writing/originals/`. Notice what moved (clauses, not meaning), what stayed short, where the joke sits, how an Israeli reference is handled, and how the frontmatter, body, provenance comments and footer are laid out.

Then read `data-source/writing/voice-comparison/README.md`. It holds seven interviews as Hebrew / rejected draft / revised version side by side, with the changes sorted into categories. Section 6.4 of the voice profile summarizes the same lessons. If you are unsure whether a sentence of yours is a calque, find its nearest cousin there.

## 3. Method

1. Read the whole Hebrew article once without translating. Decide what kind of piece it is and what register Nim is using (loose 2005 Ynet, service-journalism promo, nrg "Rating" explainer, Xnet column, measured Israel Hayom). Section 3H of the profile maps these.
2. Translate paragraph by paragraph for meaning and effect, not word for word. Rebuild each sentence as an English sentence. Split long Hebrew chains where English needs it; keep the punchline or judgment in the final clause of the paragraph. Keep one-word verdicts as one-word sentences.
3. Read the English alone, aloud in your head, as a native reader. Anything you would not say or write in English gets rewritten. Then check every rewrite against the Hebrew.
4. Fill in `translation-review.json` honestly, including what was lost and what you decided.

## 4. Rules that are not negotiable

**Completeness.** Every paragraph, prompt, answer, heading, caption and credit from the Hebrew, in order. No summaries, no added sentences, no explained jokes, no appended conclusion. Do not fix historical claims; note them in the review file.

**Prompts.** Each interviewer prompt is `**bold**` in its own paragraph with blank lines around it, including statements without question marks. Keep them short and natural; Nim's prompts are blunt but friendly ("Hold on, you also...", never "Excuse me, but").

**Quotations.** They are translations of the published Hebrew, not reconstructed English speech. Still, render them as a native speaker would actually say the thing: "fetishize," not "make a fetish of"; "I'm scared of going to prison," not "I am afraid to go to prison." Do not polish an interviewee's logic or add content.

**Israeli terms and references.** Translate meaning. Never leave a transliteration that means nothing in English (Ofnobank, Pnai Plus, Kokhav Nolad, Matzav HaUma, Yoman, Keshet, Reshet, Galei Tzahal, Big Brother Israel's "HaAh HaGadol"). First mention gets the meaning or a two-to-six-word gloss ("Israel's motorcycle bank robber"; "the celebrity weekly Pnai Plus"; "Kokhav Nolad, Israel's version of American Idol"; "Channel 2"), later mentions use a short English handle. Keep the reference itself (Zehava Ben stays Zehava Ben, with a three-word gloss only if the joke depends on it); never swap in an American or British equivalent. People's names use their established English spellings; look them up if unsure and record the choice.

**Titles of works.** Established English titles (The Place Beyond the Pines, not "A Place Inside the Forest"). Where Nim glosses a Hebrew title himself, keep his aside.

**Headlines and subheads.** Give a real English headline. If the Hebrew headline is a pun, find an English pun that does the same job or a clean, specific headline; record the choice. Section headings get the same treatment ("מנסה לצאת מהריבועים" became "Thinking Outside the Six-Pack").

**Slang and register.** Match register, not dictionary meaning. תכלס is "honestly" or "bottom line"; ביאוס is "a funk"; לקטר is "grumble"; חפירה is "going on about it"; פאדיחות is "embarrassing moments"; מבסוט is "pleased with himself" or "happy as a clam" depending on the sentence; לפרגן is "to be generous" or "to give credit"; שוין is "oh well." Keep the collision of a formal connective next to a street verdict where the Hebrew has it; English "as befits" next to "Not bad." reads like him.

**Humor.** Setup long, punch short. No intensifiers to make understatement land. No second joke after the first. Comic comparisons translated literally with a minimal gloss, never replaced. Sharp lines keep the concession that follows them. When the subject is grief, illness or real harm, the English stays as straight as the Hebrew.

**Transliterated English in the Hebrew** ("שוקינג", "ספיקינג אוף", "ניים דרופינג") becomes plain English. The code-switch joke is lost; do not compensate with a new joke; note it in the review file when it mattered.

**Parentheticals** stay parenthetical and keep their function (gloss, confession, correction, deflation). Do not add any.

**Em dashes are forbidden** on this site (Nim's rule). Use commas, colons, periods or parentheses. The page builder rejects any "—".

**Captions and credits of publisher photos.** Keep them in the translation file, each as an italic line directly under a provenance comment, exactly like the reference files:

```
<!-- Source image not embedded; see source-record.json for provenance and licensing. -->
*Ryan Gosling. Wants to rob and can't (Photo: Gettyimages)*
```

Translate the caption text and keep the credit. The page builder drops these from the website; they exist for the archive. Do not write captions for images that do not exist in the Hebrew.

**nrg and Xnet artifacts.** The captured nrg files contain stray bidirectional marks (‭ ‬) and odd spacing around numbers ("בת ‭,30‬"). Read through them; never reproduce them.

**Third-party pieces** (by Yuval Ganor, Amir Bogen, Dan Margalit, the nrg news desk) are translated faithfully into natural English in the original author's register. They are not Nim's voice and must not be pushed toward it.

**Do not touch** `data-source/writing/articles.csv`, anything in `src/`, any package you were not assigned, or the Hebrew originals. Do not run git commands. The orchestrator handles the inventory, the page build and the commit.

## 5. File layout for each package

Folder: `data-source/writing/translations/W###-slug/`, slug identical to the originals folder. Two files.

### article.en.md

Frontmatter exactly in this shape (copy from the W186 reference and change the values):

```yaml
---
articleId: "W###"
title: "English headline"
subtitle: "Translated subtitle, or empty string"
summary: "The subtitle if there is one; otherwise one specific sentence describing the piece, no sales language"
author: "Nimrod Dvir"            # or the real third-party author
interviewee: "Name"             # interviews only; several names joined with " and "
subjects: ["Main subject", "Work or show", "Other principal"]
date: "Mon D, YYYY"
originalPublishedDate: "YYYY-MM-DD"
originalTitle: "Hebrew headline"
language: "en"
originalLanguage: "he"
source: "Ynet" | "nrg Maariv" | "Xnet" | "At" | "Israel Hayom"
sourceUrl: "original URL from the Hebrew frontmatter"
tags: ["Interview", "Film"]      # labels from src/data/tags.json only; check it
draft: true
translationStatus: "revised-for-voice"   # revisions
# translationStatus: "draft-for-review"  # new translations
sourceExtraction: "../../originals/W###-slug/article.he.md"
translatedOn: "2026-10-30"      # keep for revisions; today's date for new ones
revisedOn: "2026-10-31"         # revisions only
translationReviewedBy: null
thirdPartyCoverage: true        # third-party pieces only
coauthored: true                # W106 only, with additionalAuthors: ["Dana Darvinsky"]
---
```

Body, in order: italic translated subtitle (if any); the italic translation note line ("*English translation of the Hebrew original by Nimrod Dvir, published in Ynet on Month D, YYYY. [Read the original in Hebrew](URL).*"); then the article with its headings, prompts, answers, provenance comments and captions; then the archival footer copied from the reference file, with the APA citation taken verbatim from the Hebrew file's fenced `text` block and the links adjusted to the package's slug. For a revision, change the footer's last line to say the translation was prepared on October 30, 2026 and revised for voice on October 31, 2026.

Tag labels must exist in `src/data/tags.json`. Typical sets: interviews `["Interview", "Film" | "Television" | "Music", "Hollywood", "New York"]`; Israeli interviews `["Interview", "Television" | "Music" | "Theatre", "Israel"]`; columns `["Opinion"]` or `["Personal Essay", "New York"]`; reviews `["Review", ...]`. Read the file; do not invent labels.

### translation-review.json

Same shape as the existing records. Required keys:

```json
{
  "articleId": "W###",
  "englishTitle": "...",
  "status": "revised for voice 2026-10-31, awaiting Nim review" | "draft awaiting Nim review",
  "translatedOn": "YYYY-MM-DD",
  "revisedOn": "2026-10-31",
  "authorship": {"author": "...", "bylineAsPrinted": "..."},
  "portfolioGroup": "international-interview" | "israeli-interview" | "feature" | "review" | "column" | "about-me",
  "sourceTextBlocks": 0, "translatedTextBlocks": 0, "questionBlocks": 0, "captions": 0, "images": 0,
  "completenessChecks": ["..."],
  "voiceChecks": ["what you protected: rhythm, asides, judgment placement, the ending"],
  "israeliTermsRendered": {"האופנובנק": "Israel's motorcycle bank robber; later 'the motorcycle bandit'"},
  "decisions": ["headline choice, title choices, slang renderings, sentence splits that moved anything"],
  "lostInTranslation": ["the זייפנית pun (fraud / off-key singer) has no English equivalent; 'fraud' kept"],
  "defectsFixed": ["revisions only: the specific clunky sentences, orphan terms and literalisms you replaced"],
  "sourceProblems": ["garbled Hebrew, wrong prepositions, broken captions, as found"],
  "unresolvedQuestions": ["anything Nim must decide"]
}
```

`portfolioGroup`: an interview with a person who is not Israeli is `international-interview`; an interview with an Israeli (including Israelis working abroad, such as Noa Tishby, Michael Lewis, Ester Rada, Orly Shani) is `israeli-interview`; set visits, researched profiles and reportage are `feature`; a review is `review`; a column or opinion piece is `column`; a third-party piece about Nim is `about-me`. The inventory's `Type` column is a hint, not the answer; read the piece.

## 6. Before you report back

Run the profile's section 10 checklist against each file, then confirm:

- [ ] Prompt count in English equals the bold prompt count in the Hebrew.
- [ ] Paragraph count matches, allowing only for splits you recorded.
- [ ] No "—" anywhere. No template placeholders or square-bracket instructions.
- [ ] No transliterated Israeli term left unexplained on first mention.
- [ ] Every caption has its provenance comment on the line above.
- [ ] Headline is English a magazine would print.
- [ ] You read the whole English once more as a reader and did not wince.

Report, per package: English title, prompt and paragraph counts, portfolioGroup, the three most consequential decisions, anything lost, and open questions for Nim. Keep the report under 150 words per package.
