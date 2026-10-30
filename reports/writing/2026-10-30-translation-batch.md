# English translation batch: all verified Hebrew packages

Date: October 30, 2026. Scope: translation only. No website pages were created or changed, nothing was published, and all drafts stay outside `src/content/`.

## Result

- 55 translation packages now exist under `data-source/writing/translations/`, one per verified Hebrew package: 48 new drafts of Nim's solo-bylined articles, the coauthored review W106, five third-party pieces about Nim (W016, W083, W095, W197, W198) translated under their real bylines, and the earlier W046 draft, which received the same archival footer.
- Confirmed duplicates W090 (= W003) and W096 (= W089) were not translated twice; their inventory rows point to the canonical translation and keep their IDs and notes.
- Source-only records without a verified Hebrew body (W005, W101 to W105, W110 to W112) and the English article W100 by Boaz Dvir remain pending or excluded. Nothing was reconstructed.
- Every package has `article.en.md` (frontmatter, subtitle, translation note, complete body in original order, separated archival footer with the verified APA citation, publisher link, Hebrew Markdown and clean HTML links) and `translation-review.json` (block and prompt counts, completeness and voice checks, decisions, source problems, unresolved questions).
- Six articles already have published English website pages (W001, W002, W003, W004, W006, W165). Those pages were not edited. The new drafts are faithful archival translations; each review file records the page path and the differences found (added lead paragraphs, invented headings, abridged Q&A, and for W165 a wrong source URL on the page).

## Method

Seven parallel batches translated from the verified `article.he.md` files with the writing-voice profile (`data-source/writing/voice-profile.md`) as guidance and the individual article taking precedence. Each draft was compared with the Hebrew paragraph by paragraph, then read alone for fluency, with changes checked back against the Hebrew. A validator then checked every package for frontmatter fields, tag vocabulary, bold prompt counts against the Hebrew, retained hyperlinks, caption counts, footer and APA block, relative links to the originals, em dashes, template placeholders, and review-record consistency. `check_inventory.py` and `check_captures.py` pass.

## Packages

