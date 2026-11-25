# Writing in Nim Dvir's Voice for *Using Data to Drive Business Performance*

**Bilingual Developmental Editing Guide (English and Hebrew) | מדריך עריכה דו-לשוני לקול המחבר (אנגלית ועברית)**

- **Date:** 2026-11-24
- **Prepared by:** Gemini
- **Target file:** `data-source/writing/voice/writing-style/writing-style-report-gemini-26-11-24.md`
- **Hebrew voice corpus:** 97 unique Nim-authored Hebrew articles across 104 packages in `data-source/writing/originals/` (2005 to 2019), verified against `data-source/writing/articles.csv`. Six `not my writing` IDs (`W016`, `W083`, `W094`, `W095`, `W197`, `W198`) are excluded and never quoted or counted; duplicate pairs (`W090`=`W003`, `W096`=`W089`, `W165`=`W005`) are treated as single works; coauthored `W106` is excluded from primary voice claims.
- **Edition 2 textbook sources:** Because the external ChatGPT Library URL could not be fetched directly, this guide uses the authoritative local textbook references in `G:\My Drive\0-Projects\!-important\data-book\`: `.agents/reference/writing-rules.md`, `.agents/reference/chapter-structure.md`, `.agents/skills/chapter-editor/references/human-voice-model-ch01-05.md`, `book-source-v0/files/ch10-grading-starter-2026-10-17.sql`, `book-source-v0/files/ch10-petvax-starter-2026-10-17.sql`, and active HTML Chapters 1, 10, 15, and 17.
- **Provenance disclosure:** `data-source/writing/voice/voice-profile.md` was inspected during initial workspace rule loading. Every Hebrew quotation, textbook passage, and SQL output in this guide was verified directly against `data-source/writing/originals/` and `data-book/`. Because `originals/` contains Hebrew journalism rather than English textbook drafts by Nim, English textbook phrasing rules are explicitly labeled as cross-language transfers and editorial adaptations, paired with his directly authored English note in Chapter 17 (`A Personal Note`) and his documented editorial rules.

---

# Part I: English Guide: Writing in Nim Dvir's Voice for *Using Data to Drive Business Performance*

## 1. A Portrait of Nim Dvir's Voice

Nim writes like an observant practitioner who walks into the room, notices what is actually on the desk, and refuses to repeat the press release. In his 2012 *Homeland* set report (`W158`), he does not summarize television magic in adjectives; he counts 150 crew members working from 8:00 a.m. to 10:00 p.m. for three days to film one scene (`"צוות של כ־150 איש עבד בחריצות מ־8:00 בבוקר עד 22:00... התוצר של הימים האלה הוא סצנה אחת בלבד (!)"`), opens a kitchen drawer to find full cutlery, and checks a bathroom cabinet for prop pill bottles. In his 2010 behind-the-scenes feature on reality television (`W184`), when a producer insists `"הכל אמיתי"` ("everything is real"), Nim states flatly what he witnessed with his own eyes: `"לא בדיוק. במו עיניי ראיתי שצילמתם שוב, למשל, מיני ריב בין המלכות ביאנקה דל ריו וליידי באני."`

Three habits define that voice across 14 years of Hebrew writing and carry directly into *Using Data to Drive Business Performance*:

1. **Concrete evidence comes before the label.** Whether he is listing boutique prices before a $9 bargain (`W107` / `W062`), walking through a quiet hotel corridor where Julia Louis-Dreyfus edits barefoot on a laptop (`W003`), or showing why Starbucks mobile orders backed up at the pickup counter (`ch01-2026-10-10-3.html`), he anchors the reader in what happened before naming the concept.
2. **Respect for the reader's intelligence, paired with skepticism toward hype.** He treats readers as adults who can smell filler. When he wants to challenge a hollow claim, he puts the plain facts on the table and lets a short verdict sentence finish the thought (`"שוקינג."` in `W058` / `"לא רע."` / `"סוג של שיחוק."` in `W184`). Warmth and dry humor appear when a situation earns them, and vanish completely when stakes are serious (`W087`, `W003`, `W159`).
3. **Clear structural signposting without lecturing.** He tells the reader where the piece is turning (`"לפני שממשיכים לחפור בגברת, קצת חומר רקע"` in `W046`, `"אבל למה להקדים את המאוחר"` in `W052`, `"נפתח בחדשות ישנות"` in `W184`) and then moves directly to the substance.

### Comparing Three Textbook Registers Against the Hebrew Corpus

| Passage type | Representative textbook source | What the passage actually does | Parallel in Nim's Hebrew corpus |
| --- | --- | --- | --- |
| **Early conceptual explanation** | `ch01-2026-10-10-3.html`, `"Unpacking the Name of the Book"` and `"How Can Data Improve Performance?"` | Tests familiar words (`Data`, `Business`, `Performance`, `Drive`) before defining them; puts the real problem first (`"Good data work usually begins with a problem, not a table"`). | `W071` (`"מה העניין?"`), `W002` opening: challenges an easy assumption before building the argument. |
| **Technical walkthrough** | `ch10-2026-10-26.html`, `"Layered Queries"` (`NOT IN` vs `NOT EXISTS`) and `"Planning and Checking Queries"` | States the grain, builds layer by layer, tests a silent `NULL` failure with real rows, and refuses to call a valid query "right" until it is checked (`"That proves the SQL is valid. It does not prove the numbers are right."`). | `W158` (crew hours and prop inspection) and `W184` (checking the producer's claim against observed retakes). |
| **Speaking directly to students** | `ch17-2026-11-08.html`, `"A Personal Note"` (`"I wrote this book because, year after year, students told me they understood the terms but not how they connect."`) | Drops textbook armor; uses plain `I` and `you`; short, sincere sentences with zero jokes and zero slogans. | `W093` (reflective meditation column), `W114` (honest personal admission in a book review), `W003` (sober opening on illness). |

### Separating Three Sources of Authority

Editors must not confuse what belongs to Nim's voice with what belongs to book infrastructure or editorial transfer:

| Layer | Evidence base | What it governs | Caution for editors |
| --- | --- | --- | --- |
| **1. Nim's authorial voice** | 97 solo Hebrew pieces in `originals/`; direct first-person notes (`ch17` `"A Personal Note"`); explicit editorial edits recorded in `ch01-editlog.md` to `ch05-editlog.md` and `ch17-editing-note-2026-11-02-gpt-sql-career.md`. | Concrete-first openings, skepticism of unsupported claims, register clarity, parenthetical glosses, long-then-short rhythm, restraint in humor, refusal to invent anecdotes. | `originals/` has no English textbook prose; English realizations are transfers, not direct English corpus quotes. |
| **2. Established book conventions** | `writing-rules.md`, `chapter-structure.md`, `human-voice-model-ch01-05.md`, approved HTML chapters (`ch01`, `ch10`, `ch15`, `ch17`). | 8-section chapter order, `Grading Database` vs `PetVax` split, AP style, sixth-grade explanatory prose target, zero em dashes, zero emojis, no section-number citations, two-way Terms Treasury sync. | An approved co-drafted HTML chapter shows an approach Nim accepted; approval alone does not prove Nim coined every phrase in it. |
| **3. Editorial recommendations** | Cross-language rules synthesized in this guide from Layers 1 and 2. | How to turn generic AI/textbook drafts into Nim's instructional cadence, how to judge beginner scaffolding, and how to handle AI/RAG claims responsibly. | Treat these as operational editing rules that yield immediately if Nim overrides them on a specific chapter. |

---

## 2. Editorial Decision 1: What Makes a Passage Sound Like Nim?

Saying "be conversational" produces chatty filler. Nim's voice comes from seven specific syntactic and structural habits.

### 2.1 Opening an Explanation
- **Mechanism:** Open with a concrete situation, a friction students recognize, or a common assumption that is about to fail. Never open with a sweeping claim about "modern business" or a dictionary definition.
- **Source evidence:** In `W002`, Nim opens by stating a familiar cliché and undercutting it in sentence two: `"פעם אמרו לנו שהפשע לא משתלם. מצד שני, פעם גם אמרו לנו שג'ים קארי הוא מטורף משהו משהו."` In `ch01-2026-10-10-3.html` (`"Unpacking the Name of the Book"`), the book opens: `"Put the title on the table for a moment... Those words sound familiar, which is exactly why they deserve a closer look."`
- **[Newly written example]:** `"A table full of dates and checkmarks looks reassuring until someone asks why a student has no grade for Tuesday's quiz. Did the student skip the quiz, or did the instructor forget to enter the score?"`
- **Editing instruction:** Delete any first sentence that mentions `"today's data-driven world"`, `"pivotal role"`, or `"essential cornerstone"`. Replace it with one specific question, table tension, or workplace friction the student already understands.

### 2.2 Addressing the Reader (`you`, `we`, and `I`)
- **Mechanism:** Use direct address to steer attention, never to lecture. In Hebrew (`W071`, `W002`, `W184`), Nim uses second-person plural imperatives (`"שימו לב ל\"בלוק\""`, `"קבלו את"`, `"נפתח בחדשות ישנות"`) to point the reader's eye. In the English textbook (`writing-rules.md`), follow the three-pronoun rule: `you` for an action or check the student performs, `we` for shared analytical reasoning, and `I` **only** for Nim's real, supplied teaching experience (never fabricate a classroom story).
- **Source evidence:** `ch17-2026-11-08.html` (`"A Personal Note"`): `"I wrote this book because, year after year, students told me they understood the terms but not how they connect."` Contrast `ch17-editing-note-2026-11-02-gpt-sql-career.md`, which explicitly instructs editors not to pass off an outside writer's `"I remember being VERY confused about JOINs"` as Nim's memory.
- **[Newly written example]:** `"Notice what happens when you filter on the right-hand table inside WHERE. We kept all five students in the FROM clause, yet one student just vanished from your screen."`
- **Editing instruction:** Change passive `"it can be observed that"` to `"notice"` or `"check"`. Change generic `"one must verify"` to `"you verify"` for steps and `"we need to separate"` for reasoning. Strip any invented `"I once had a client"` anecdote.

### 2.3 Choosing Verbs
- **Mechanism:** Nim pairs plain, physical action verbs with occasional high-precision analytical terms (`W052`, `W158`), avoiding inflated corporate or academic filler. `writing-rules.md` codifies this for the textbook: prefer `use`, `is`, `has`, `show`, `help`, `need` over `utilize`, `leverage`, `empower`, `facilitate`, `showcase`, `delve`. For software and AI, use mechanical verbs (`stores`, `filters`, `retrieves`, `calculates`, `predicts`, `generates`), never anthropomorphic verbs (`knows`, `understands`, `wants`, `thinks`).
- **Source evidence:** `ch15-2026-10-28.html` (`"How AI Models and Large Language Models Work"`): `"A database contains explicit records and retrieves them through defined operations. A model contains learned numerical patterns and produces an output based on those patterns."`
- **[Newly written example]:** `"A foreign key blocks an invoice row from pointing to an appointment ID that does not exist."` (Not: `"Referential integrity empowers the database ecosystem to facilitate accuracy."`)
- **Editing instruction:** Circle every instance of `leverage`, `utilize`, `empower`, `facilitate`, `delve`, `showcase`, `unlock`, and any verb that makes an AI `"know"` or `"understand"`. Replace each with the literal database or model action (`stores`, `joins`, `drops`, `retrieves`, `generates`).

### 2.4 Using Questions
- **Mechanism:** Use short pivot questions (typically 4 to 9 words) to voice the exact skepticism a smart student is thinking, or to turn from background to evidence. In `originals/`, Nim's questions are compact and pointed (`"מה הם עשו במשך 14 שעות כפול 3?"` in `W158`; `"אז למה להוציא את עצמך בכוח מהכלל?"` in `W071`).
- **Source evidence:** `ch01-2026-10-10-3.html` (`"How Can Data Improve Performance?"`): `"The useful question is not 'Which database should we buy?' It is something much simpler: Why are customers waiting so long, and where is the bottleneck?"`
- **[Newly written example]:** `"Four students appear in the result, not five. Where did Daniel Kim go?"`
- **Editing instruction:** Limit pivot questions to one per conceptual turn. Never open a section with three stacked rhetorical questions, and always answer a pivot question in the very next sentence.

### 2.5 Introducing Technical Vocabulary
- **Mechanism:** Sequence every new term as: (1) familiar problem or concrete instance, (2) plain-English job the concept performs, (3) exact technical term marked once on first meaningful use (`<span class="term-first-use">` and synced with Terms Treasury). Borrow Nim's inline parenthetical gloss habit (`W062` explaining a BlackBerry in parentheses; `W002` glossing Enron in one concise parenthetical) when an acronym or system note needs quick orientation without derailing the sentence.
- **Source evidence:** `ch10-2026-10-26.html` (`"Common Table Expressions"`): `"A common table expression, or CTE, gives a name to a middle step with WITH. The name exists only while that one statement runs."`
- **[Newly written example]:** `"Before writing SQL, decide what one row in your answer represents (analysts call this the grain of the query). Here, one row represents one student."`
- **Editing instruction:** If a sentence defines a new technical term using two other undefined technical terms, split it. Move the concrete example before the term, explain the job in plain English, introduce the term once, and stop bolding or redefining it on later mentions.

### 2.6 Moving Between Short and Longer Sentences
- **Mechanism:** Nim's strongest rhythmic fingerprint in the Hebrew corpus is an accumulating multi-clause setup sentence (18 to 30+ words) followed by a short, crisp verdict sentence (2 to 8 words) sitting in the **last position of the paragraph**. Note the important textbook refinement in `human-voice-model-ch01-05.md` (`"Chapter 1"`): keep the short punchline at the end of the paragraph rather than isolating it as a theatrical single-line paragraph.
- **Source evidence:** In `W058`, a 25-word description of a contrived shoot ends in one word (`"שוקינג."`). In `ch10-2026-10-26.html` (`"Check: Prove the Result Before You Share It"`): `"The query ran without an error. That proves the SQL is valid. It does not prove the numbers are right."`
- **[Newly written example]:** `"A query can join four tables, calculate averages to two decimal places, and sort the roster alphabetically without raising a single syntax error. If the WHERE clause silently dropped every student without an attendance row, the report is still wrong."`
- **Editing instruction:** Check paragraphs where every sentence is 12 to 15 words (uniform AI cadence). Combine two related conditions into one clear setup sentence, and cut the concluding clause down to a direct 5-to-9-word verdict at the end of the paragraph.

### 2.7 Where Warmth, Dry Humor, and Personal Observation Earn Their Place
- **Mechanism:** Humor in Nim's prose is dry, situational, and never targets a beginner or a vulnerable person (`W087`, `W003`, `W159`). When he mocks anyone in his columns, he makes himself the foil (`W114`: `"אני אינני אצן, ולמעשה מתחזק תדמית של פדלאה רצינית"`). In the textbook (`writing-rules.md`), humor belongs to the data mismatch itself, not to pop-culture slang or jokes in every box.
- **Source evidence:** `writing-rules.md` (`"Humor"`): `"A second customer named Alex is not a database emergency. A second customer with the same primary key is."` By contrast, `ch17-2026-11-08.html` (`"A Personal Note"`) and `W003` (`"לא קל לראות קומיקאית דומעת"`) show zero humor when addressing student effort or serious human stakes.
- **[Newly written example]:** `"SQL happily averages every non-empty score and ignores NULL without complaining. It does not care whether an empty cell meant the student never submitted the homework or you simply have not graded it yet."`
- **Editing instruction:** Keep at most one dry situational beat per major topic, strictly tied to the technical point. Remove all humor from RAT questions, lab grading steps, error-recovery warnings, privacy rules, and ethical discussions.

---

## 3. Editorial Decision 2: How to Make a Difficult Idea Understandable

### The Four-Step Teaching Progression
To guide an undergraduate business student who reasons well about organizations before knowing SQL or AI vocabulary, move through four steps in order:

1. **Recognizable problem:** A real operational mistake or ambiguity a business person would care about.
2. **Structural distinction:** What one row in each table actually represents, and which facts exist versus which facts are missing.
3. **Technical name:** The exact SQL, modeling, or AI term for that mechanism.
4. **Practical consequence:** What an analyst or manager can responsibly conclude and do next.

### Judging What Beginners Need Spelled Out vs. What They Can Infer
- **What the student can infer (keep brief):** Why an organization cares about fairness, wasted money, angry customers, or wrong grades. Never write `"Attendance matters because students who miss class often struggle."` Undergraduates already know that.
- **What the student cannot infer (spell out step by step):** Hidden database and model mechanics. Beginners routinely assume that `NULL` equals `0` or `false`, that an `INNER JOIN` keeps everyone in the first table, that a `WHERE` filter on a right-side table leaves unmatched `LEFT JOIN` rows intact, or that an AI chatbot "reads the whole database" when asked a question.

### Demonstration A: "Which students missed class, and which students simply have no attendance record?"

A beginner looking at a class roster often treats `"absent"` and `"blank"` as the same thing. In a relational database, they represent two different facts:

1. **The operational confusion:** Suppose an instructor wants to email students who missed Friday's class (`ClassNum = 4`) and also check whether anyone slipped off the roster.
2. **The structural distinction:** In `grading.ATTENDANCE`, a row with `Attended = false` records an explicit observation: attendance was taken for that student on that date, and the student was not there. By contrast, if a student appears in `grading.STUDENT` (`S1004`, Daniel Kim) and has **no matching row** in `grading.ATTENDANCE` for `ClassNum = 4`, no observation was recorded at all. Maybe Daniel registered late, switched sections, or the sign-in sheet missed a page.
3. **The technical mechanism:** An `INNER JOIN` keeps only students who have a matching `ATTENDANCE` row, hiding `S1004` completely. A `LEFT JOIN` from `grading.STUDENT` to `grading.ATTENDANCE` (with `a.ClassNum = 4` placed in the `ON` clause, not `WHERE`) preserves all enrolled students and produces `NULL` in `a.Attended` for anyone with no record.
4. **What the instructor can responsibly conclude:**
   - For `Attended = false` (`S1002` Brian Lee, `S1005` Elena Rossi): the data supports counting an absence and sending an attendance check-in.
   - For `Attended IS NULL` (`S1004` Daniel Kim): the data **does not** support calling Daniel absent. The responsible conclusion is `"no attendance record exists for Class 4"`, and the action is to verify enrollment timing or check the raw sign-in log before penalizing the student.

*(Note: Chapter 15, `"The Same Words, Different Questions"`, demonstrates the exact parallel in `grading.STUDENT_GRADE`: Elena Rossi's `Score IS NULL` on Quiz 3 means submitted and ungraded, whereas Daniel Kim's missing `STUDENT_GRADE` row for Homework 2 means unsubmitted.)*

### Demonstration B: Carrying the Same Discipline Into AI ("The AI system uses the database")

Saying `"our AI assistant uses the company database"` hides everything an analyst must verify, just like saying `"a reality show is unscripted"` (`W184`) hides the retakes and closed restaurant. Following `ch15-2026-10-28.html` (`"Database Versus Model Versus RAG System"` and `"Embeddings, Vector Search, and Retrieval-Augmented Generation"`), an editor must make four concrete facts visible whenever a passage describes a RAG or tool-using AI system:

1. **What query or retrieval ran:** Did the system execute a read-only SQL query against `petvax.APPOINTMENT` and `petvax.INVOICE`, or run a vector similarity search over chunked clinic PDFs (`knowledge_chunk`)?
2. **What evidence actually entered the model's context window:** Name the exact rows, columns, or retrieved snippets passed during inference (for example, `ServiceName = 'Blood Panel'`, `DefaultCharge = 85.0`, `Description = NULL`).
3. **What never reached the model:** Unretrieved rows outside the top-k vector matches, private columns blocked by permissions, empty (`NULL`) descriptions, or unrecorded phone calls explaining why a pet owner rescheduled.
4. **What the answer can legitimately claim:** A grounded summary can state the `DefaultCharge` of `$85.00` from the retrieved `petvax.SERVICE` row, and it must note when `Description` is `NULL`. It **cannot** claim `"blood panels include a 24-hour turnaround"` unless a retrieved, dated policy chunk inside the prompt explicitly states that rule. Fluency is not evidence (`ch15-2026-10-28.html`).

---

## 4. Editorial Decision 3: What Makes a Worked Example Belong in This Book?

### Case Separation Rule (`writing-rules.md`)
- **Grading Database:** Used in **Core Concepts** and **Let's Build** for guided explanation. Students already know courses, rosters, quizzes, and attendance, so their cognitive effort stays on the database concept.
- **PetVax:** Used in **Chapter Labs** for independent transfer. Students apply the same relational pattern to owners, pets, appointments, services, and invoices without copying the Grading query line for line. Never mix tables or column names between the two systems.

### Complete Worked Example (PostgreSQL / Supabase Dialect)

**Business question:** On September 11, 2026 (`ClassNum = 4`, *"Keys and relationships"*), which enrolled students were recorded absent, and which enrolled students have no attendance record at all?

**Fictional input tables** *(teaching slice modeled on `ch10-grading-starter-2026-10-17.sql`, with Daniel Kim's Class 4 attendance row omitted to illustrate a missing record)*:

- **`grading.STUDENT`** (Grain: one row per enrolled student. Primary key: `StudentID`.)

| StudentID | FirstName | LastName |
| --- | --- | --- |
| S1001 | Alice | Johnson |
| S1002 | Brian | Lee |
| S1003 | Carla | Mendez |
| S1004 | Daniel | Kim |
| S1005 | Elena | Rossi |

- **`grading.SCHEDULE`** (Grain: one row per scheduled class meeting. Primary key: `ClassNum`.)

| ClassNum | Week | ClassDate | Topic | Format |
| --- | --- | --- | --- | --- |
| 4 | 2 | 2026-09-11 | Keys and relationships | In person |

- **`grading.ATTENDANCE`** (Grain: one row per recorded student attendance entry for one class meeting. Primary key: `AttendanceID`. Unique key: `(StudentID, ClassNum)`. Foreign keys: `StudentID` references `grading.STUDENT(StudentID)`; `ClassNum` references `grading.SCHEDULE(ClassNum)`.) *Showing the four Class 4 rows in this teaching slice:*

| AttendanceID | StudentID | ClassNum | Attended |
| --- | --- | --- | --- |
| 13 | S1001 | 4 | true |
| 14 | S1002 | 4 | false |
| 15 | S1003 | 4 | true |
| 16 | S1005 | 4 | false |

**Query 1 (Confirmed PostgreSQL):**

```sql
SELECT s.StudentID,
       s.FirstName,
       s.LastName,
       a.ClassNum,
       a.Attended,
       CASE
           WHEN a.Attended IS TRUE  THEN 'Present'
           WHEN a.Attended IS FALSE THEN 'Recorded absent'
           ELSE 'No attendance record'
       END AS AttendanceStatus
