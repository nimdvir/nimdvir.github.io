# The article list

File: `data-source/writing/articles.csv`. Column meanings and allowed values: `data-source/writing/README.md`.

## Reading it

- Open with UTF-8 (`encoding="utf-8-sig"` in Python). The first row is the header.
- One row per article. `ID` (W001...) is the permanent handle; refer to rows by ID.
- `Found In` says where a row came from; `reports/writing/inventory-audit.md` explains every source and what was left out.

## Finding the queue

```
python scripts/writing/check_inventory.py --queue
```

Prints rows with Translate? = Yes, sorted by Priority (1 first), then ID. Rows Nim has not chosen are not in the queue. Do not pick work outside the queue unless Nim asks.

## Updating a row

Edit only these columns, and only for the row you are working on:

| When | Set Status to | Also fill |
| --- | --- | --- |
| Original saved | `captured` | Original HTML Path |
| English translation reviewed | `translated` | Translation Path, Title (English) |
| Website page file created | `page created` | Page Path, Images |
| Page live on the site | `published` | |
| Source shows it is not Nim's piece | `not my writing` | a short reason in Notes |

- Paths are relative to the repository root, with forward slashes, and must point to files that exist.
- Never change ID, Translate?, Priority, or Nim's existing Notes. Append notes with `; `.
- Never move a row backwards or redo a finished step unless Nim asks.
- Keep the file UTF-8 with BOM and the column order unchanged. Write it with Python's `csv` module, not by hand-editing quotes.
- Afterwards run `python scripts/writing/check_inventory.py` and fix anything it reports.

## Adding articles

Do not add rows by hand. Run `python scripts/writing/build_inventory.py`; it appends new articles from the source spreadsheets and leaves existing rows alone.
