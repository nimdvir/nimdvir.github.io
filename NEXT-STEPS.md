<!-- Visible copy of .agents/plans/2026-11-01-resume-voice-translations.plan.md, kept at the root so it is not forgotten. Delete when the work is done. -->

# Resume the voice translations and finish the articles archive
Date: 2026-11-01 | Workspace: nimdvir.github.io (branch website/articles-archive) | Status: draft

Continues `2026-10-31-voice-translation-and-portfolio.plan.md`, which stopped when the account hit its 5-hour usage limit on the night of October 31. Everything below is uncommitted in the working tree on `website/articles-archive`. Nothing has been pushed or published.

## תוכנית בעברית
1. להפעיל מחדש את התצוגה המקומית ולבדוק את 21 התרגומים שכבר נכתבו מחדש (גאגא, גוסלינג, פוקס ועוד) ואת עמוד הכתבות החדש עם קיר הפנים.
2. לכתוב מחדש את 26 התרגומים שנותרו בסגנון של נים, בגלים קטנים כדי שמגבלת השימוש לא תקטע כתיבה באמצע.
3. לתרגם את 44 הכתבות החדשות (ראיונות ישראליים ובינלאומיים) באותה שיטה.
4. להשלים את חיפוש התמונות (שלוש קבוצות שלא הסתיימו, כולל שש התמונות הישנות ללא מקור), להעלות ל-Cloudinary ולחבר לעמודים.
5. להשלים את רשומות הביקורת, לעדכן את הרשימה, לבנות, לבדוק קישורים ולכתוב דוח. בלי מיזוג ובלי פרסום עד לאישור.

