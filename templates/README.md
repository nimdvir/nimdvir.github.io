# Add a blog post or news update

Choose a template, copy it to the appropriate content folder, and edit the copy.
You do not need to change any layout, HTML, CSS, or JavaScript.

| Template | Copy to | Result |
| --- | --- | --- |
| [blog-post.md](blog-post.md) | `src/content/blog/your-post-slug.md` | Full article at `/blog/your-post-slug/`, plus a listing and homepage entry |
| [news-short.md](news-short.md) | `src/content/news/your-news-slug.md` | Brief dated announcement on the homepage and news archive; optional linked title |
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
