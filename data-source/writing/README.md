# Article list: data dictionary

`articles.csv` lists Nim's journalism, mostly in Hebrew, so he can choose what to translate and in what order. It is built from the spreadsheets in `Media/Interviews/` by `scripts/writing/build_inventory.py` and checked by `scripts/writing/check_inventory.py`. This folder is not part of the website build, but the repository is public, so the file is visible on GitHub.

Open it in Excel or VS Code. It is UTF-8 with a byte-order mark, so Hebrew displays correctly in Excel. Save it as CSV UTF-8 if Excel asks.

| Column | Meaning | Allowed values | Filled by | Example |
| --- | --- | --- | --- | --- |
| ID | Permanent row number. Never changes or gets reused. | `W` plus three digits | script | `W046` |
| Main Subject (English) | The principal person or people, show, work, event or topic. A person mentioned incidentally is not automatically the subject or an interviewee. | text; explicit unresolved label when needed | reviewer | `Julianne Moore` |
| Main Subject (Hebrew) | The same subject in Hebrew. Principal interviewees are named individually where supported. | text | reviewer | `ג'וליאן מור` |
| Translation Value | Provisional editorial benefit of having a reviewed English version, not a score for writing quality. | `High`, `Medium`, `Low`, `Unrated` | reviewer; Nim can override | `High` |
| Value Reason | Short explanation of the rating, using subject, format, original reporting and lasting interest. | text | reviewer | `Original interview with an internationally recognizable actor.` |
| Review Flag | What to check before selecting, including English versions, uncertain format or authorship, missing sources and possible duplicates. | text | reviewer | `Already published in English` |
| Translate? | Whether Nim wants this article translated. | `Yes`, `No` (every row starts `No`) | Nim | `Yes` |
| Priority | Order of translation. 1 goes first. | blank, or a whole number | Nim | `1` |
| Status | Where the article stands. | `not started`, `needs checking`, `not my writing`, `captured`, `translated`, `page created`, `published` | script, then agent | `captured` |
| Type | Kind of piece. | `interview`, `review`, `feature`, `column`, `report`, `other`, `unknown` | script; Nim can correct | `interview` |
| Interviewee | Who the interview is with, as written in the source. Required for interviews. | a name, or `unknown` | script; Nim can correct | `מתיו ברודריק` |
| Title (Hebrew) | Original headline. | text | script | `צדק חברתי בתפוח הגדול: ריאיון עם מתיו ברודריק` |
| Title (English) | English headline, once translated. | text | agent | `Social Justice in the Big Apple` |
| Publication | Where it ran. | text | script | `Ynet` |
| Date | Publication date, as precise as known. | `YYYY-MM-DD`, `YYYY-MM` or `YYYY` | script | `2011-11-02` |
| Original URL | Link to the original article. Never a Wikipedia page. | URL or blank | script | `https://www.ynet.co.il/articles/0,7340,L-4141079,00.html` |
| Images | Image status. | blank, `on Cloudinary`, `needs upload` | agent | `on Cloudinary` |
| Original HTML Path | Saved copy of the original (HTML, MHTML or PDF), relative to the repository. | path or blank | agent | `Media/Interviews/israelhayom.co.il_article_645081.pdf` |
| Translation Path | English translation file; a draft can still await Nim's review, as recorded in Review Flag and its frontmatter. | path or blank | agent | |
| Page Path | Website page file. | path or blank | agent | `src/content/interviews/rupaul.md` |
| Found In | Every source cell the row came from: file, sheet and cell, a CSV line, or a Wikipedia page. | text | script | `NimDvirArticles.xlsx!A49; he.wikipedia:מתיו ברודריק` |
| Notes | Problems found, possible duplicates, instructions. | text | Nim and agent | `possible duplicate of W003` |
| Duplicate Of | Another permanent ID to compare with. No records are deleted or renumbered; this field alone does not prove duplication. | existing ID or blank | reviewer | `W003` |
| Original Language | Language of the listed version, which may be an English portfolio repost. | `Hebrew`, `English`, `Unverified` | reviewer | `Hebrew` |
| Author / Byline | Author named by the checked article or attributed in the source inventory. Read Metadata Basis and Review Flag to see whether the byline was checked. | name or `Unverified` | reviewer | `Nimrod Dvir` |
| Metadata Basis | How the subject and attribution were established. Citation context and search excerpts are not a full-article check. Reviewed On does not mean every original was fetched. | text | reviewer | `Original article checked` |
| Evidence URL | Publisher page or listed source supporting the review. Blank if the article URL remains unresolved. | URL or blank | reviewer | original publisher URL |
| Reviewed On | Date the inventory row was reviewed, not its publication date. | `YYYY-MM-DD` or blank for new unreviewed imports | reviewer | `2026-10-24` |