FROM grading.STUDENT AS s
LEFT JOIN grading.ATTENDANCE AS a
  ON s.StudentID = a.StudentID
 AND a.ClassNum = 4
ORDER BY s.StudentID;
```

**Exact Output (5 rows):**

| studentid | firstname | lastname | classnum | attended | attendancestatus |
| --- | --- | --- | --- | --- | --- |
| S1001 | Alice | Johnson | 4 | true | Present |
| S1002 | Brian | Lee | 4 | false | Recorded absent |
| S1003 | Carla | Mendez | 4 | true | Present |
| S1004 | Daniel | Kim | (NULL) | (NULL) | No attendance record |
| S1005 | Elena | Rossi | 4 | false | Recorded absent |

**Plain-language interpretation:** All five enrolled students appear because `grading.STUDENT` sits on the left of the `LEFT JOIN` and `a.ClassNum = 4` sits inside the `ON` condition. Two students (Brian Lee and Elena Rossi) have explicit `false` records and were marked absent. One student (Daniel Kim, `S1004`) has `(NULL)` in both `classnum` and `attended`, meaning no Class 4 attendance row exists for him. The instructor contacts Brian and Elena about missed material, and checks Daniel's enrollment date or raw sign-in sheet before counting an absence.

**Change one condition and watch what changes:** Move `a.ClassNum = 4` out of the `ON` clause and into a `WHERE` clause:

```sql
SELECT s.StudentID,
       s.FirstName,
       s.LastName,
       a.ClassNum,
       a.Attended,
       CASE
           WHEN a.Attended IS TRUE  THEN 'Present'
           WHEN a.Attended IS FALSE THEN 'Recorded absent'
           ELSE 'No attendance record'
       END AS AttendanceStatus
