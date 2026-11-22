# Cloudinary conventions for the website

Last updated November 22, 2026.

## Where website images live

- Folder (asset folder): `PersonalSite/Interviews`.
- Public ID (the name in the URL): `PersonalSite/Interviews/<article-id>-<slug>/<role>`, for example
  `PersonalSite/Interviews/W089-killing-eve/original-photo-2`.
- Display name: the same path with dashes, for example `W089-killing-eve-original-photo-2`.
- Tags: `website`, `interviews`, the article ID (`W089`) and the role.

| Role | Meaning |
| --- | --- |
| `lead-photo` | The image at the top of the article page. |
| `lead-original-photo` | Lead image that is also the photo the publisher ran. |
| `original-photo-N` | A photo that ran with the article; N is its position among the article's source images. |
| `print-page-N`, `print-cover-...` | A page or cover from the print edition. `-hq` means rendered from the original PDF. |
| `photo-by-nim-dvir-...` | Nim's own photo. |
| `photo-...` | Related photo whose publisher frame is not confirmed. |
| `not-used/...` | Kept, not on the site. |

The article page builder reads these URLs from `data-source/writing/article-images.json`.

## Do not move website images between folders

Something in this Cloudinary account renames an asset to `Rename/<ai_description>` a few minutes after the asset is
moved to another folder. It renamed 234 assets, including Database-book images in August 2026 and the website images
on November 22, 2026, which broke their URLs. Renaming an asset or changing its display name or tags did not trigger
it. Upload straight into `PersonalSite/Interviews` (set `asset_folder` at upload time) instead of moving assets later.

## Live-site copies

The published site on `main` still uses five old names: `Fesbender_rphlra`, `Jamie_Foxx2_phxzah`,
`jim-carrey_jqfnzq`, `Julia-cover_clmoms` and `shishabat-cover-julia-louis-dreyfus-2019-03-29`. Copies under those
names sit in `PersonalSite/Interviews/live-site-copies` (tag `live-site-copy`). Delete them only after the new site
replaces the live one.
