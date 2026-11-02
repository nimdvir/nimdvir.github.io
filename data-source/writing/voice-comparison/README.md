# Before and after: seven favorite interviews in two translations

Prepared November 1, 2026 for Nim's review. Each folder holds three files:

| File | What it is |
| --- | --- |
| `hebrew.he.md` | The verified Hebrew original, copied from `data-source/writing/originals/`. The reference for both translations. |
| `before.en.md` | The October 30, 2026 draft: a faithful, literal rendering. Recovered from git (commit `497da59`). Nim's verdict: "clunky and really not my style." |
| `after.en.md` | The voice version: translated again from the Hebrew under `.agents/skills/translate-article/references/voice-translation-brief.md` and `data-source/writing/voice-profile.md`. This is the version now in `data-source/writing/translations/` and on the site. |

| Folder | Piece | Who wrote the voice version |
| --- | --- | --- |
| `W001-jamie-foxx` | Jamie Foxx Is in the House (Ynet, 2005) | translation agent, Oct 31 |
| `W002-jim-carrey` | And Now, Seriously (Ynet, 2006) | Claude orchestrator, Nov 1 |
| `W003-julia-louis-dreyfus` | I'm Back (Israel Hayom, 2019) | Claude orchestrator, Nov 1 |
| `W004-lady-gaga` | Gaga Show (Ynet, 2009) | Claude orchestrator, Oct 31 (pilot) |
| `W006-rupaul` | "I'm Juicy, Not a Bitch" (Ynet, 2009) | Claude orchestrator, Nov 1 |
| `W023-matthew-broderick` | Social Justice in the Big Apple (Ynet, 2011) | translation agent, Oct 31 |
| `W089-killing-eve` | Haters: A Love Story (Israel Hayom, 2019) | Claude orchestrator, Nov 1 |

Both versions keep every paragraph, prompt, answer and caption in the Hebrew order. Nothing was added or cut in either. What changed is how the English is built.

## What changed, by category

### 1. Sentences are English sentences, not Hebrew sentences in English words

The before drafts kept Hebrew clause order and Hebrew connectives, so the reader hears the translation. The after versions rebuild each sentence the way an English journalist would write it, and keep the judgment or the joke in the last clause, where you put it.

| Hebrew (W003) | Before | After |
| --- | --- | --- |
| השנה האחרונה היתה רחוקה מחיוכים לג'וליה לואי דרייפוס, אישה שמתייחסת לחיים בהומור תמידי. | The past year has been far from smiles for Julia Louis-Dreyfus, a woman who treats life with constant humor. | The past year gave Julia Louis-Dreyfus, a woman who meets life with a permanent sense of humor, little to smile about. |

| Hebrew (W089) | Before | After |
| --- | --- | --- |
| זה ניכר כבר בלוק | It shows in the look | You can see it in the look |

| Hebrew (W002) | Before | After |
| --- | --- | --- |
| כמו הסרט, גם קארי, 43, מפתיע מקרוב. | Like the film, Carrey, 43, surprises up close. | Like the film, Carrey, 43, is a surprise up close. |
| ברגע זה היה יכול להפוך לסרט סוחט דמעות | In an instant this could have turned into a tearjerker. | That could have been a tearjerker in a heartbeat. |

### 2. Quotes sound like people talking

Your interviewees were speaking English; the Hebrew is your transcription. The before drafts translated the Hebrew back into written English. The after versions give them back their spoken register.

| Hebrew | Before | After |
| --- | --- | --- |
| "אני מרגיש שבהרבה סרטים עושים פטיש לאלימות, הופכים אותה לקולית" (W186, Gosling; your own example) | "I feel that a lot of films make a fetish of violence, they make it cool." | "I feel like a lot of films fetishize violence. They make it cool." |
| "תראה את השרירים", הוא מתרגש. "הכל אמיתי, באמת" (W001) | "Look at the muscles," he says, excited. "It's all real, really." | "Look at the muscles," he says, thrilled. "It's all real, really." (the quote stayed; the narration verb changed) |
| "אני עכשיו פריק של צלילות" (W002) | (literal) | "I'm a clarity freak now" |
| "מתוקות שלי, אני עסיסית, אבל אני לא כלבה" (W006) | "my sweethearts, I'm juicy, but I'm not a bitch" | "sweethearts, I'm juicy, but I'm not a bitch" |
| "לא, הטירוף הוא כאן ועכשיו" (W004) | "No. The madness is here and now." | kept; it was already right |

### 3. Slang and register match, not dictionary meaning