FROM grading.STUDENT AS s
LEFT JOIN grading.ATTENDANCE AS a
  ON s.StudentID = a.StudentID
WHERE a.ClassNum = 4
ORDER BY s.StudentID;
```

**Exact New Output (4 rows):**

| studentid | firstname | lastname | classnum | attended | attendancestatus |
| --- | --- | --- | --- | --- | --- |
| S1001 | Alice | Johnson | 4 | true | Present |
| S1002 | Brian | Lee | 4 | false | Recorded absent |
| S1003 | Carla | Mendez | 4 | true | Present |
| S1005 | Elena | Rossi | 4 | false | Recorded absent |

**Why it changed:** `WHERE` runs after the `LEFT JOIN` builds its combined rows. In Daniel Kim's unmatched row, `a.ClassNum` is `NULL`, and `NULL = 4` evaluates to unknown rather than true. Moving that filter to `WHERE` silently turns the `LEFT JOIN` into an `INNER JOIN` and hides the exact student with the missing record.

### Print Legibility, Digital Reader Usability, and What Editors May Shorten

- **Print and reader legibility:** Keep output tables to 6 columns or fewer (`chapter-design-system` / `ch10` convention), use concise column aliases (`AttendanceStatus`), display empty values visibly as `(NULL)` rather than blank space, and always include `ORDER BY` so print tables and digital SQL Editor results match row for row.
- **What an editor may shorten:** Narrative scene-setting above the query (keep to 2 or 3 sentences), non-relevant columns such as `Email` or `Birthday`, and rows from unrelated `ClassNum` meetings in the preview table (when explicitly labeled as a slice).
- **What an editor must never cut:** What one row represents (the grain), primary and foreign keys, the schema prefix (`grading.`), `ORDER BY`, the exact expected row count, the `NULL` row (`S1004`) that proves the concept, or the plain-language distinction between a recorded `false` and a missing row.

---

## 5. Editorial Decision 4: How the Voice Changes with the Section

Edition 2 rules (`chapter-structure.md`, `writing-rules.md`) govern fixed section order (`introduction`, `core-concepts`, `terms-treasury`, `rat`, `lets-build`, `chapter-lab`, `review-questions`, `key-takeaways`), AP style (spell out one through nine in prose; figures for 10 and above, dates, scores, IDs, and database values), Brightspace quiz notices, two-way Terms Treasury synchronization, and the absolute bans on em dashes, emojis, and section-number cross-references. Within that structure, **how** Nim's voice speaks shifts with each section's job.

### Same Idea Across Six Textbook Sections (`LEFT JOIN`: Recorded Negative vs. Missing Record)

| Section | Voice & register shift | Actual model sentence (new textbook text, zero em dashes) |
| --- | --- | --- |
| **1. Chapter Opening** (`Introduction`) | Inviting, problem-first, plain stakes; no SQL syntax yet. | `"Before you trust any exception report, you have to tell the difference between a recorded problem and a missing record."` |
| **2. Core Concepts** (`Grading Database`) | Analytical, step-by-step, concrete-to-technical; names grain and SQL logic. | `"In a LEFT JOIN, placing a right-table filter inside WHERE drops unmatched NULL rows and silently hides the students who have no attendance record at all."` |
| **3. Figure Caption** | Compact, visual-anchored, states the relational takeaway rather than a generic label. | `"Figure 10.7. Filtering the right table inside ON keeps Daniel Kim with a NULL attendance value, while filtering in WHERE removes his row."` |
| **4. Let's Build Step** (`Grading Database`) | Imperative, exact schema/object names, explicit self-check and expected output. | `"Run the LEFT JOIN query against grading.STUDENT and grading.ATTENDANCE, then verify that your result returns five rows and keeps S1004 (Daniel Kim) with NULL in Attended."` |
| **5. Independent Lab Prompt** (`PetVax`) | Concise business request; names tables and business rule, leaves join choice and output check to the student (never prints a graded count). | `"Write a PostgreSQL query that lists every completed appointment in petvax.APPOINTMENT that has no matching row in petvax.INVOICE, and explain in one sentence why an INNER JOIN would miss the billing gap."` |
| **6. Key Takeaway** | Crisp synthesis connecting technical mechanics to human judgment; no new terms, no slogan. | `"A LEFT JOIN protects the population you started from, so missing records stay visible for human verification instead of disappearing as silent exclusions."` |

*(Verification note on the PetVax transfer prompt above: in `ch10-petvax-starter-2026-10-17.sql`, `AppointmentID = 1009` has `Status = 'Completed'` and no row in `petvax.INVOICE`, making it the real parallel to Daniel Kim's missing record without spoiling the answer for the student.)*

---

## 6. Editorial Decision 5: What an Editor Should Change on Sight

Every pair below preserves technical meaning, approved terminology, and zero em dashes or emojis.

### Pair 1: A Generic Opening
- **Before (plausible first draft):**
  > In today's fast-paced, data-driven business landscape, relational databases play a pivotal role in empowering organizations to leverage actionable insights across departments. Moreover, understanding how tables connect is an essential cornerstone for any aspiring business professional.
- **After (Nim's textbook voice):**
  > A store can record ten thousand sales in a spreadsheet and still not know which supplier caused a delay. Spreadsheets store lists well, but business questions usually cross from one list to another. Relational databases connect those lists through shared keys so you can trace an answer back to the exact order, customer, and supplier.
- **Exact change:** Cut `"In today's fast-paced, data-driven business landscape"`, `"play a pivotal role"`, `"empowering"`, `"leverage actionable insights"`, `"Moreover"`, and `"essential cornerstone"`. Replaced them with a specific operational failure (10,000 sales vs. tracing a supplier delay) and plain verbs (`record`, `store`, `connect`, `trace`).
- **What the student can now understand or do:** The student sees immediately what a relational database solves that a flat spreadsheet cannot, instead of wading through two sentences of corporate filler.

### Pair 2: A Definition That Assumes Too Much
- **Before (plausible first draft):**
  > A foreign key enforces referential integrity across normalized relational schemas by constraining tuple attribute values to correspond to existing candidate keys in referenced parent relations.
- **After (Nim's textbook voice):**
  > Suppose someone types student ID `S9999` into `grading.STUDENT_GRADE` when no student `S9999` exists in `grading.STUDENT`. Without a rule blocking that entry, the grade belongs to nobody. A **foreign key** is a column (or set of columns) in one table whose values must match an existing primary key in another table, or stay empty if the rule allows it. That rule stops orphan records before they corrupt your reports.
- **Exact change:** Moved the concrete failure (`S9999` in `grading.STUDENT_GRADE`) before the technical label; replaced undefined jargon (`referential integrity`, `normalized relational schemas`, `tuple attribute values`, `candidate keys`, `parent relations`) with `Grading Database` table names and one plain-English consequence (`orphan records`).
- **What the student can now understand or do:** A first-course student can visualize the exact bad row a foreign key blocks and check a schema for that link.

### Pair 3: A Procedural Step with an Unclear Outcome
- **Before (plausible first draft):**
  > **Step 4:** Now use a join to combine the student and attendance tables for Class 4 and inspect the output to make sure everything looks right.
- **After (Nim's textbook voice):**
  > **Step 4: Find students with and without Class 4 attendance records.** In the Supabase SQL Editor, query `grading.STUDENT` (`s`) with a `LEFT JOIN` to `grading.ATTENDANCE` (`a`) using `ON s.StudentID = a.StudentID AND a.ClassNum = 4`. Run the `SELECT` query once. **Check your result:** you should see five rows (`S1001` through `S1005`), with `S1004` (Daniel Kim) showing `(NULL)` for `ClassNum` and `Attended`. Because this step only reads data, running it again changes nothing.
- **Exact change:** Replaced vague `"use a join"` and `"make sure everything looks right"` with exact schema-qualified table names, the join type, the placement of `a.ClassNum = 4` in `ON`, a concrete 5-row check naming `S1004`, and a read-only rerun note per `chapter-structure.md` Let's Build standards.
- **What the student can now understand or do:** The student knows where to run the query, what exact result proves the join worked, and how to spot immediately if a `WHERE` filter accidentally dropped `S1004`.

### Pair 4: A Business or AI Claim That Exceeds the Evidence
- **Before (plausible first draft):**
  > Because the PetVax AI assistant is connected to the clinic database, it knows why pet owners cancel appointments and automatically determines the best retention strategy for each client.
- **After (Nim's textbook voice):**
  > When a clinic manager asks the PetVax AI assistant about cancellations, a connector runs a read-only query against `petvax.APPOINTMENT` and passes the matching rows (including `AppointmentDate`, `Status`, and short `Reason` entries) into the model's prompt. The model can summarize the `Reason` text it received, but it cannot see phone calls or desk notes that staff never entered into the database, and it cannot weigh clinic staffing costs on its own. A manager must verify the SQL rows first and then choose the retention action.
- **Exact change:** Removed `"knows"` and `"automatically determines the best retention strategy"`. Spelled out the connector's actual path (read-only query on `petvax.APPOINTMENT` -> specific columns entering the prompt), named the unrecorded evidence left outside the database, and restored decision accountability to the clinic manager.
- **What the student can now understand or do:** The student can trace an AI answer back to the exact SQL evidence that reached the prompt and distinguish a database summary from an unsupported managerial recommendation.

---

## 7. One-Page Editing Checklist and Reusable Prompt (English)

### One-Page Editing Checklist
- **Voice & Opening:** Does the section open with a concrete problem, friction, or testable assumption rather than `"In today's data-driven world"`?
- **Address & Pronouns:** Does `you` direct student action, `we` carry shared reasoning, and `I` appear only for Nim's real, supplied experience (zero invented anecdotes)?
- **Verbs & AI Precision:** Are promotional verbs (`leverage`, `utilize`, `empower`, `showcase`) replaced with plain verbs (`use`, `is`, `has`, `show`)? Do AI passages use mechanical verbs (`retrieves`, `predicts`, `generates`) rather than `"knows"` or `"wants"`?
- **Syntax & Rhythm:** Do paragraphs vary length, pairing concrete setup sentences with a short, decisive closing clause inside the paragraph rather than uniform 14-word AI cadence or stacked one-line paragraphs?
- **Vocabulary Discipline:** Is every new term introduced via problem -> plain-English job -> exact term (tagged once and synced with Terms Treasury), without circular jargon or repeated re-definitions?
- **Earned Humor & Tone Limits:** Is any humor brief, situational, and close to the data, with zero jokes in serious, ethical, privacy, error-recovery, or assessment text?
- **Worked Examples:** Are `Grading Database` (guided) and `PetVax` (transfer) kept strictly separate? Does every SQL example state the question, grain, keys, dialect, exact output, plain-language meaning, and verification check?
- **Section Fit:** Does Core Concepts teach the idea, Let's Build give explicit self-checks, and the Lab leave the pattern transfer to the student without giving away graded values?
- **Hard House Rules:** Zero em dashes (U+2014, HTML mdash entities, or double hyphens used as dashes in prose), zero emojis, no section-number cross-references (`"Section 8.4"`), book called ***Using Data to Drive Business Performance*** / **Data book** / **Database book** (never `"BITM330"`), AP numbers and dates.

### Copy-Ready Reusable Prompt (English)

```text
Revise this passage in Nim Dvir's textbook voice for Using Data to Drive Business Performance (undergraduate business students, many in their first database course).

