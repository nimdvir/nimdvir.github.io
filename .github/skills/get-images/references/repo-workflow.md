# Repo Image Workflow

## Delivery Decision

- Keep the image local if it is part of the site's identity, layout, section structure, or a small stable set of essential images.
- Use Cloudinary if the image belongs to a gallery, archive, interview or media set, or a larger image family that benefits from remote transformations.

## Local Asset Rules

- Stable repo-served assets belong under `public/images/...`.
- Use root-relative references in content and pages, for example `/images/interviews/jennifer-lopez/portrait.webp`.
- The content schema supports both `image` and `heroImage`.
- Interview pages now prefer `heroImage` when present and fall back to `image`.
- Keep local filenames lowercase and hyphenated.

## Optimization Notes

- The existing `npm run optimize:images` command only processes files under the repo-level `images/` directory.
- Do not assume that command will optimize files already copied into `public/images/`.
- For one-off local assets, optimize the files before copying them into `public/images/...`.

## Cloudinary Workflow

- `npm run cloudinary:upload` runs `scripts/cloudinary-upload.mjs`.
- The upload script walks the repo-level `images/` directory, not `public/images/`.
- The script updates `.cloudinary-upload-cache.json` and `src/data/cloudinary-images.json`.
- Use transformed Cloudinary delivery URLs where appropriate, especially `f_auto`, `q_auto`, width-specific delivery, and crop or fill behavior for cards.

## Validation

- After wiring image paths, run `npm run build`.
- If the asset is only being staged for future content, confirm the files exist in `public/images/...` and leave a short attribution note if the license requires one.

## Sourcing and Attribution

- Favor Wikimedia Commons, official press kits, first-party images, or user-provided licensed files.
- Record source page, author, direct file URL when available, and license.
- Creative Commons reuse still may carry attribution or publicity-rights constraints depending on context and jurisdiction.