| ID | English title | Author | Publication, date | Inventory status | Package | Open questions |
| --- | --- | --- | --- | --- | --- | --- |
| W001 | Jamie Foxx Is in the House | Nimrod Dvir | Ynet, 2005-08-17 | published | `data-source/writing/translations/W001-jamie-foxx/` | 2 |
| W002 | And Now, Seriously | Nimrod Dvir | Ynet, 2006-01-18 | published | `data-source/writing/translations/W002-jim-carrey/` | 1 |
| W003 | I'm Back | Nimrod Dvir | Israel Hayom, 2019-03-28 | published | `data-source/writing/translations/W003-julia-louis-dreyfus/` | 1 |
| W004 | Gaga Show | Nimrod Dvir | Ynet, 2009-08-12 | published | `data-source/writing/translations/W004-lady-gaga/` | 1 |
| W006 | "I'm Juicy, Not a Bitch\ | Nimrod Dvir | Ynet, 2009-07-03 | published | `data-source/writing/translations/W006-rupaul/` | 1 |
| W007 | Smash Stars: If the Show Is Canceled, We'll Stay on Broadway | Nimrod Dvir | Ynet, 2013-05-01 | translated | `data-source/writing/translations/W007-smash-interview/` | 0 |
| W010 | A Master's Joke | Nimrod Dvir | Ynet, 2009-07-22 | translated | `data-source/writing/translations/W010-bill-masters/` | 1 |
| W011 | Chiwetel Ejiofor: "Everyone Is a Slave to the System\ | Nimrod Dvir | Ynet, 2014-01-16 | translated | `data-source/writing/translations/W011-chiwetel-ejiofor/` | 0 |
| W016 | There Is Room for Everyone | Yuval Ganor | Ynet, 2009-06-14 | not my writing | `data-source/writing/translations/W016-yuval-ganor-response/` | 1 |
| W021 | Eva Mendes: "In the Film I Don't Care How I Look\ | Nimrod Dvir | Ynet, 2013-05-13 | translated | `data-source/writing/translations/W021-eva-mendes/` | 0 |
| W023 | Social Justice in the Big Apple: An Interview with Matthew Broderick | Nimrod Dvir | Ynet, 2011-11-02 | translated | `data-source/writing/translations/W023-matthew-broderick/` | 1 |
| W035 | Money Can Buy Love After All | Nimrod Dvir | Ynet, 2009-07-01 | translated | `data-source/writing/translations/W035-patti-stanger/` | 0 |
| W046 | Who’s Interested in Me? | Nimrod Dvir | Ynet, 2006-02-22 | translated | `data-source/writing/translations/W046-julianne-moore/` | 0 |
| W052 | J. No | Nimrod Dvir | Ynet, 2005-09-14 | translated | `data-source/writing/translations/W052-jennifer-lopez/` | 1 |
| W056 | An Exhibition of Ghosts | Nimrod Dvir | Ynet, 2009-11-23 | translated | `data-source/writing/translations/W056-tim-burton-moma/` | 1 |
| W058 | Proud to Be Here | Nimrod Dvir | Ynet, 2009-10-23 | translated | `data-source/writing/translations/W058-michael-lucas-israel-set/` | 1 |
| W062 | There's No Place Like Home | Nimrod Dvir | Ynet, 2005-10-11 | translated | `data-source/writing/translations/W062-holidays-homesickness/` | 1 |
| W071 | A Little Self-Pride | Nimrod Dvir | Ynet, 2009-06-10 | translated | `data-source/writing/translations/W071-lgbtq-television/` | 0 |
| W079 | Coming Back Is the Best Part | Nimrod Dvir | Ynet, 2006-05-24 | translated | `data-source/writing/translations/W079-returning-to-israel/` | 2 |
| W080 | A Super Family | Nimrod Dvir | Ynet, 2005-07-13 | translated | `data-source/writing/translations/W080-fantastic-four/` | 1 |
| W083 | "The Dictator" Pressed a Gun to an Israeli Reporter's Groin | Amir Bogen | Ynet, 2012-05-08 | not my writing | `data-source/writing/translations/W083-dictator-coverage/` | 1 |
| W087 | Dead on Air | Nimrod Dvir | Ynet, 2008-11-26 | translated | `data-source/writing/translations/W087-online-bystanders/` | 1 |
| W089 | Haters: A Love Story | Nimrod Dvir | Israel Hayom, 2019-04-11 | translated | `data-source/writing/translations/W089-killing-eve/` | 1 |
| W092 | Nimrod Dvir Reports from the Big Apple | Nimrod Dvir | Xnet, 2011-12-13 | translated | `data-source/writing/translations/W092-buddhism-new-york/` | 0 |
| W093 | Why Does Nimrod Dvir Feel a Natural High? | Nimrod Dvir | Xnet, 2012-02-12 | translated | `data-source/writing/translations/W093-silent-meditation-retreat/` | 1 |
| W094 | Nothing Like the Magic Moment at the Summit | Nimrod Dvir | Israel Hayom, 2014-10-15 | translated | `data-source/writing/translations/W094-annapurna-memoir/` | 0 |
| W095 | Nature Is Stronger Than Everything | Dan Margalit | Israel Hayom, 2014-10-16 | not my writing | `data-source/writing/translations/W095-dan-margalit-annapurna/` | 1 |
| W097 | Karim Rashid's Utopia | Nimrod Dvir | At, 2017-04-20 | translated | `data-source/writing/translations/W097-karim-rashid/` | 2 |
| W098 | Gila Gamliel Fears the Day "The Handmaid's Tale" Becomes Reality in Israel | Nimrod Dvir | At,  | translated | `data-source/writing/translations/W098-gila-gamliel/` | 2 |
| W106 | Queens of the Desert: A Review of "Sex and the City 2\ | Dana Darvinsky and Nimrod Dvir | nrg,  | translated | `data-source/writing/translations/W106-sex-and-the-city-2/` | 1 |
| W107 | Doggy Style: Prepare Your Dog for Winter | Nimrod Dvir | Xnet, 2012-01-15 | needs checking | `data-source/writing/translations/W107-dogs-new-york-winter/` | 2 |
| W108 | The Scroll of Esther | Nimrod Dvir | Ynet, 2010-01-13 | translated | `data-source/writing/translations/W108-ester-rada/` | 1 |
| W114 | Running With Him: On Haruki Murakami's New Book | Nimrod Dvir | nrg, 2010-08-26 | translated | `data-source/writing/translations/W114-haruki-murakami-running/` | 1 |
| W116 | "Ilana Is a Phenomenon\ | Nimrod Dvir | nrg, 2010-12-05 | translated | `data-source/writing/translations/W116-ben-shani/` | 0 |
| W118 | "No One Stands a Chance With Me": An Interview With Randy Harrison | Nimrod Dvir | nrg, 2011-05-15 | translated | `data-source/writing/translations/W118-randy-harrison/` | 1 |
| W122 | "Millions of People Feel Rejected, Like Frankenstein\ | Nimrod Dvir | Ynet, 2014-02-18 | translated | `data-source/writing/translations/W122-aaron-eckhart-yvonne-strahovski/` | 1 |
| W125 | SEX FILES: An Interview with David Duchovny | Nimrod Dvir | nrg, 2010-06-18 | translated | `data-source/writing/translations/W125-david-duchovny/` | 1 |
| W126 | TO B: An Interview with Melanie B | Nimrod Dvir | nrg, 2011-02-17 | translated | `data-source/writing/translations/W126-mel-b/` | 1 |
| W158 | For the Second Season: A Visit to the Homeland Set | Nimrod Dvir | Xnet, 2012-10-04 | translated | `data-source/writing/translations/W158-homeland-set-visit/` | 2 |
| W159 | Mamma Mia! The Story of ABBA's Frida Lyngstad | Nimrod Dvir | nrg, 2010-11-14 | translated | `data-source/writing/translations/W159-anni-frid-lyngstad/` | 1 |
| W162 | Maharaja: An Interview with Raja Ram | Nimrod Dvir | nrg, 2010-06-23 | translated | `data-source/writing/translations/W162-raja-ram/` | 0 |
| W163 | Connected | Nimrod Dvir | Ynet, 2009-08-12 | translated | `data-source/writing/translations/W163-noa-tishby/` | 1 |
| W164 | Michael Lewis: "I would have been among the first out anyway\ | Nimrod Dvir | Xnet, 2012-05-05 | translated | `data-source/writing/translations/W164-michael-lewis/` | 1 |
| W165 | Michael Fassbender: 'I Hope Humanity Has Changed' | Nimrod Dvir | Ynet, 2014-01-20 | translated | `data-source/writing/translations/W165-michael-fassbender/` | 4 |
| W171 | Super Star | Nimrod Dvir | Ynet, 2009-07-23 | translated | `data-source/writing/translations/W171-darren-star/` | 0 |
| W172 | Steve Buscemi, Star of Boardwalk Empire, Isn't Afraid to Die | Nimrod Dvir | Xnet, 2012-10-16 | translated | `data-source/writing/translations/W172-steve-buscemi/` | 1 |
| W174 | Spike Lee: "The Oscars Mess Up Sometimes\ | Nimrod Dvir | Ynet, 2013-12-10 | translated | `data-source/writing/translations/W174-spike-lee/` | 0 |
| W176 | Seth Rogen: "There's Something Scary About Zac Efron\ | Nimrod Dvir | Ynet, 2014-05-15 | translated | `data-source/writing/translations/W176-seth-rogen-zac-efron/` | 1 |
| W182 | Personal Magic: An Interview with Emma Watson | Nimrod Dvir | nrg, 2011-06-16 | translated | `data-source/writing/translations/W182-emma-watson/` | 0 |
| W184 | Cockfight: Behind the Scenes of "The Drag Queens of New York\ | Nimrod Dvir | nrg, 2010-06-28 | translated | `data-source/writing/translations/W184-new-york-drag-queens/` | 1 |
| W185 | White in a Black Dream: An Interview with Mike Henry | Nimrod Dvir | nrg, 2011-03-30 | translated | `data-source/writing/translations/W185-mike-henry/` | 0 |
| W186 | Ryan Gosling: "The Ofnobank Is My Idol\ | Nimrod Dvir | Ynet, 2013-05-11 | translated | `data-source/writing/translations/W186-ryan-gosling/` | 1 |
| W195 | The Stone Age: Emma Stone Conquers Hollywood | Nimrod Dvir | nrg, 2011-08-29 | translated | `data-source/writing/translations/W195-emma-stone/` | 1 |
| W197 | Pini Askal Moves to "Pnai Plus\ | nrg Maariv staff | nrg, 2007-08-02 | not my writing | `data-source/writing/translations/W197-pnai-plus-appointments/` | 0 |
| W198 | The Bottom Line | nrg Maariv staff | nrg, 2010-11-15 | not my writing | `data-source/writing/translations/W198-media-industry-coverage/` | 1 |