Statuses in order: `not started` → `captured` (original saved) → `translated` → `page created` → `published`. `needs checking` means something is missing or doubtful (no link, no headline, unclear interviewee, or maybe not Nim's piece). `not my writing` is for rows later found to be by someone else.

## Choosing articles

Start with Main Subject, Translation Value and Review Flag. All 198 existing IDs, `W001` through `W198`, are retained; refer to a piece as `W046` (or article 46). Sorting the file must never change these IDs.

Ratings are suggestions for Nim's review. High favors original interviews, distinctive reporting or enduring personal/analytical pieces. Medium covers useful features, criticism and interviews with a narrower audience. Low covers routine news, expired listings or items written by someone else. Unrated means there is not enough evidence to assess the piece. Celebrity alone does not determine the rating.

An already translated interview can still have High portfolio value. Its English-version flag means review or reuse that version before doing translation work. Main Subject applies to every entry; Interviewee is used only for interviews. A feature's named subject is not automatically an interviewee, and provisional formats are flagged.

To choose articles, set Translate? to Yes and give a Priority number; 1 goes first.
Rows with the same Priority are taken in ID order.
Run `python scripts/writing/check_inventory.py --queue` to see the queue and catch typos.

## Updating the list

`python scripts/writing/build_inventory.py` adds articles that are not in the list yet. It never changes a row that already exists, so edits to any column are kept. `python scripts/writing/fetch_wikipedia_citations.py` refreshes the Wikipedia citation cache (`wikipedia-citations.json`) that the builder uses to find article links; it needs internet access.

New imports start with Unrated translation value and an explicit unreviewed subject label. Review their source and fill the subject fields before choosing them. Keep existing Notes, Translate? and Priority unchanged unless Nim requests a change.

The original `reports/writing/inventory-audit.md` documents the initial import. Its type and status totals predate the October 24 review; see `reports/writing/2026-10-24-selection-review.md` for this review.

## Article packages and templates

Use `templates/writing/README.md` for the Hebrew-extraction and English-translation workflow, separate source/translation folders and the W046 example. Use `templates/TAGS.md` and `src/data/tags.json` for the shared website tag vocabulary. A translated draft is not approval to publish it or to change Nim's translation choices.


## Captured article packages

| ID | Subject | Hebrew source | English draft | Current state |
| --- | --- | --- | --- | --- |
| W046 | Julianne Moore | [Hebrew Markdown](originals/W046-julianne-moore/article.he.md), [article-only HTML](originals/W046-julianne-moore/article.he.html), [source record](originals/W046-julianne-moore/source-record.json) | [English draft](translations/W046-julianne-moore/article.en.md) | English example awaiting Nim review |
| W089 | Jodie Comer and Sandra Oh, Killing Eve | [Hebrew Markdown](originals/W089-killing-eve/article.he.md), [article-only HTML](originals/W089-killing-eve/article.he.html), [source record](originals/W089-killing-eve/source-record.json) | Not started | Complete Hebrew text captured; 1 image link and all 3 captions retained; 2 publisher image links missing |

Use the article's ID to locate its folder. The Markdown is the reading/extraction copy, the HTML is the clean article-only keeper, and the source record preserves evidence, image details and extraction checks. Source packages are not published as website pages.