## Done so far (do not redo)
- W094 (Annapurna) removed from the site, `articles.csv` (`not my writing`), `voice-profile.md`, `voice-profile-evidence.json` and `article-image-sources.json`.
- `origin/main` (ChatGPT's 44 Hebrew packages, W018 to W209) merged into the branch.
- Agent brief written: `.agents/skills/translate-article/references/voice-translation-brief.md`. Every translation agent reads it first.
- Page builder fixed so orphan photo captions and credits never print (`scripts/writing/build_article_pages.py`); it now also writes a `group` field from each `translation-review.json` `portfolioGroup`.
- Redesign built and compiling: `src/components/InterviewWall.astro`, `src/pages/articles/index.astro` (sections: Celebrity interviews, Israeli interviews, Features and set visits, Reviews, Columns, Written about me), person hero in `src/pages/articles/[...slug].astro`, styles appended to `public/styles/site.css`, Fraunces display font in `Layout.astro`, `group` enum in `src/content/config.ts`, helpers in `src/utils/articles.ts`.
- Seven portraits (W159, W172, W174, W182, W185, W186, W195) hosted and on their pages.
- 38 of 54 translations rewritten in Nim's voice (the 16 still literal on 2026-11-02: W016 W062 W071 W079 W083 W087 W095 W106 W108 W126 W158 W159 W184 W195 W197 W198; W108 and W126 may be partial, check), complete files: W001, W002, W003, W004, W006, W007, W010, W011, W023, W035, W056, W058, W089, W092, W093, W107, W114, W116, W118, W162, W171, W172, W182, W185, W186. Review records exist for 16 of them; missing for W001, W023, W092, W093, W107, W114, W172, W182, W185.
- Before-and-after set for Nim's seven favorites in `data-source/writing/voice-comparison/` (Hebrew, October 30 draft, voice version, README sorting the changes). Voice profile 1.1 carries the lessons in section 6.4.
- `/articles/voice/` page built: ten paired passages, six traits, links to the profile and the comparison set.
- Portrait research done for all five batches and merged into `article-image-sources.json` (`data-source/writing/image-batches/` keeps the raw files): 83 articles with a verified Commons portrait, 15 with none. Photos downloaded to `images/articles/`. **Blocked:** `npm run cloudinary:upload` fails with 401 Invalid Signature; the `CLOUDINARY_URL` in `.env` must be checked against the Cloudinary console before the 36 new portraits can be hosted. For W001, W002, W003, W004, W006 and W165 the old unsourced images are still used through `data-source/writing/article-images.json`; delete those six explicit records once the new Commons photos are hosted, so the credited ones take over.
- Wave 1 of the remaining revisions (W052, W080, W046, W165, W021, W122, W174, W176, W125, W126, W097, W098, W108, W163, W164, W062) was running on the night of November 1; check `translationStatus: revised-for-voice` in each `article.en.md` to see which landed.
- `.gitignore` now ignores `.agents/plans/` and `.agents/reports/`.
- Inventory `Page Path` for W001 to W006 corrected; `check_inventory.py` passes.

## Implementation Plan
0. **Fix the Cloudinary credential** (Nim)
   - Do: Compare `CLOUDINARY_URL` in `.env` with Settings, API Keys in the Cloudinary console; replace it if the key was rotated. Then `npm run cloudinary:upload`, delete the six explicit records (W001, W002, W003, W004, W006, W165) from `data-source/writing/article-images.json`, and run `python scripts/writing/build_article_pages.py`. | Done when: the 36 downloaded portraits in `images/articles/` are hosted and appear on their pages with Commons credits.

1. **Restart the preview and let Nim read the pilot**
   - Do: `npm run build`, then `npm run preview -- --port 4321`. Nim reads http://localhost:4321/articles/ and the Gaga, Gosling and Foxx pages and gives corrections. Fold any correction into the brief before step 2. | Files: `.agents/skills/translate-article/references/voice-translation-brief.md` if corrected | Done when: Nim has said what to change, or that the pilot stands.

2. **Rewrite the remaining 16 translations**
   - Do: Launch agents in waves of at most 3 (the usage limit cut every 5-agent wave on Nov 1 and Nov 2), each with 2 or 3 packages, each told to write every file as soon as it is ready. Packages: W016 W062 W071 W079 W083 W087 W095 W106 W108 W126 W158 W159 W184 W195 W197 W198. Each agent reads the brief, the profile sections it names, and W004 and W186 as references. Spot-check two files per wave before the next wave. | Files: `data-source/writing/translations/<pkg>/article.en.md` and `translation-review.json` | Done when: every `article.en.md` has `translationStatus: revised-for-voice`, a footer, no em dash, and a review record with `portfolioGroup`.

3. **Translate the 44 new packages**
   - Do: Same method, waves of 5 agents with 3 packages each: W018, W019, W029, W031, W059, W070, W117, W119, W128, W130, W136, W138, W139, W140, W142, W143, W146, W147, W149, W150, W154, W155, W156, W161, W168, W169, W177, W178, W179, W188, W189, W191, W192, W199, W200, W201, W202, W203, W204, W205, W206, W207, W208, W209. Most are Israeli interviews (`portfolioGroup: israeli-interview`); W199 to W202, W205 and W206 are international. | Files: new `data-source/writing/translations/W###-slug/` folders, slug identical to the originals folder | Done when: 44 folders exist with both files and pass the brief's section 6 checks.

4. **Write the missing review records**
   - Do: For the 11 revised pieces without one, write `translation-review.json` in the brief's shape (W004 and W186 by comparing my own pilot translations against the Hebrew). | Done when: every translation folder has a review record with `portfolioGroup`.

5. **Finish the portraits**
   - Do: Research and download are done (see "Done so far"). What remains is step 0: host the files, drop the six explicit legacy records, rebuild. Two judgment calls for Nim: W004 Lady Gaga uses a clean 2008 portrait rather than an in-costume 2010 stage shot; W189 (Yael Sharoni and Liat Har Lev) was set to `none` because the only free image is a production still in wig and costume. | Done when: every interview page shows a credited portrait or a styled initials tile with `status: none` recorded.

6. **Review wave**
   - Do: Fresh agents, 5 packages each, compare English with Hebrew for fidelity and read the English alone for voice; they fix in place and report what they changed. | Done when: every package has been read by someone other than its translator.

7. **Bilingual voice page**
   - Do: Add a section to `voice-profile.md` on what identifies the Hebrew prose with Hebrew examples and the matching English renderings from the revised translations; build `src/pages/articles/voice.astro` with eight to ten paired passages; link it from the archive intro. Nim approves the text before it ships. | Done when: the page builds and Nim has approved the wording.

8. **Inventory, build, verify, report**
   - Do: Update `articles.csv` rows (Status `page created`, Translation Path, Page Path, Title (English)) with a script; `python scripts/writing/build_article_pages.py`; `npm run build`; `python scripts/verify_site.py`; `python scripts/writing/check_inventory.py`; `python scripts/writing/check_captures.py`. Write the completion report to `.agents/reports/` and update `reports/writing/`. Commit to the branch only when Nim asks; never push or publish without his word. | Done when: all checks pass and Nim has the report.

## Summary of Steps
Read the pilot, then finish the 26 revisions and 44 new translations in small agent waves, complete the portraits and review records, add the bilingual voice page, update the inventory, verify and report. Risk: the 5-hour usage limit; small waves and write-as-you-go limit the damage. Decisions for Nim: corrections after reading the pilot (step 1), the voice page wording (step 7), and when to commit, merge and publish.