Keep: all technical meaning, exact table/column names, SQL dialect, numbers, and approved terminology.
Use: concrete business or data problems before technical labels; plain verbs (use, is, has, show); "you" for student actions, "we" for shared reasoning, and "I" only for supplied author experience (never invent anecdotes); short pivot questions that voice real student doubt; and varied rhythm where concrete setup sentences end on a crisp verdict inside the paragraph.
Explain difficult concepts by separating recorded values from missing records (and for AI, by naming what query/document reached the prompt versus what stayed outside).
Remove: corporate/AI filler ("in today's data-driven world", "pivotal role", "moreover", "this is not X, it is Y"), anthropomorphic AI verbs ("knows", "wants"), section-number cross-references, emojis, and all em dashes (recast with periods, commas, colons, or parentheses).

Explain briefly at the end which specific edits you made and what the student can now understand or do more easily.
```

---

# חלק ב: המדריך המלא בעברית: כתיבה ועריכה בקול של נמרוד דביר עבור הספר *Using Data to Drive Business Performance*

## 1. דיוקן הקול של נמרוד דביר מתוך המקורות העבריים והספר

מי שקורא את הכתבות של נמרוד דביר לאורך 14 שנים (`2005` עד `2019`, מתוך 97 טקסטים ייחודיים שנכתבו על ידו בתיקיית `data-source/writing/originals/`) מזהה מיד עיתונאי שמסתכל על המציאות בלי להתפעל מיחסי ציבור, בודק פרטים קטנים ביד, וסומך על הקורא שיבין רמז בלי שיסבירו לו את הבדיחה. בכתבה על סט הצילומים של *"הומלנד"* (`W158`) הוא לא מסתפק בתיאור אווירה כללי: הוא סופר 150 אנשי צוות שעובדים מ־8:00 בבוקר עד 22:00 במשך שלושה ימים על *"סצנה אחת בלבד (!)"*, פותח מגירת מטבח ומגלה סכו"ם מלא, ובודק בארון האמבטיה מכלי תרופות. בכתבה על מלכות הדראג בניו יורק (`W184`), כשהמפיק מתעקש ש*"הכל אמיתי"*, נים עוצר ועונה במילים פשוטות על סמך מה שראה בעצמו: *"לא בדיוק. במו עיניי ראיתי שצילמתם שוב, למשל, מיני ריב בין המלכות ביאנקה דל ריו וליידי באני."*

שלוש תכונות יסוד עוברות מן העיתונות העברית ישר אל הכתיבה האקדמית והלימודית שלו לסטודנטים לתואר ראשון במנהל עסקים:

1. **הפרט המוחשי קודם למונח התיאורטי.** בין אם זה פירוט שעות עבודה (`W158`), דוגמת כרטיס הביקור של הקהילה על המרקע (`W071`: *"הנוכחות על המרקע היא כרטיס הביקור שלנו"*), או עומס ההזמנות בדלפק האיסוף של סטארבקס בפרק 1 של הספר (`ch01-2026-10-10-3.html`), נים מציג קודם את המצב הבעייתי בעולם האמיתי ורק אחר כך נותן לו שם מקצועי.
2. **כבוד לאינטליגנציה של הקורא ושנאה לסיסמאות.** הקורא של נים יודע לזהות מריחה. לכן נים מעדיף משפט צובר שמפרט תנאים, ואחריו מכת סיום קצרה ומדויקת בסוף הפסקה (`"שוקינג."` ב-`W058`, `"סוג של שיחוק."` ב-`W184`, `"תכלס, אין תלונות בקשר לכמות."` ב-`W071`). כשמדובר בסבל אמיתי, במחלה או במוות (`W087`, `W003`, `W159`), ההומור נעלם לחלוטין. כך גם בהערה האישית בסוף הספר (`ch17-2026-11-08.html`, `"A Personal Note"`): משפטים קצרים, כנים, בלי התחכמות.
3. **סימון דרך ברור בלי הרצאות מיותרות.** נים מודיע לקורא מתי הוא עוצר להסביר רקע ומתי חוזרים לעניין עצמו (`"לפני שממשיכים לחפור בגברת, קצת חומר רקע"` ב-`W046`, `"אבל למה להקדים את המאוחר. נתחיל בפרמיירה"` ב-`W052`, `"נפתח בחדשות ישנות"` ב-`W184`).

### הפרדה בין קול המחבר, מוסכמות הספר והמלצות עריכה

במקורות `originals/` יש אך ורק עיתונות בעברית, ללא טיוטות מקוריות של ספר לימוד באנגלית. לכן כל כלל ניסוח לספר הלימוד בעברית (או באנגלית) מבחין במפורש בין שלושה מקורות סמכות:
- **קול המחבר של נים:** נגזר ישירות מ-97 הטקסטים העבריים הבלעדיים שלו ב-`originals/` (לאחר הוצאת `W016`, `W083`, `W094`, `W095`, `W197`, `W198` והפרדת ציטוטי מרואיינים וכותרות עורכים), ומן הכתיבה הישירה בגוף ראשון בסוף הספר (`ch17` `"A Personal Note"`) והנחיות העריכה שלו (`ch17-editing-note-2026-11-02-gpt-sql-career.md`).
- **מוסכמות הספר הקיימות (Edition 2):** נגזרות מ-`writing-rules.md`, `chapter-structure.md`, `human-voice-model-ch01-05.md` והפרקים המאושרים (`ch01`, `ch10`, `ch15`, `ch17`). קטע שאושר בפרק מראה שגישה לימודית מסוימת מקובלת על נים, אך אינו מוכיח שכל צירוף מילים בו נכתב במקור על ידו.
- **התאמות והמלצות עריכה:** תרגום השיטה העיתונאית של נים לכתיבה לימודית מובנית על מסדי נתונים ו-AI, תוך שמירה על מונחים אנגליים מקצועיים (`SELECT`, `LEFT JOIN`, `NULL`, `StudentID`) בתוך טקסט עברי טבעי.

---

## 2. החלטת עריכה 1: מה גורם לפסקה להישמע כמו נים?

לומר לעורך "תכתוב בצורה שיחתית" זה חסר תועלת. הקול של נים נשען על שבע בחירות לשוניות ומבניות שניתנות לבדיקה אובייקטיבית.

### 2.1 איך פותחים הסבר
- **המנגנון:** פותחים בסיטואציה מוכרת, בחיכוך אמיתי או בטענה רווחת שנבדקת מיד מול המציאות. לא פותחים בהצהרה כללית על חשיבות הטכנולוגיה או בהגדרה מילונית.
- **ראיה מהמקור:** ב-`W002`: `"פעם אמרו לנו שהפשע לא משתלם. מצד שני, פעם גם אמרו לנו שג'ים קארי הוא מטורף משהו משהו."` ב-`W092`: `"זו אומנם קלישאה, אבל היא מוכיחה את עצמה: מלחיץ לגור בניו יורק."`
- **[דוגמה חדשה שנכתבה למדריך]:** `"טבלה מלאה תאריכים וסימוני נוכחות נראית מסודרת מאוד, עד שמישהו שואל למה לסטודנט אחד אין ציון בבוחן של יום שלישי. האם הוא הבריז, או שפשוט עוד לא הקלדנו את הציון שלו?"`
- **הוראת עריכה:** מחקו כל משפט פתיחה בסגנון `"בעולם מונע הנתונים של היום, מסדי נתונים ממלאים תפקיד מכריע"`. החליפו אותו בבעיה אחת שמנהל או מרצה נתקל בה כבר בשורה הראשונה.

### 2.2 איך פונים לקורא (`אתם`, `אנחנו`, `אני`)
- **המנגנון:** בכתיבה העברית של נים (`W071`, `W002`, `W079`), הפנייה הישירה לקורא מפנה מבט באמצעות ציווי קל או גוף ראשון רבים משתף (`שימו לב ל"בלוק"`, `"נפתח בחדשות ישנות"`, `"קבלו את"`). בספר הלימוד (`writing-rules.md`): פנו בגוף שני (`אתה`/`את`/`אתם`) כשהסטודנט מבצע פעולה או בודק תוצאה, בגוף ראשון רבים (`אנחנו`) כשחושבים יחד על ההיגיון, ובגוף ראשון יחיד (`אני`) רק כשמדובר בניסיון ממשי שנמסר מנים עצמו.
- **ראיה מהמקור:** `W071`: `"שימו לב ל"בלוק", תוכנית ריאליטי נאורה לכאורה"` ו-`"עכשיו, אם אנחנו בקטע של קבלה, אז למה להוציא את עצמך בכוח מהכלל?"`.
- **[דוגמה חדשה שנכתבה למדריך]:** `"שימו לב מה קורה כשמעבירים את הסינון אל פקודת WHERE. השארנו את כל חמשת הסטודנטים בטבלה השמאלית, ועדיין סטודנט אחד פשוט נעלם מהמסך."`
- **הוראת עריכה:** החליפו ניסוח סביל ומרוחק (`"ניתן להבחין כי"`) בפנייה פעילה (`"שימו לב"`, `"בדקו"`). אל תמציאו אנקדוטות בגוף ראשון כדי "ליצור חיבור" (`ch17-editing-note-2026-11-02-gpt-sql-career.md`).

### 2.3 בחירת פעלים
- **המנגנון:** נים מערבב לעיתים עברית תקנית או עיתונאית עם מילה יומיומית מדויקת (`W052`: `"כיאה לבחורה שאוכלת עיתונאים כמו פיסטוקים קלויים"`), אך בכתיבה על מערכות ונתונים הוא נצמד לפעלים פיזיים וברורים: `שומר`, `מחבר`, `מסנן`, `זורק`, `שולף`, `חוסם`. אין מילים שיווקיות כמו `ממנף`, `מעצים`, `מייצר תובנות משמעותיות`, ואין האנשה של AI (`"המודל מבין"`, `"המערכת יודעת"`).
- **ראיה מהמקור:** ב-`W158` הפעלים מעוגנים בפעולה ממשית (`"התגנבתי"`, `"עבד בחריצות"`, `"חטפתי על כך צרחות"`). ב-`ch15-2026-10-28.html` המודל `"מעריך"` ו`"מפיק פלט"`, ומסד הנתונים `"מכיל רשומות"` ו`"שולף אותן"`.
- **[דוגמה חדשה שנכתבה למדריך]:** `"מפתח זר חוסם הזנה של חשבונית שמצביעה על תור שאינו קיים בטבלת התורים."` (ולא: `"שלמות ייחוסית מעצימה את מסד הנתונים ומסייעת להבטיח מצוינות עסקית."`)
- **הוראת עריכה:** החליפו פעלים נפוחים (`למנף`, `להעצים`, `להדגים לעומק`) בפעלים תפעוליים (`לשלוף`, `לחבר`, `לבדוק`, `למנוע`). כשהטקסט מדבר על AI, החליפו `"יודע"` ב`"שולף"` או `"מנבא על בסיס ההקשר שנשלח אליו"`.

### 2.4 שימוש בשאלות
- **המנגנון:** שאלות אצל נים הן קצרות, חדות, ומניעות מעבר מתיאור להסבר או מבטאות ספק סביר של הקורא (`W158`: `"מה הם עשו במשך 14 שעות כפול 3?"`; `W001`: `"ולמה שלא יהיה?"`; `W092`: `"מה אפשר להפסיד?"`).
- **ראיה מהמקור:** `W163`: `"עד כאן טוב ויפה, אבל מה בעצם תשבי עושה בפועל?"`
- **[דוגמה חדשה שנכתבה למדריך]:** `"הרצנו את השאילתה וקיבלנו ארבע שורות במקום חמש. לאן נעלם דניאל קים?"`
- **הוראת עריכה:** השתמשו בשאלה קצרה אחת בנקודת מפנה של ההסבר, וענו עליה מיד במשפט הבא. אל תפתחו פסקה ברצף של שלוש שאלות רטוריות.

### 2.5 הכנסת אוצר מילים טכני
- **המנגנון:** קודם הדוגמה המוחשית והתפקיד במציאות, ורק אחר כך השם הטכני והסוגריים המבהירים. בהשראת הסוגריים המבארים של נים בעברית (`W062`: הערת ההסבר הקצרה על מכשיר הבלאקברי), מותר להכניס הבהרה של כמה מילים בסוגריים כדי למנוע עצירה מלאכותית בהגדרה נפרדת.
- **ראיה מהמקור:** `W062`: `"מהבלאקברי (טלפון נייד שמחבר אתכם באופן יעיל וחונק לתיבת המייל שלכם. יופי לכם שאתם לא יודעים)."`
- **[דוגמה חדשה שנכתבה למדריך]:** `"לפני שכותבים SQL, קובעים מה מייצגת שורה אחת בתוצאה (בעגה המקצועית זה נקרא הגרעין של השאילתה, או grain). במקרה שלנו, כל שורה מייצגת סטודנט אחד."`
- **הוראת עריכה:** אל תסבירו מונח חדש באמצעות שני מונחים חדשים שעדיין לא הוגדרו. הגדירו פעם אחת, תייגו ל-Terms Treasury, והמשיכו להשתמש באותו שם עקבי לאורך כל הפרק.

### 2.6 מעבר בין משפטים ארוכים למשפטים קצרים
- **המנגנון:** זהו קצב ההיכר של נים בעברית (כ־24% ממשפטי התיאור שלו בני 6 מילים או פחות, וכ־16% בני 25 מילים ויותר): משפט צובר אחד שמרכז פרטים ותנאים, ואחריו משפט שיפוט קצר של שתי מילים עד שמונה מילים שיושב **בסוף הפסקה**.
- **ראיה מהמקור:** ב-`W058`: `"וכמובן, כל סט צילום שכזה נגמר בסקס סוער. שוקינג."` ב-`W062` פסקה שלמה על סצנת הישראלים בניו יורק מסתיימת במשפט אחד קצר: `"ובכל זאת, זה לא באמת זה."`
- **[דוגמה חדשה שנכתבה למדריך]:** `"השאילתה מחברת שלוש טבלאות, מחשבת ממוצע בשתי ספרות אחרי הנקודה וממיינת לפי שם משפחה בלי להציג אף הודעת שגיאה. אם תנאי ה-WHERE העלים בדרך סטודנט בלי רשומת נוכחות, התוצאה עדיין שגויה."`
- **הוראת עריכה:** כשכל המשפטים בפסקה באורך אחיד ומייגע, אחדו שני פרטים קשורים למשפט צובר אחד, וקצצו את השורה המסכמת למשפט קצר, חד וברור בסוף אותה פסקה (לא כשורה מנותקת לשם אפקט דרמטי).

### 2.7 איפה חום, הומור יבש או תצפית אישית מרוויחים את מקומם (ואיפה הם נעצרים)
- **המנגנון:** ההומור אצל נים יבש ונובע מן האבסורד של הסיטואציה או מהסתירה בין היומרה למציאות (`W176`, `W184`). כשהוא מספר על עצמו, הוא בדרך כלל בצד הלא מושלם (`W079`: נשרף בים יום אחרי הנחיתה; `W114`: `"מתחזק תדמית של פדלאה רצינית"`). בספר לימוד ההומור צמוד ישירות להתנהגות של הנתונים, ונעצר לחלוטין כשמדובר במצוקת סטודנטים, בפרטיות, באתיקה, בשחזור תקלות או בשאלות הערכה.
- **ראיה מהמקור:** ב-`W087` (התאבדות בשידור חי) ו-`W003` (המאבק בסרטן של ג'וליה לואי דרייפוס) הטון מתיישר מיד ונשאר ישיר ונטול ציניות.
- **[דוגמה חדשה שנכתבה למדריך]:** `"מסד הנתונים מדלג בשמחה על תא ריק בעת חישוב ממוצע בלי להתלונן. הוא לא שואל אם הסטודנט לא הגיש את העבודה, או שאתם פשוט עוד לא הספקתם לבדוק אותה."`
- **הוראת עריכה:** השאירו לכל היותר חיוך יבש אחד בנושא ליבה, ודאגו שיעזור להבין הבדל טכני. מחקו בדיחות משאלות מבחן (RAT), מהנחיות הגשה של מעבדה ומאזהרות בטיחות.

---

## 3. החלטת עריכה 2: איך להפוך רעיון מורכב למובן?

המעבר מרעיון אינטואיטיבי למושג טכני מתבצע בארבעה צעדים קבועים:
1. בעיה עסקית או ארגונית מוכרת;
2. הבחנה מבנית (מה מייצגת שורה אחת בטבלה, ומה קיים לעומת מה שחסר);
3. השם הטכני המדויק;
4. המשמעות המעשית להחלטה אחראית.

### מה הסטודנט מסיק לבד ומה חייבים לפרט עבורו
- **אפשר להשאיר להבנת הסטודנט:** למה לא הוגן להוריד ציון בטעות, ולמה עסק לא רוצה לחייב לקוח פעמיים. אין צורך להטיף מוסר בפסקאות מיותרות.
- **חייבים לפרט צעד אחר צעד:** איך השאילתה מתנהגת מאחורי הקלעים. מתחילים מניחים ש-`NULL` הוא אפס או `"לא"`, ש-`INNER JOIN` שומר את כל התלמידים, וש-`WHERE` על הטבלה הימנית אינו משנה את סוג ה-`JOIN`.

### הדגמה א: *"אילו סטודנטים החסירו שיעור, ולאילו סטודנטים פשוט אין כלל רשומת נוכחות?"*

1. **הבלבול בשטח:** מרצה רוצה לדעת מי החסיר את שיעור 4. בגיליון רגיל, תא שכתוב בו `"לא הגיע"` ותא ריק נראים במבט ראשון אותו דבר.
2. **ההבדל המבני בטבלאות (`Grading Database`):** בטבלת `grading.ATTENDANCE`, שורה עם `Attended = false` היא **עובדה מתועדת**: הנוכחות נבדקה בשיעור 4, והסטודנט נרשם כנעדר. לעומת זאת, אם הסטודנט רשום בטבלת `grading.STUDENT` (למשל `S1004`, דניאל קים) ואין לו **אף שורה מתאימה** בטבלת `grading.ATTENDANCE` עבור `ClassNum = 4`, המשמעות היא שאין תיעוד כלל. אולי הוא נרשם לקורס באיחור, אולי החליף קבוצת תרגול, ואולי שורה נשמטה בהקלדה.
3. **המנגנון הטכני:** `INNER JOIN` מחזיר רק סטודנטים שיש להם שורה בטבלת הנוכחות, ולכן מעלים את דניאל לחלוטין. `LEFT JOIN` מטבלת `grading.STUDENT` אל `grading.ATTENDANCE` (כאשר התנאי `a.ClassNum = 4` יושב בתוך פסוקית `ON` ולא בתוך `WHERE`) שומר על כל הסטודנטים ומציב `NULL` בעמודת `Attended` למי שאין לו רשומה.
4. **מה המרצה יכול להסיק באחריות:** על בסיס `Attended = false` (`S1002` בריאן לי, `S1005` אלנה רוסי) אפשר לספור חיסור ולשלוח מייל מעקב. על בסיס `Attended IS NULL` (`S1004` דניאל קים) **אסור** להכריז על חיסור; המסקנה המוצדקת היא רק שאין רשומה לשיעור 4, והפעולה הנדרשת היא לבדוק תאריך רישום או את דף הנוכחות המקורי.

### הדגמה ב: החלת אותה משמעת על מערכות AI ("ה-AI משתמש במסד הנתונים")

בדיוק כפי ש-`W184` אינו מקבל את האמירה הכללית *"הכל אמיתי"* בלי לבדוק מה צולם שוב באולפן, כך עורך לא מקבל את המשפט *"מערכת ה-AI משתמשת במסד הנתונים"* (פרק 15, `ch15-2026-10-28.html`). כשפסקה מתארת מערכת RAG או כלי חיבור (`MCP`) מול מסד נתונים, חובה להראות ארבע חוליות:
1. **איזו שאילתה או שליפה רצה בפועל:** האם נשלחה שאילתת `SELECT` לקריאה בלבד מ-`petvax.APPOINTMENT`, או חיפוש וקטורי (`pgvector`) בטבלת מקטעי מסמכים (`knowledge_chunk`).
2. **איזו ראיה הגיעה אל חלון ההקשר של המודל (context window):** אילו שורות, עמודות או פסקאות מדיניות הוזנו כקלט בזמן ההסקה (למשל השורה של שירות `506`, `Blood Panel`, שבה `DefaultCharge = 85.0` אך `Description` היא `NULL`).
3. **מה נשאר מחוץ למודל:** שורות שלא דורגו מספיק גבוה בשליפה הסמנטית, עמודות חסומות בהרשאות, ערכים ריקים (`NULL`), או שיחות טלפון שבעל החיה קיים עם הקבלה ולא תועדו בטבלה.
4. **מה התשובה רשאית לטעון ביושר:** המודל רשאי לדווח שמחיר ברירת המחדל הוא 85 דולר ולציין שתיאור השירות חסר (`NULL`), אך אינו רשאי להמציא שהבדיקה כוללת פענוח תוך 24 שעות אם המידע הזה לא נשלף ממסמך עדכני בהקשר.

---

## 4. החלטת עריכה 3: מה הופך דוגמה פתורה לשייכת לספר הזה?

הספר מפריד בקפדנות בין שתי מערכות: `Grading Database` מלווה את הדוגמאות המודרכות ב-`Core Concepts` וב-`Let's Build`, ואילו `PetVax` שמור להעברה עצמאית ב-`Chapter Labs`. אסור לערבב ביניהן.

