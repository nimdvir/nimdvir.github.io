# Article selection review: October 24, 2026

The inventory now puts the main subject in English and Hebrew beside each permanent ID, followed by provisional translation value, its reason and review flags. The purpose is to let Nim recognize a piece and decide whether to translate it.

- 198 existing records retained, with IDs W001 through W198 unchanged.
- Translate?, Priority, Notes, Found In and existing saved-file paths preserved.
- 51 original publisher pages checked. Other entries use published site metadata, source workbook/search excerpts or the repository's publisher-citation cache. Metadata Basis distinguishes these levels of evidence; review does not mean every original article was retrieved.
- Ratings: 47 High, 105 Medium, 45 Low, 1 Unrated. These are editorial suggestions, not writing-quality scores or translation instructions.
- Formats: 55 interview entries, 37 features, 34 columns, 33 reviews, 22 reports and 17 other/listing entries. Formats inferred from limited evidence are identified in Review Flag.
- Seven entries list an existing English version and six are already published on the Astro site. High value does not mean those should be translated again.
- Five entries are credited to other authors and are marked not my writing. They are retained for provenance.
- Five potential duplicate relationships remain explicit; no duplicate record was deleted or renumbered.

## Selected findings

| ID | Subject or correction | Evidence |
| --- | --- | --- |
| W007 | Megan Hilty and Katharine McPhee, not just the show Smash | [Ynet](https://www.ynet.co.il/article/4362943) |
| W010 | Bill Masters interview, previously classified as a report | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3750040,00.html) |
| W018 | All five principal Split interviewees named | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3724874,00.html) |
| W046 | Julianne Moore interview | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3219720,00.html) |
| W052 | Jennifer Lopez interview/press-event account | [Ynet](https://www.ynet.co.il/article/3142058) |
| W080 | Jessica Alba, Chris Evans, Ioan Gruffudd and Michael Chiklis | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3112281,00.html) |
| W089 / W096 | Sandra Oh and Jodie Comer, Killing Eve; duplicate comparison retained | [Israel Hayom](https://www.israelhayom.co.il/article/648895) |
| W108 | Ester Rada interview | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3833348,00.html) |
| W113 | Real Housewives review; original URL recovered. It is not primarily about Desperate Housewives. | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3812308,00.html) |
| W122 | Aaron Eckhart and Yvonne Strahovski, I, Frankenstein | [Ynet](https://www.ynet.co.il/articles/0,7340,L-4489368,00.html) |
| W016 | Yuval Ganor's response to Nim, not authored by Nim | [Ynet](https://www.ynet.co.il/articles/0,7340,L-3730911,00.html) |
| W083 | Amir Bogen's report about Nim and Sacha Baron Cohen | [Ynet](https://www.ynet.co.il/articles/0,7340,L-4226092,00.html) |
| W095 | Dan Margalit's column; Nim has a photo credit | [Israel Hayom](https://www.israelhayom.co.il/article/226051) |
| W197 / W198 | nrg Maariv bylines; items mention Nim | [W197](https://www.makorrishon.co.il/nrg/online/1/ART1/616/912.html), [W198](https://www.makorrishon.co.il/nrg/online/1/ART2/178/322.html) |

## Remaining checks

- W104, Fashion Star: the blog URL returns an error page and a blog search returned no matching post. Keep Unrated; interviewee names could not be established. An unrelated interview about the same show is not enough to fill them.
- Dates remain unverified for W070, W098, W099, W100, W106, W111, W112 and W167.
- Original URLs remain missing for W111, W112 and W167. Their subject labels rely on the recorded headline and source context.
- W005 and W165 retain conflicting Fassbender source URLs. Check which source is correct before using it.
- W090/W003, W096/W089, W111/W079, W112/W016 and W165/W005 remain comparisons to resolve, not permission to discard either ID.
- For features whose names come from headlines or citation context, check the original before treating the named person as an actual interviewee.

## Validation

CSV parsing, header order, required selection fields, 198 unique stable IDs, protected-field preservation, duplicate references, allowed ratings and new-import defaults checked successfully. Both Python inventory scripts compile. The local checkout is partial: the checker's eight saved-file existence reports were independently checked against the GitHub repository tree, where all eight referenced files exist.

The importer retains review columns when rerun, initializes new imports as Unrated and recognizes source-location aliases after an original URL is recovered. The queue now displays the main subject beside the title. No translation was selected or performed, and no live website page was changed.
