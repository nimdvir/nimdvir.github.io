---
name: interview-publish
description: "Validate and publish an interview markdown file from src/content/interviews. Use when: publishing a celebrity interview, checking interview frontmatter and formatting, migrating raw interview images into the canonical originals folder, optimizing interview images, or uploading interview images to Cloudinary."
---

# Interview Publish

This skill is a thin wrapper around the repo-owned interview workflow.

## Canonical Paths

- Interview markdown: `c:\Users\nd115232\Documents\GitHub\nimdvir.github.io\src\content\interviews\<slug>.md`
- Raw originals: `c:\Users\nd115232\Pictures\nimdvir.github.io-personalsite-images\portfolio\interviews\<slug>\`
- Publish working copies: `c:\Users\nd115232\Documents\GitHub\nimdvir.github.io\images\interviews\<slug>\`

## Workflow

1. Ask the user for the local markdown file path under `src/content/interviews/`.
2. Remind the user that raw originals should live in the canonical originals folder under `nimdvir.github.io-personalsite-images/portfolio/interviews/<slug>/`.
3. Run the validation command first:

```powershell
npm run interview:check -- <markdown-path>
```

4. If the user says the images are saved somewhere else, ask for the alternate folder or file path.
5. Migrate and publish with the repo command. Use `--source` for a folder or single alternate image source, or `--portrait` / `--hero` when the user wants to point to specific image files.

```powershell
npm run interview:publish -- <markdown-path> --source <alternate-path>
```

```powershell
npm run interview:publish -- <markdown-path> --portrait <portrait-path> --hero <hero-path>
```

6. Add `--move` if the user wants the originals moved into the canonical folder instead of copied.
7. Report back:
   - the validated markdown file path
   - the canonical originals folder
   - whether any migration happened
   - the optimized working folder under `images/interviews/<slug>/`
   - the Cloudinary URLs written into frontmatter
   - the final generated HTML path at `dist/interviews/<slug>/index.html`

## Notes

- Do not reimplement the workflow in chat. Always call the repo command.
- If `interview:check` fails, show the validation errors and stop before publish.
- If publish succeeds, mention that Astro generated the final HTML through `src/pages/interviews/[...slug].astro`.