### דוגמה פתורה מלאה ומאומתת (PostgreSQL / Supabase)

**השאלה העסקית:** בשיעור הרביעי ב־11 בספטמבר 2026 (`ClassNum = 4`, `"Keys and relationships"`), אילו סטודנטים נרשמו כנעדרים, ולאילו סטודנטים אין כלל רשומת נוכחות?

**טבלאות קלט בדיוניות** *(חלק מוקטן לצורכי הוראה על בסיס סכמת `ch10-grading-starter-2026-10-17.sql`, שבו השמטנו במכוון את שורת הנוכחות של דניאל קים בשיעור 4 כדי להדגים חוסר רשומה)*:

- **`grading.STUDENT`** (גרעין: שורה אחת לכל סטודנט רשום. מפתח ראשי: `StudentID`.): 5 סטודנטים: `S1001` Alice Johnson, `S1002` Brian Lee, `S1003` Carla Mendez, `S1004` Daniel Kim, `S1005` Elena Rossi.
- **`grading.SCHEDULE`** (גרעין: שורה אחת לכל מפגש שיעור. מפתח ראשי: `ClassNum`.): השורה הרלוונטית: `ClassNum = 4`, `Week = 2`, `ClassDate = 2026-09-11`, `Topic = 'Keys and relationships'`, `Format = 'In person'`.
- **`grading.ATTENDANCE`** (גרעין: שורה אחת לכל רישום נוכחות של סטודנט במפגש. מפתח ראשי: `AttendanceID`; מפתח ייחודי: `(StudentID, ClassNum)`; מפתחות זרים: `StudentID -> STUDENT`, `ClassNum -> SCHEDULE`.): 4 שורות לשיעור 4: `(13, 'S1001', 4, true)`, `(14, 'S1002', 4, false)`, `(15, 'S1003', 4, true)`, `(16, 'S1005', 4, false)`.

