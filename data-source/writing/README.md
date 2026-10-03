# Article list: data dictionary

`articles.csv` lists Nim's journalism, mostly in Hebrew, so he can choose what to translate and in what order. It is built from the spreadsheets in `Media/Interviews/` by `scripts/writing/build_inventory.py` and checked by `scripts/writing/check_inventory.py`. This folder is not part of the website build, but the repository is public, so the file is visible on GitHub.

Open it in Excel or VS Code. It is UTF-8 with a byte-order mark, so Hebrew displays correctly in Excel. Save it as CSV UTF-8 if Excel asks.

| Column | Meaning | Allowed values | Filled by | Example |
| --- | --- | --- | --- | --- |
| ID | Permanent row number. Never changes or gets reused. | `W` plus three digits | script | `W046` |
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
| Translation Path | Reviewed English translation file. | path or blank | agent | |
| Page Path | Website page file. | path or blank | agent | `src/content/interviews/rupaul.md` |
| Found In | Every source cell the row came from: file, sheet and cell, a CSV line, or a Wikipedia page. | text | script | `NimDvirArticles.xlsx!A49; he.wikipedia:מתיו ברודריק` |
| Notes | Problems found, possible duplicates, instructions. | text | Nim and agent | `possible duplicate of W003` |

Statuses in order: `not started` → `captured` (original saved) → `translated` → `page created` → `published`. `needs checking` means something is missing or doubtful (no link, no headline, unclear interviewee, or maybe not Nim's piece). `not my writing` is for rows later found to be by someone else.

## Choosing articles

To choose articles, set Translate? to Yes and give a Priority number; 1 goes first.
Rows with the same Priority are taken in ID order.
Run `python scripts/writing/check_inventory.py --queue` to see the queue and catch typos.

## Updating the list

`python scripts/writing/build_inventory.py` adds articles that are not in the list yet. It never changes a row that already exists, so edits to any column are kept. `python scripts/writing/fetch_wikipedia_citations.py` refreshes the Wikipedia citation cache (`wikipedia-citations.json`) that the builder uses to find article links; it needs internet access.