Your Hebrew collides formal connectives with street words in one sentence. The before drafts flattened both into neutral English. The after versions keep the collision.

| Hebrew | Before | After |
| --- | --- | --- |
| בעודו יושב - מבסוט מהחיים (W001) | Sitting, pleased with life | Sitting, happy as a clam |
| דווקא לג'יימי פוקס מתחשק לפרגן. בחור טוב, אתם יודעים (W001) | with Jamie Foxx, of all people, you actually feel like being generous. A good guy, you know. | with Jamie Foxx, of all people, you find yourself wanting to be generous. Good guy, you know. |
| זמרת בינונית מינוס (W004) | a mediocre-minus singer | a C-minus singer |
| המלכה בת ה-48 / מכונת ירייה של אמרות כנף (W006) | kept | kept: "the Queen, 48", "a machine gun of one-liners" |

### 4. Israeli references are translated, not transliterated

A word that means something to a Ynet reader and nothing to an English one is now carried over by meaning, with a short gloss on first mention and never a foreign substitute.

| Hebrew | Before | After |
| --- | --- | --- |
| האופנובנק (W186) | "the Ofnobank", throughout | "Israel's motorcycle bank robber" on first mention, then "the motorcycle bandit"; headline "The Motorcycle Bandit Is My Idol" |
| "מיליארד סיבות לשוד" (W023, the Hebrew title of Tower Heist) | released in Israel under the Hebrew title "A Billion Reasons for a Robbery," though the English is closer to "the robbery of the tower" | in Israel it goes by "A Billion Reasons for a Heist," which is not quite the same thing |
| "שישבת" (W003, Israel Hayom's weekend magazine) | Shishabat | Israel Hayom's weekend magazine |
| yes stars real, HOT, Next TV | kept | kept (channel names an English reader can look up) |

### 5. Headlines and section heads are headlines in English

Where the Hebrew pun cannot cross, the after version finds an English one that does the same job, or writes a clean headline. The choice is recorded in each `translation-review.json`.

| Hebrew | Before | After |
| --- | --- | --- |
| און דה ביץ' (W006, beach / bitch) | On the beach | Beach, Please |
| ריסים לרסיסים (W006, lashes / smithereens) | Lashes to pieces | Lashes to Ashes |
| מנסה לצאת מהריבועים (W186, abs / squares) | Trying to Get Out of the Abs | Thinking Outside the Six-Pack |
| שונאות סיפור אהבה (W089) | Haters: A Love Story | Haters: A Love Story (kept) |

### 6. Rhythm: long setup, short verdict

Your most reliable move is a long accumulating sentence followed by a one- or two-word sentence. The after versions protect the short sentences instead of folding them into the previous one.

| Hebrew (W004) | Before | After |
| --- | --- | --- |
| וזה הצליח לה: כיום היא שרה על... | And it worked for her: today she sings about... | It worked. Today she sings about... |
| ליאונרדו דה וינטג'. | Leonardo da Vintage. | Leonardo da Vintage. (kept, as a one-line paragraph ending) |

### 7. Captions and credits

Both versions keep the publisher photo captions in the file, with a provenance comment above each, because the archive needs them. The difference is on the website: the page builder was fixed on October 31 so that a caption for a photo that is not on the page is never printed. "Ryan Gosling. Wants to rob and can't (Photo: Gettyimages)" no longer appears under an empty space.

### 8. What did not change

- The order and count of paragraphs, prompts and answers. Prompt counts match the Hebrew in all seven.
- Historical statements as you wrote them (for example "nine Emmys for Seinfeld" in W003 stays as printed; the review file notes it).
- The serious passages. The cancer paragraphs and the sister's death in W003 stay as straight in the after version as in the before.
- Nothing was added: no jokes, no explanations of jokes, no closing lines.

## An honest note on the range

The gap between before and after is widest in the 2005 Ynet pieces (Foxx) and in Gosling, where the before drafts followed the Hebrew word by word. In the two Israel Hayom pieces (W003, W089) the before draft was already competent English, and the after version is a polish: rhythm, spoken quotes, the odd calque, headings. If you read only two folders, read `W001-jamie-foxx` and `W186` (Gosling, in `data-source/writing/translations/W186-ryan-gosling/`, with the before text quoted in the brief).

## What to tell me after reading

The most useful corrections are specific: a line where the after version is still not how you would say it, a joke that moved, a word you would never use. Those go into the brief and shape the remaining 26 revisions and 44 new translations. See `NEXT-STEPS.md` at the repository root.
