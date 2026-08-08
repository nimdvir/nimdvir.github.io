---
name: get-images
description: 'Download, license-check, optimize, and place images for nimdvir.github.io. Use when adding interview photos, portraits, hero images, section art, project thumbnails, public/images assets, or Cloudinary-hosted galleries. Handles legal image sourcing, local-vs-Cloudinary decisions, WebP optimization, attribution notes, and wiring image or heroImage fields.'
argument-hint: 'Describe the page, subject, and whether the image should stay local or go to Cloudinary if known'
user-invocable: true
---

# Get Images

Use this skill when you need to download, verify, optimize, and place images for nimdvir.github.io.

## When to Use

- Add interview portraits, hero images, project thumbnails, section art, or gallery images.
- Replace temporary or broken image URLs with site-owned assets.
- Decide whether a new image should live in `public/images/...` or on Cloudinary.
- Prepare attribution for Creative Commons, editorial, or user-provided licensed images.

## Guardrails

- Only use images that are owned, licensed, public domain, or explicitly reusable for the intended site use.
- For celebrity or editorial images, do not download from random media sites unless reuse rights are verified.
- Prefer Wikimedia Commons, official press kits, first-party uploads, or licensed files the user provides.
- Keep originals outside the repo when practical; commit only the site-ready derivatives.
- Never print or commit `CLOUDINARY_URL` or other secrets.

## Repo Workflow

Load [repo workflow](./references/repo-workflow.md) before editing paths or running uploads.

## Procedure

1. Identify the rendering surface.
   - Find the page, content entry, or component that consumes the image.
   - Check whether it expects `image`, `heroImage`, an inline `<img>`, or a Cloudinary URL.
   - Match neighboring aspect ratio, crop, and naming patterns before creating files.
2. Decide local vs Cloudinary.
   - Use local assets for single essential images, identity assets, section heroes, and other small stable image sets.
   - Use Cloudinary for galleries, interview or media sets, archive imagery, or larger image families.
3. Verify licensing before download.
   - Capture the source page, direct file URL when available, author, and license.
   - If the image is Creative Commons licensed, plan the attribution note before publishing.
4. Optimize.
   - Prefer WebP for repo-served assets unless a nearby convention requires another format.
   - Use lowercase, hyphenated names under `public/images/<section>/<slug>/`.
   - Create at least one card or portrait asset and one hero asset when the content model supports both.
5. Place and wire.
   - For local assets, copy the optimized files into `public/images/...` and update content with root-relative paths such as `/images/interviews/jennifer-lopez/portrait.webp`.
   - For Cloudinary delivery, use the existing repo upload workflow and transformed URLs.
   - For interviews, set `image` for the list or card portrait and `heroImage` for the article hero when both exist.
6. Validate.
   - Run the narrowest relevant check.
   - Prefer `npm run build` after wiring image paths.
   - Confirm that the page resolves without broken image links.
7. Report.
   - Return the final asset paths, source or license summary, delivery mode, and any remaining attribution or publicity-rights caveats.

## Existing Commands

```sh
npm run optimize:images
npm run cloudinary:upload
```

VS Code tasks:

- `Optimize images`
- `Upload all images to Cloudinary`
- `Upload current image to Cloudinary`