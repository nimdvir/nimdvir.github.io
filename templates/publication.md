---
title: "Exact published title"
year: "YYYY"
publicationDate: "YYYY"
authors: ["First Author", "Second Author"]
venue: "Journal, conference, university, or preprint repository"
type: "Journal article"
status: "Published"
summary: "One factual sentence about the paper."
url: "https://example.org/original-record"
abstractSource: "https://example.org/original-record"
abstract: |-
  Paste the complete original author-written abstract here, preserving its wording.
draft: true
pageReady: false
workingPaper: false
# Add the fields that appear in the original citation. Remove unused fields.
# doi: "10.xxxx/example"
# journal: "Full journal title"
# conference: "Full conference title"
# institution: "University name, for a dissertation"
# volume: "21"
# issue: "1"
# firstPage: "19"
# lastPage: "39"
# arxivId: "2305.09798"
# manuscriptStatus: "Under review at Journal Name, as of YYYY-MM-DD."
# External full text can be linked without mirroring it:
# pdfSource: "https://example.org/paper.pdf"
# A hosted PDF requires permission to redistribute it. Keep it next to its page:
# pdf: "/publications/your-paper-slug/paper.pdf"
# license: "CC BY 4.0"
# licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
---

This template's frontmatter supplies the entire publication page. Do not add a
second abstract or title in the Markdown body.

Copy this file to src/content/publications/your-paper-slug.md. Verify the exact
title, every author in order, publication date, venue, DOI, abstract, and links
against the original source. Use the date of the cited version, not the date you
add the page. Keep a preprint's status distinct from journal publication.

Set pageReady: true only after checking all of those details. Set draft: false
when it is ready for review. The page will appear at
/publications/your-paper-slug/ and be linked from Research.

For a local PDF, put the unchanged source file at
public/publications/your-paper-slug/paper.pdf. Record its source and reuse license.
The page emits citation_pdf_url only for an existing PDF in the same directory.
An external PDF link is shown to readers without using that Scholar tag.

Remove these instructions before committing the completed record.