**שאילתת PostgreSQL מדויקת (גרסה 1, תנאי בתוך `ON`):**

```sql
SELECT s.StudentID,
       s.FirstName,
       s.LastName,
       a.ClassNum,
       a.Attended,
       CASE
           WHEN a.Attended IS TRUE  THEN 'Present'
           WHEN a.Attended IS FALSE THEN 'Recorded absent'
           ELSE 'No attendance record'
       END AS AttendanceStatus
FROM grading.STUDENT AS s
LEFT JOIN grading.ATTENDANCE AS a
  ON s.StudentID = a.StudentID
 AND a.ClassNum = 4
ORDER BY s.StudentID;
```

**פלט מדויק (5 שורות):**

| studentid | firstname | lastname | classnum | attended | attendancestatus |
| --- | --- | --- | --- | --- | --- |
| S1001 | Alice | Johnson | 4 | true | Present |
| S1002 | Brian | Lee | 4 | false | Recorded absent |
| S1003 | Carla | Mendez | 4 | true | Present |
| S1004 | Daniel | Kim | (NULL) | (NULL) | No attendance record |
| S1005 | Elena | Rossi | 4 | false | Recorded absent |

**פרשנות בשפה יומיומית:** חמשת הסטודנטים מופיעים בפלט מפני שטבלת `grading.STUDENT` נמצאת משמאל ל-`LEFT JOIN` והתנאי `a.ClassNum = 4` מופיע בתוך `ON`. בריאן לי (`S1002`) ואלנה רוסי (`S1005`) מסומנים במפורש כנעדרים (`false`). אצל דניאל קים (`S1004`) מופיע `(NULL)` כי לא קיימת עבורו שורה בשיעור 4. המרצה ישלח הודעת מעקב לבריאן ולאלנה, וייגש לבדוק את תאריך הרישום או את דף הנוכחות של דניאל לפני שיקבע שהחסיר.

