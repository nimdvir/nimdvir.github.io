"""Check data-source/writing/articles.csv for mistakes, and print the translation queue.

Usage:
  python scripts/writing/check_inventory.py           check only
  python scripts/writing/check_inventory.py --queue   check, then list Translate? = Yes rows by Priority

Exits with status 1 when a check fails.
"""
import argparse
import csv
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_inventory import COLUMNS, OUTPUT, ROOT, STATUSES, TYPES, TRANSLATION_VALUES, article_key  # noqa: E402

PATH_COLUMNS = ["Original HTML Path", "Hebrew Markdown Path", "Translation Path", "Page Path"]
DATE = re.compile(r"^\d{4}(-\d{2}(-\d{2})?)?$")


def check(rows, header):
    errors = []
    if header != COLUMNS:
        errors.append(f"columns differ from the expected order: {header}")
    seen_ids, seen_keys = {}, {}
    for line, row in enumerate(rows, start=2):
        where = f"line {line} ({row.get('ID') or 'no ID'})"
        if not re.fullmatch(r"W\d{3,}", row["ID"]):
            errors.append(f"{where}: ID must look like W001")
        elif row["ID"] in seen_ids:
            errors.append(f"{where}: ID repeats line {seen_ids[row['ID']]}")
        seen_ids.setdefault(row["ID"], line)
        if row["Original URL"]:
            key = article_key(row["Original URL"])
            if key in seen_keys:
                errors.append(f"{where}: same article URL as {seen_keys[key]}")
            seen_keys.setdefault(key, row["ID"])
        if row["Translate?"] not in ("Yes", "No"):
            errors.append(f"{where}: Translate? must be Yes or No, not '{row['Translate?']}'")
        if row["Translate?"] == "Yes" and not re.fullmatch(r"[1-9]\d*", row["Priority"]):
            errors.append(f"{where}: Translate? is Yes, so Priority must be a whole number (1, 2, 3...)")
        if row["Translate?"] == "No" and row["Priority"]:
            errors.append(f"{where}: Priority is set but Translate? is No")
        if row["Status"] not in STATUSES:
            errors.append(f"{where}: Status '{row['Status']}' is not one of: {', '.join(STATUSES)}")
        if row["Type"] not in TYPES:
            errors.append(f"{where}: Type '{row['Type']}' is not one of: {', '.join(TYPES)}")
        if row.get("Translation Value") not in TRANSLATION_VALUES:
            errors.append(f"{where}: Translation Value must be High, Medium, Low or Unrated")
        for column in ("Main Subject (English)", "Main Subject (Hebrew)", "Value Reason", "Review Flag"):
            if not row.get(column, "").strip():
                errors.append(f"{where}: {column} is required")
        duplicate = row.get("Duplicate Of", "")
        if duplicate and (duplicate == row["ID"] or duplicate not in {r["ID"] for r in rows}):
            errors.append(f"{where}: Duplicate Of must name another existing ID")
        if row["Type"] == "interview" and not row["Interviewee"]:
            errors.append(f"{where}: interview rows need an Interviewee (or 'unknown')")
        if row["Interviewee"] == "unknown" and row["Status"] not in ("needs checking", "not my writing"):
            errors.append(f"{where}: Interviewee is unknown, so Status should be 'needs checking'")
        if row["Date"] and not DATE.match(row["Date"]):
            errors.append(f"{where}: Date must be YYYY-MM-DD, YYYY-MM or YYYY")
        for column in PATH_COLUMNS:
            if row[column] and not (ROOT / row[column]).exists():
                errors.append(f"{where}: {column} points to a missing file: {row[column]}")
    return errors


def queue(rows):
    chosen = [r for r in rows if r["Translate?"] == "Yes"]
    chosen.sort(key=lambda r: (int(r["Priority"]) if r["Priority"].isdigit() else 10**9, int(r["ID"][1:])))
    if not chosen:
        print("Queue is empty: no row has Translate? = Yes.")
        return
    print(f"{'Priority':>8}  {'ID':<5} {'Status':<15} Subject | Title")
    for r in chosen:
        title = r["Title (Hebrew)"] or r["Title (English)"] or r["Original URL"]
        subject = r.get("Main Subject (English)") or r.get("Interviewee") or "Subject unreviewed"
        print(f"{r['Priority']:>8}  {r['ID']:<5} {r['Status']:<15} {subject} | {title}")


def main():
    parser = argparse.ArgumentParser(description="Check the article list and print the translation queue.")
    parser.add_argument("--queue", action="store_true", help="list Translate? = Yes rows, by Priority then ID")
    parser.add_argument("--capture-queue", action="store_true", help="show suggested Hebrew capture order; does not modify translation choices")
    args = parser.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    with open(OUTPUT, encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        header = reader.fieldnames
    errors = check(rows, header)
    for error in errors:
        print("error:", error)
    print(f"{len(rows)} rows checked, {len(errors)} problem(s).")
    if args.queue:
        print()
        queue(rows)
    if args.capture_queue:
        print()
        pending = [r for r in rows if not r.get("Hebrew Markdown Path")]
        tier = {"High": 0, "Medium": 1, "Low": 2, "Unrated": 3}
        pending.sort(key=lambda r: (0 if ("about Nim" in r.get("Value Reason", "") or r["ID"] in {"W083", "W197", "W198"}) else 1, tier.get(r.get("Translation Value"), 3), 0 if r["Type"] == "interview" else 1, int(r["ID"][1:])))
        print(f"{len(pending)} Hebrew packages to capture. Suggested top 25:")
        for row in pending[:25]:
            print(f"{row['ID']}  {row['Translation Value']:<7} {row['Type']:<10} {row['Main Subject (English)']}")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()

