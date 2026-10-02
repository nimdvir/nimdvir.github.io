# Add a post, news update, or publication

Choose a template, copy it to the appropriate content folder, and edit the copy.
You do not need to change any layout, HTML, CSS, or JavaScript.

| Template | Copy to | Result |
| --- | --- | --- |
| [blog-post.md](blog-post.md) | `src/content/blog/your-post-slug.md` | Full article at `/blog/your-post-slug/`, plus a listing and homepage entry |
| [news-short.md](news-short.md) | `src/content/news/your-news-slug.md` | Brief dated announcement on the homepage and news archive; optional linked title |
| [publication.md](publication.md) | `src/content/publications/your-paper-slug.md` | A paper page with its original abstract, citation, source links, and Scholar metadata |
| [news-long.md](news-long.md) | `src/content/news/your-news-slug.md` | Full announcement at `/news/your-news-slug/`, plus a listing and homepage entry |

## Six steps

1. Start a feature branch from the latest `main`. Copy a template, preserving the original for next time.
2. Name the copy with a short lowercase filename using hyphens, such as `teaching-with-ai.md`. That filename becomes the URL, so avoid renaming it after publication.
3. Replace the title and summary. Set the date in quotation marks as `"2026-10-01"`, using the date you want displayed. Keep `draft: true` while writing.
4. Write the body using ordinary Markdown. For short news, put the complete update in `summary`; its body is not displayed. The title and summary are displayed automatically for full articles, so do not repeat them in the body.
5. When ready, remove template instructions/placeholders and change `draft: true` to `draft: false`. Build and review with the commands below, then commit and push your feature branch.
6. Review the pull request and merge to `main` to publish. GitHub Pages builds the site. Confirm the live post, news archive, and homepage afterwards.

```bash
npm ci
npm run build
python scripts/verify_site.py
npm run preview
```

## Visibility and dates

- Blog and news default to drafts when `draft` is omitted. Draft entries do not appear in the generated website, its homepage, related posts, or sitemap.
- The repository is public. A committed draft can still be read on GitHub. Keep private working drafts outside the repository.
- Future-dated entries remain hidden using the calendar date in New York at build time. This is not automatic scheduled publishing: the site must be rebuilt on or after that date. Until then, the deployed version will not change on its own.
- Dates for published entries must be real calendar dates in `YYYY-MM-DD` form. An invalid date stops the build with a clear message.
- Homepage sections show the three most recent published items of each type. The Blog page lists all posts newest first; News groups updates by year.
- Four earlier essays contain unverified firsthand claims. They remain unpublished. Do not flip their draft status without reviewing their content, date, and images. Their old URLs currently redirect to `/blog/`.

## Fields you can use

| Field | Blog | News | How to use it |
| --- | --- | --- | --- |
| `title` | Required | Required | Short, specific headline |
| `date` | Required | Required | Quoted `YYYY-MM-DD` |
| `summary` | Required | Required | A short description; one paragraph, plain text |
| `draft` | Yes | Yes | Set explicitly to `false` when ready |
| `category` | Optional | No | For example, Research, Teaching, UX, or AI |
| `tags` | Optional | No | A list such as `["AI", "Teaching"]` |
| `image` | Optional | No | Full image URL or `/images/blog/filename.jpg`; do not use CSS `url(...)` |
| `imageAlt` | Required with image | No | Descriptive alternative text |
| `imageCaption` | Optional | No | Caption and credit |
| `inline` | No | Yes | `true` for a short announcement, `false` for a separate page |
| `link` | No | Optional | HTTP(S) URL or root-relative path such as `/research/`; links the short-news title or adds a related link on a full announcement |

Upload blog images under `public/images/blog/` and refer to them as `/images/blog/filename.jpg`, or use an existing hosted image URL. Do not add an image field until the image exists. Standard Markdown images can also appear in article bodies with meaningful alt text.

## Markdown basics

```markdown
## Section heading

Normal paragraph with **bold text** and *emphasis*.

- First point
- Second point

[Descriptive link text](https://example.org/)

![Describe what the image shows](/images/blog/your-image.jpg)

> A short attributed quotation.
```

The site supplies the author name, formatted date, reading-time estimate, shared navigation, theme controls, and related posts. There is no need to copy those into the body.

## Ask an agent to help

> Create a new [blog post / short news update / full news announcement] using the corresponding file in `templates/`. Save it in the correct content folder with the filename [slug]. Use only the content and confirmed facts I provide. Set the date to [YYYY-MM-DD] and keep `draft: true` until I ask you to publish. Preserve my voice, add source links and image credits where supplied, and flag missing information. When I approve it, change the draft flag, build, verify the links and both themes, and use the repository's branch and pull-request workflow.

## Writing

Use specific titles and facts. Write in your own voice, with contractions and the occasional aside. Avoid slogans, self-promotion, obligatory takeaways, and em dashes. The prompts in the templates are suggestions, not mandatory article headings.

Internal links stay in the current tab. Links to other websites open in a new tab.

## Publication records

Use [publication.md](publication.md) for a paper, preprint, or dissertation. This
has a different workflow from a blog post:

1. Verify the exact title, author order, date, venue, and DOI against the source.
2. Supply the complete author-written abstract and its source URL. Do not replace
   it with an AI summary. The short `summary` field is only a page description.
3. Add optional journal, volume, issue, pages, or dissertation institution fields
   as applicable. Preprints use the date of the cited preprint, not an expected
   journal publication date. `manuscriptStatus` keeps a dated review status separate.
4. Set `workingPaper: true` to list the record under Working papers. Otherwise it
   appears under Publications and dissertation.
5. Set `pageReady: true` and `draft: false` after review. `draft: true` hides the
   record from all generated pages. `pageReady: false` preserves an existing
   bibliography entry without generating an unverified abstract page.
6. If redistribution is permitted, copy the unchanged PDF under
   `public/publications/your-paper-slug/paper.pdf`, and record `pdf`, `pdfSource`,
   `license`, and `licenseUrl`. The build checks its location. External full text
   can instead be linked using `pdfSource`; it does not receive `citation_pdf_url`.

Do not rename a paper page once published. Add new papers by copying the template,
not by replacing an existing research project page. Research project pages describe
the broader work; publication pages identify a particular scholarly document.

## RSS

`/rss.xml` includes the same published blog and news entries as the website,
newest first. Drafts and future-dated entries are excluded at build time. Short
news items have stable anchors in `/news/`, so feed readers can open each update.
The feed is linked from Blog and News and advertised in the shared page head.