**שינוי תנאי אחד והשפעתו:** אם מעבירים את `a.ClassNum = 4` מתוך `ON` אל `WHERE a.ClassNum = 4`, מתקבלות **4 שורות בלבד** (`S1001`, `S1002`, `S1003`, `S1005`). דניאל קים (`S1004`) נמחק מהתוצאה מפני שפסוקית `WHERE` פועלת אחרי הצירוף: בשורה הריקה שלו הערך של `a.ClassNum` הוא `NULL`, ההשוואה `NULL = 4` אינה אמת, והסינון הפך את ה-`LEFT JOIN` בפועל ל-`INNER JOIN` שקט שמסתיר דווקא את המקרה שרצינו לאתר.

### קריאות בדפוס, שימושיות בקורא הדיגיטלי ומה מותר לעורך לקצר
- **קריאות:** טבלאות פלט של עד 6 עמודות, כינויי עמודות קצרים, הצגת `(NULL)` מפורשת במקום תא ריק, ו-`ORDER BY` קבוע כדי שתלמידים בקורא הדיגיטלי ובדפוס יקבלו אותו סדר שורות בדיוק.
- **מותר לקצר:** משפט הרקע הסיפורי (עד 2–3 משפטים), עמודות לא רלוונטיות כמו `Email`, ושורות של שיעורים קודמים בטבלת התצוגה (כל עוד מצוין שזהו חתך חלקי).
- **אסור לקצר לעולם:** הגדרת הגרעין (מה שורה אחת מייצגת), מפתחות ראשיים וזרים, קידומת הסכמה (`grading.`), סדר המיון (`ORDER BY`), מספר השורות המדויק, השורה המכילה `NULL` (`S1004`), והסבר ההבדל המעשי בין `false` לחוסר רשומה.

---

## 5. החלטת עריכה 4: איך הקול משתנה בין חלקי הפרק?

בכתיבה לספר יש לכבד את חוקי המבנה של Edition 2 (`chapter-structure.md`, `writing-rules.md`): שמונה החלקים הקבועים של הפרק, סנכרון דו-כיווני עם `Terms Treasury`, הודעות Brightspace, סגנון AP למספרים ותאריכים, ואיסור מוחלט על מקפים ארוכים (em dashes), אימוג'ים, או הפניות למספרי סעיפים (`"סעיף 10.4"`). בתוך המסגרת הזו, הטון משתנה לפי תפקיד הסעיף.

### השוואת משפט דגם אחד בשישה חלקים של הפרק (הרעיון: הפרדת ערך שלילי מתועד מחוסר רשומה ב-`LEFT JOIN`)

| חלק בפרק | שינוי בקול ובמשלב | משפט דגם בפועל (טקסט לימודי חדש, ללא מקף ארוך) |
| --- | --- | --- |
| **1. פתיחת פרק** (`Introduction`) | מזמין, מתחיל מבעיה אנושית ברורה, ללא תחביר SQL. | `"לפני שסומכים על דוח חריגים, צריך לדעת להפריד בין בעיה שתועדה במפורש לבין רשומה שפשוט חסרה בטבלה."` |
| **2. מושגי ליבה** (`Core Concepts`, `Grading Database`) | אנליטי, שלב אחר שלב, מחבר גרעין ותחביר לתוצאה. | `"בצירוף מסוג LEFT JOIN, הצבת סינון של הטבלה הימנית בתוך WHERE מוחקת את שורות ה-NULL החסרות ומסתירה בשקט את הסטודנטים שאין להם רשומת נוכחות כלל."` |
| **3. כיתוב איור** (`Figure Caption`) | תמציתי, מתאר מה ההשוואה החזותית מוכיחה על שמירת שורות. | `"איור 10.7. סינון הטבלה הימנית בתוך ON שומר את דניאל קים עם ערך NULL בנוכחות, בעוד סינון בתוך WHERE מעלים את השורה שלו."` |
| **4. צעד מודרך** (`Let's Build`, `Grading Database`) | ציווי ישיר, שמות עצמים מדויקים, בדיקה עצמית מפורשת לסטודנט. | `"הריצו את שאילתת ה-LEFT JOIN על grading.STUDENT ו-grading.ATTENDANCE, וודאו שהפלט מחזיר חמש שורות ושומר על S1004 (דניאל קים) עם ערך NULL בעמודת Attended."` |
| **5. מעבדה עצמאית** (`Chapter Lab`, `PetVax`) | בקשה עסקית תמציתית; נותן את שם הטבלאות והכלל, ומשאיר לסטודנט את בחירת ה-JOIN ואת הבדיקה (בלי לחשוף מספר תשובה מדורג). | `"כתבו שאילתת PostgreSQL שמציגה את כל התורים שהושלמו בטבלת petvax.APPOINTMENT שאין להם שורה תואמת בטבלת petvax.INVOICE, והסבירו במשפט אחד מדוע INNER JOIN היה מחמיץ את פער החיוב."` |
| **6. נקודה מרכזית** (`Key Takeaways`) | סיכום חד שמחבר מנגנון טכני לאחריות אנושית; ללא מונחים חדשים וללא סיסמאות. | `"פקודת LEFT JOIN שומרת על האוכלוסייה שממנה התחלתם, כך שרשומות חסרות נשארות גלויות לבדיקה אנושית במקום להיעלם בדממה."` |

---

## 6. החלטת עריכה 5: מה עורך חייב לתקן מיד עם הקריאה?

### זוג 1: פתיחה גנרית
- **לפני (טיוטה ראשונית טיפוסית):**
  > בנוף העסקי הדינמי ומונע הנתונים של ימינו, מסדי נתונים יחסיים ממלאים תפקיד חיוני בהעצמת ארגונים למינוף תובנות משמעותיות. יתרה מכך, הבנת הקשרים בין טבלאות היא אבן יסוד הכרחית עבור כל מנהל עתידי.
- **אחרי (בקול של נים):**
  > חנות יכולה לתעד עשרת אלפים מכירות בגיליון אלקטרוני, ועדיין לא לדעת איזה ספק גרם לעיכוב במשלוח. גיליונות אלקטרוניים מצוינים לאחסון רשימה אחת, אבל שאלות עסקיות חוצות בדרך כלל בין כמה רשימות. מסד נתונים יחסי מחבר את הרשימות האלה באמצעות מפתחות משותפים, כדי שתוכלו לעקוב אחרי תשובה עד להזמנה, ללקוח ולספק המדויק.
- **השינוי המדויק:** נמחקו מילות מפתח חלולות (`"נוף עסקי"`, `"תפקיד חיוני"`, `"העצמת"`, `"מינוף תובנות"`, `"יתרה מכך"`, `"אבן יסוד"`), ובמקומן הוצגה תקלת תפעול מוחשית ופעלים ישירים.
- **מה הסטודנט מבין או עושה כעת:** הסטודנט מבין תוך שתי שניות איזו בעיה מסד נתונים פותר שגיליון רגיל אינו פותר.

### זוג 2: הגדרה שמניחה יותר מדי ידע מוקדם
- **לפני:**
  > מפתח זר אוכף שלמות ייחוסית בסכמות יחסיות מנורמלות באמצעות הגבלת ערכי תכונות של רשומות כך שיתאימו למפתחות מועמדים קיימים בטבלאות אב מקושרות.
- **אחרי:**
  > דמיינו שמישהו מקליד את מזהה הסטודנט `S9999` בטבלת `grading.STUDENT_GRADE`, למרות שאין שום סטודנט כזה בטבלת `grading.STUDENT`. בלי כלל שיחסום את ההזנה, הציון הזה שייך לשום אדם. **מפתח זר** (foreign key) הוא עמודה (או קבוצת עמודות) בטבלה אחת, שהערכים בה חייבים להתאים למפתח ראשי קיים בטבלה אחרת, או להישאר ריקים אם הכלל מתיר זאת. הכלל הזה עוצר רשומות יתומות עוד לפני שהן משבשות את הדוחות.
- **השינוי המדויק:** הדוגמה המוחשית (`S9999` בטבלת הציונים) עברה לתחילת ההגדרה, והז'רגון המופשט הוחלף בטבלאות מוכרות ובתוצאה עסקית מובנת.
- **מה הסטודנט מבין או עושה כעת:** הסטודנט מדמיין מיד את השורה השגויה שהמפתח הזר מונע ויודע איך לזהות קישור כזה בסכמה.

### זוג 3: צעד מעשי עם תוצאה עמומה
- **לפני:**
  > **שלב 4:** כעת חברו בין טבלת הסטודנטים לטבלת הנוכחות עבור שיעור 4 ובדקו את הפלט כדי לוודא שהכל נראה תקין.
- **אחרי:**
  > **שלב 4: איתור סטודנטים עם ובלי רשומת נוכחות בשיעור 4.** בעורך ה-SQL של Supabase, כתבו שאילתת `SELECT` שמתחילה מ-`grading.STUDENT` (`s`) ומבצעת `LEFT JOIN` אל `grading.ATTENDANCE` (`a`) עם התנאי `ON s.StudentID = a.StudentID AND a.ClassNum = 4`. הריצו פעם אחת. **בדיקה עצמית:** ודאו שהתקבלו בדיוק חמש שורות (`S1001` עד `S1005`), ושבשורה של `S1004` (דניאל קים) מופיע `(NULL)` בעמודות `ClassNum` ו-`Attended`. מאחר שזו שאילתת קריאה בלבד, הרצה חוזרת אינה משנה נתונים.
- **השינוי המדויק:** הוחלפו ניסוחים מעורפלים (`"חברו"`, `"נראה תקין"`) בשמות טבלאות מדויקים, מיקום התנאי בתוך `ON`, מספר שורות צפוי לבדיקה (`5`), וציון הערך הצפוי של `S1004`.
- **מה הסטודנט מבין או עושה כעת:** הסטודנט יודע בדיוק איך לאמת שהצעד הצליח ומגלה מיד אם סינון שגוי העלים את `S1004`.