## Consistency notes for the website round

- Three early Ynet drafts (W001, W002, W080) keep the bold dateline byline from the Hebrew ("Nimrod Dvir, Miami"); other drafts carry the author only in the italic translation note. Decide one convention when pages are built.
- Publisher defects were reproduced rather than repaired: mid-sentence paragraph breaks in W056, W087, W122; a stray period paragraph in W158; damaged quotation marks in W159 normalized in English only. W035 is the one exception, where a mid-sentence split was joined and recorded in its review file.
- Israeli references were kept, with two-or-three-word glosses where a joke depends on them (Sarit Hadad, Ora Namir, Pnina Rosenblum, Irit Rahamim and Miri Regev, Roni Leibovitz, Ya'arot HaCarmel, the film Rabies). The review files list each gloss so they can be removed for an Israeli audience.
- Seven pieces are online editions of longer print versions (W035, W108, W116, W126, W163, W164, W176); the drafts translate the archived online text only.
- Publisher images were not downloaded or re-hosted. Where the Hebrew file embeds a remote image (W046, W089) the draft keeps the same reference; elsewhere captions and credits are preserved with a placeholder comment.

## Questions for Nim (collected from the review files)

1. Published pages: should the faithful drafts replace the five abridged or restructured pages (W001, W002, W003, W004, W006) and the abridged W165 page, and should the W165 page's source URL be corrected?
2. Titles: "Haters: A Love Story" (W089), "A Super Family" (W080), "Cockfight" versus "Catfight" (W184), "Money Can Buy Love After All" (W035).
3. Wording calls flagged by translators: "a guy with a bit of an edge" (W001); the garbled manager sentence (W195); "למרות המקפים" rendered "Despite the hitches" (W079); "וזקן" rendered "and old" (W083); the Hebrew-edition epigraph in W114 versus the English edition's "Suffering is optional"; Nucky's two quoted lines in W172 translated from Hebrew rather than restored from the show.
4. Spellings to confirm: the Chicago Hope director (W010), the boutique "Ramz Oggie Pets" (W107), "Eva Medzhibozh" and "Audra Belarus" (W098), photographer "Michel Gavnit" (W097), "Lisa McCarthy" and Harrison's printed age 34 left as printed (W176, W118).
5. Source errors left uncorrected and flagged: Easy A credited to Broderick (W023); 1853 for the film's 1841 (W011); Margalit's "two years after the earthquake" (W095); the caption contradicting the body in W004.
6. Glosses: annotate "ATEP" as PETA (W052), "Blessed is the man" as a pun on Baruch Goldstein (W108), "Buki Naeh" (W164), Israeli channel names (W125, W126), Hebrew titles beside "Touching Distance" and "Screens" (W163)?
7. Third-party pieces: should W016, W095, W197, W198 appear on the website at all, given Nim is a subject, photographer, or name in a list rather than the author? Can Nim identify his own sections of W106?
8. Photos: does Nim want to reuse his own credited set photographs for W058?

## Commits

Batches were committed to `main` as they completed: f6498c2 (coauthored and third-party), 54147c8 (seven interviews), 2692873 (seventeen interviews), 221b1a8 (features and Rashid), a38cd61 (columns, review, Gamliel), and the final commit for the early Ynet interviews and this report. Pushes to `main` build and verify only; the site was not published.