### זוג 4: טענת עסקים או AI שחורגת מהראיות
- **לפני:**
  > מאחר שהעוזר החכם של PetVax מחובר למסד הנתונים של המרפאה, הוא יודע מדוע בעלי חיות מבטלים תורים וקובע אוטומטית את אסטרטגיית שימור הלקוחות הטובה ביותר.
- **אחרי:**
  > כשמנהלת המרפאה שואלת את עוזר ה-AI על ביטולי תורים, החיבור מריץ שאילתת קריאה על טבלת `petvax.APPOINTMENT` ומעביר אל חלון ההקשר של המודל את השורות המתאימות (כולל `AppointmentDate`, `Status` ושדה הטקסט הקצר `Reason`). המודל יכול לסכם את מה שנרשם בשדה `Reason`, אך הוא אינו רואה שיחות טלפון או הערות דלפק שצוות המרפאה לא הקליד, ואינו שוקל בעצמו עלויות תפעול. האחראי במרפאה צריך לבדוק קודם את שורות ה-SQL ורק אז להחליט על צעד השימור.
- **השינוי המדויק:** הוסרו `"יודע"` ו`"קובע אוטומטית"`; תואר מנגנון השליפה האמיתי (`SELECT` על `petvax.APPOINTMENT`), פורט אילו שדות מגיעים לקלט ומה חסר במערכת, והאחריות להחלטה הוחזרה לאדם.
- **מה הסטודנט מבין או עושה כעת:** הסטודנט יודע להבחין בין סיכום טקסט משורות שנשלפו לבין המלצה ניהולית שלמודל אין ראיות לגבות אותה.

---

## 7. רשימת תיוג בעמוד אחד ופרומפט חוזר (עברית)

### רשימת תיוג מהירה לעריכה בעברית
- **פתיחה:** האם ההסבר נפתח בבעיה עסקית או בחיכוך מוחשי במקום סיסמה על "עולם הנתונים"?
- **פנייה לקורא:** האם `אתם` מכוון פעולה של הסטודנט, `אנחנו` מוביל חשיבה משותפת, ו`אני` מופיע רק לחוויה אמיתית שסיפק נים?
- **פעלים והימנעות מהאנשה:** האם הוחלפו מילות קישוט (`למנף`, `להעצים`, `יתרה מכך`) בפעלים מדויקים (`לשלוף`, `לחבר`, `לבדוק`)? האם אין פעלים שמייחסים ל-AI תודעה (`"יודע"`, `"רוצה"`)?
- **קצב משפטים:** האם הפסקאות נעות בין משפט צובר ברור לבין משפט שיפוט קצר בסוף הפסקה (לא קצב אחיד ומכני)?
- **מונחים:** האם כל מונח חדש מופיע רק אחרי הבעיה וההסבר הפשוט, ומסומן פעם אחת בלבד?
- **מינון הומור:** האם כל בדיחה צמודה לנתונים עצמם ונעלמת לחלוטין בנושאים רגישים, בשאלות הערכה ובשלבי תיקון תקלות?
- **דוגמאות פתורות:** האם `Grading Database` ו-`PetVax` מופרדים לחלוטין? האם צוינו השאלה, הגרעין, המפתחות, הפלט המדויק, השפעת שינוי תנאי אחד והפרשנות הפשוטה?
- **כללי ספר קשיחים:** אפס מקפים ארוכים (em dashes), אפס אימוג'ים, אפס הפניות למספרי סעיפים, שם הספר המלא או `Data book` / `Database book` (לעולם לא `"BITM330"`).

### פרומפט חוזר להעתקה (עברית)

```text
ערוך מחדש את הקטע הבא בקול הספר הלימודי של נמרוד דביר עבור Using Data to Drive Business Performance (מיועד לסטודנטים לתואר ראשון במנהל עסקים שלומדים מסדי נתונים לראשונה).

שמור על: כל המשמעות הטכנית, שמות הטבלאות והעמודות, תחביר ה-SQL והמונחים המאושרים.
יישם: פתיחה מתוך בעיה מוחשית לפני הצגת המונח הטכני; פעלים פשוטים ומדויקים (שומר, מחבר, שולף, בודק); פנייה בגוף שני לפעולת הסטודנט וגוף ראשון רבים לחשיבה משותפת (בלי להמציא סיפורים אישיים); שאלת מפנה קצרה אחת בנקודת הספק; ומעבר ממשפט צובר אחד למשפט סיום קצר וחד בתוך הפסקה.
בהסבר מורכב: הפרד במפורש בין ערך מתועד לחוסר רשומה (ובמערכות AI, הראה איזו שאילתה או מסמך נכנסו לקלט ומה נשאר בחוץ).
הסר: מילות מילוי ("בעולם מונע הנתונים של ימינו", "יתרה מכך", "תפקיד מכריע"), האנשה של AI ("המודל יודע"), הפניות למספרי סעיפים, אימוג'ים וכל מקף ארוך (em dash; נסח מחדש עם נקודה, פסיק, נקודתיים או סוגריים).

פרט בקצרה בסוף אילו שינויים מדויקים ביצעת ומה הסטודנט מבין או מסוגל לעשות כעת.
```

---

## Appendix: Source Verification & Corpus Coverage Table

### Hebrew Originals Verified and Cited (`data-source/writing/originals/`)

| ID | Folder | Publication | Date | Genre | Authorship & role in this guide |
| --- | --- | --- | --- | --- | --- |
| `W001` | `W001-jamie-foxx` | Ynet | 2005-08-17 | Interview | Solo Nim; question cadence and structural turns |
| `W002` | `W002-jim-carrey` | Ynet | 2006-01-18 | Interview | Solo Nim; proposition-then-undercut opening, inline gloss |
| `W003` | `W003-julia-louis-dreyfus` | Israel Hayom | 2019-03-28 | Interview | Solo Nim (`W090` duplicate consolidated); serious tone limit, scene detail |
| `W046` | `W046-julianne-moore` | Ynet | 2006-02-22 | Interview | Solo Nim; announced background turn |
| `W052` | `W052-jennifer-lopez` | Ynet | 2005-09-14 | Interview / feature | Solo Nim; register mixing, structural turn |
| `W058` | `W058-porn-movie` | Ynet | 2006-01-04 | Feature / interview | Solo Nim; short verdict sentence (`"שוקינג."` checked in corpus) |
| `W062` | `W062-holidays-homesickness` | Ynet | 2005-10-11 | Personal column | Solo Nim; inline parenthetical gloss, ending verdict |
| `W071` | `W071-lgbtq-television` | Ynet | 2009-06-10 | Opinion | Solo Nim; direct address, rhetorical pivot question |
| `W079` | `W079-returning-to-israel` | Ynet | 2006-05-24 | Editorial column | Solo Nim; self-directed foil, short verdict |
| `W087` | `W087-online-bystanders` | Ynet | 2008-11-26 | Opinion | Solo Nim; withdrawal of humor on tragic subject |
| `W089` | `W089-killing-eve` | Israel Hayom | 2019-04-11 | Interview | Solo Nim (`W096` duplicate consolidated); late measured register |
| `W092` | `W092-buddhism-new-york` | Xnet / Pnai Plus | 2011-12-13 | Personal column | Solo Nim; cliché-plus-verification opening, self-mockery |
| `W093` | `W093-silent-meditation-retreat` | Xnet / Pnai Plus | 2012-02-12 | Personal column | Solo Nim; restrained sincere register |
| `W097` | `W097-karim-rashid` | At | 2017-04-20 | Magazine interview | Solo Nim; scene observation and design critique |
| `W107` | `W107-dog-shopping-new-york` | Xnet | 2012-03-11 | Personal column | Solo Nim; concrete price progression |
| `W114` | `W114-haruki-murakami-running` | nrg Ma'ariv | 2010-08-26 | Book review | Solo Nim; self-deprecating positioning |
| `W158` | `W158-homeland-set-visit` | Pnai Plus / Xnet | 2012-10-04 | Set-visit feature | Solo Nim; crew counts, drawer inspection, pivot question |
| `W159` | `W159-anni-frid-lyngstad` | nrg | 2010-11-14 | Researched profile | Solo Nim; restrained chronology without jokes |
| `W163` | `W163-noa-tishby` | Ynet | 2009-08-12 | Interview | Solo Nim; pivot from buildup to operational mechanics |
| `W176` | `W176-seth-rogen-zac-efron` | Ynet | 2014-05-15 | Double interview | Solo Nim; testing PR charm against observation |
| `W184` | `W184-new-york-drag-queens` | nrg Ma'ariv | 2010-06-28 | Behind-the-scenes feature | Solo Nim; direct factual challenge (`"לא בדיוק. במו עיניי ראיתי"`) |

### Excluded IDs (Never Quoted or Counted in Voice Rules)
- `W016` (Yuval Ganor), `W083` (Amir Bogen), `W094` (not Nim's writing per author confirmation), `W095` (Dan Margalit), `W197` (nrg Maariv), `W198` (nrg Maariv); plus `W100` (Boaz Dvir, source-only record). Coauthored `W106` (with Dana Darbinsky) was treated as weak evidence and not quoted.

### Textbook References Consulted (`G:\My Drive\0-Projects\!-important\data-book\`)
- `AGENTS.md` (book naming, no-emoji rule, no-section-number rule, `Grading Database` / `PetVax` separation)
- `.agents/reference/writing-rules.md` (voice, reading level, AP baseline, AI-pattern fixes, zero em dashes)
- `.agents/reference/chapter-structure.md` (eight-section chapter architecture and Terms Treasury sync)
- `.agents/skills/chapter-editor/references/human-voice-model-ch01-05.md` (September 2026 edit log precedents)
- `book-source-v0/files/ch10-grading-starter-2026-10-17.sql` and `ch10-petvax-starter-2026-10-17.sql` (confirmed PostgreSQL schemas)
- Active chapters read directly: `ch01-2026-10-10-3.html`, `ch10-2026-10-26.html`, `ch15-2026-10-28.html`, `ch17-2026-11-08.html`, plus `ch17-editing-note-2026-11-02-gpt-sql-career.md`.
