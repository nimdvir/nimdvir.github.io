## Highlights

* **Recommended architecture:** keep **Research** and **Projects / Applied Work** as separate top-level pages, but add a strong **Featured Research Projects** section inside Research.
* **Main migration target:** old-site Portfolio content → richer new-site **Research Projects** and **Applied Work** case studies.
* **Technical direction:** the new site is already an **Astro** site; migrate content into Astro content collections instead of hard-coding everything inside `.astro` pages.
* **Asset direction:** use attached/original photos as the preferred image source, optimize them locally, and avoid relying on old Google Sites image URLs.
* **Execution model:** branch → content audit → asset audit → content collections → page redesign → QA → PRs → deployment.

---

# Full Migration Plan: `nimdvir.org` → `nimdvir.github.io`

## 1. Migration Objective

The goal is not to copy the old site into the new one. The goal is to **extract the best material from the old site**, modernize it, and integrate it into the newer GitHub Pages site in a structure that supports your current professional identity:

> **Nim Dvir as an AI, UX, HCI, information systems, and behavioral analytics scholar-practitioner.**

The old site has useful legacy content, especially around **Portfolio, Research, Projects, Teaching, and Media**. Its navigation explicitly includes Home, About, Portfolio, Research, Projects, Teaching, and Media, and the homepage frames you as a UX and AI researcher and Visiting Assistant Professor at SUNY Albany. ([Nim Dvir][1])

The new site is cleaner and more current, but thinner in some areas. Its homepage currently has top-level navigation for Home, About, Research, Media, and Teaching, and introduces you as “Nim Dvir, PhD,” with a UX + AI researcher identity. ([Nim Dvir, PhD][2])

---

# 2. Recommended Final Site Architecture

## 2.1 Top-Level Navigation

Use this navigation:

```text
Home
About
Research
Projects
Teaching
Media
Contact
```

### Why this structure works

| Page         | Purpose                                                          | Audience                                          |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------- |
| **Home**     | Strong executive summary of who you are                          | Everyone                                          |
| **About**    | Academic/professional biography, education, skills, awards       | Search committees, collaborators, students        |
| **Research** | Scholarly identity, research projects, publications, manuscripts | Faculty, collaborators, journals, grant reviewers |
| **Projects** | Applied UX, product, AI, content strategy, and industry work     | Industry partners, students, consulting audiences |
| **Teaching** | Courses, pedagogy, classroom work, student feedback              | Students, administrators, teaching reviewers      |
| **Media**    | Journalism, interviews, video appearances, public scholarship    | Public audiences, press, cultural credibility     |
| **Contact**  | Email, links, collaboration CTA                                  | Everyone                                          |

---

## 2.2 Why Projects Should Stay Separate

Projects deserve their own page because your applied UX/product/content work is not the same genre as your research publications or manuscripts. The current `projects.astro` file already includes a mixed list of applied projects and research projects, including Costco, Barrier Free Living, Nasher Sculpture Center, Dexcom, Timeout, Zang Toi, Facebook Content Strategy, Sticky Words, Less Is More, and Information Engagement. ([GitHub][3])

That is useful content, but it needs better separation.

### Recommended distinction

| Type                                    |                                     Goes Under Research? |      Goes Under Projects? |
| --------------------------------------- | -------------------------------------------------------: | ------------------------: |
| Sticky Words                            |                                                      Yes |       Maybe as cross-link |
| Less Is More                            |                                                      Yes |       Maybe as cross-link |
| Information Engagement                  |                                                      Yes |       Maybe as cross-link |
| Nevada diversion court / legal language |                                                      Yes | Maybe as applied research |
| Costco app                              |                                                       No |                       Yes |
| Dexcom G7+                              |                                                       No |                       Yes |
| Barrier Free Living                     | Maybe, if framed as accessibility/social impact research |                       Yes |
| Nasher Sculpture Center                 |                                                       No |                       Yes |
| Timeout Tel Aviv                        |                                                       No |               Yes / Media |
| Zang Toi                                |                                                       No |                       Yes |
| Facebook Content Strategy               |                                                       No |                       Yes |

The Research page should include **research projects**, but the Projects page should include **applied work**.

---

# 3. Current Site Diagnosis

## 3.1 New Site Strengths

The new homepage already has a good professional identity: UX + AI researcher, HCI, responsible AI, data-driven design, media metrics, and a more polished “At a Glance” format. ([Nim Dvir, PhD][2])

The About page already contains structured data for education, skills, career timeline, awards, teaching, and service. ([GitHub][4])

The Teaching page already includes graduate and undergraduate course sections, student feedback, and teaching gallery image arrays. ([GitHub][5])

The Media page already uses an Astro content collection called `interviews`, which is good: that same content-collection strategy should be extended to projects and research projects. ([GitHub][6])

---

## 3.2 Current Site Weaknesses

| Issue                                              | Evidence                                                                                                                                          | Fix                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Research page is too list-like                     | It has glance metrics, research pillars, methods, manuscripts, publications, and talks, but no rich project cards or project pages. ([GitHub][7]) | Add Featured Research Projects and individual research project pages |
| Projects are hard-coded                            | `projects.astro` defines a project array directly in the page file. ([GitHub][3])                                                                 | Move projects into `src/content/projects/`                           |
| Navigation omits Projects                          | New homepage nav shows Home, About, Research, Media, Teaching. ([Nim Dvir, PhD][2])                                                               | Add Projects / Applied Work                                          |
| Role/title inconsistency                           | Homepage says Visiting Assistant Professor, while About timeline includes Lecturer from 2025 onward. ([Nim Dvir, PhD][2])                         | Decide one current title and update all pages/schema                 |
| Deployment script appears stale                    | `package.json` deploy script pushes to `master`, while repo UI shows active branch `main`. ([GitHub][8])                                          | Replace with GitHub Actions deployment or fix script                 |
| README still looks like default Astro starter text | Repo README includes Astro Starter Kit language. ([GitHub][9])                                                                                    | Replace README with real site documentation                          |

---

# 4. Content Migration Map

## 4.1 Home Page

### Keep from new site

* UX + AI researcher framing.
* “Nim Dvir, PhD.”
* HCI, information engagement, responsible AI, data-driven design.
* At-a-glance metrics.
* Professional/social links.

### Import from old site

The old homepage includes a useful concise biography: you describe yourself as a seasoned UX and AI researcher with over a decade of experience, a SUNY Albany faculty member, and a scholar shaped by communication, behavioral economics, and HCI. ([Nim Dvir][1])

### Rewrite goal

The homepage should become less like a CV summary and more like a **professional landing page**.

Recommended homepage sections:

```text
Hero
Short academic-professional identity statement
At a Glance
Featured Research
Selected Applied Work
Teaching Snapshot
Media Snapshot
Contact CTA
```

---

## 4.2 About Page

The About page is already strong structurally, but it needs editorial cleanup and title consistency. It currently includes education, skills, career journey, awards, service, and contact sections. ([GitHub][4])

### Recommended About sections

```text
About Nim
Education
Research and Professional Identity
Career Journey
Skills and Methods
Awards and Honors
Service and Affiliations
Selected Courses
Contact
```

### Specific cleanup tasks

| Task                                                                                | Priority |
| ----------------------------------------------------------------------------------- | -------: |
| Resolve current title: Visiting Assistant Professor vs Lecturer                     |     High |
| Correct “Ph.D., Computer & Information Science” if you prefer “Information Science” |     High |
| Make skills less laundry-list-like                                                  |   Medium |
| Add ORCID and Google Scholar links                                                  |     High |
| Add downloadable CV button                                                          |     High |
| Update structured data in layout schema                                             |     High |

---

## 4.3 Research Page

The Research page should become the intellectual center of the site. Right now it lists research metrics, pillars, interests, toolkits, manuscripts, selected publications, and recent talks. ([GitHub][7]) That is good as a foundation, but it needs richer project-level storytelling.

### Recommended Research page structure

```text
Research

1. Research Identity
2. Research Agenda
3. Featured Research Projects
4. Publications
5. Manuscripts in Progress
6. Talks and Presentations
7. Methods and Toolkits
8. Collaboration CTA
```

### Featured Research Projects to Add

| Research Project                 | Source / Rationale                                                 | New Page? |
| -------------------------------- | ------------------------------------------------------------------ | --------: |
| Sticky Words                     | Dissertation, computational linguistics, engagement                |       Yes |
| Less Is More                     | Landing-page experiments, information volume, conversion           |       Yes |
| Information Engagement           | Foundational theory linking information behavior and engagement    |       Yes |
| Words on Trial                   | Legal language, compliance, diversion court, NLP/behavioral design |       Yes |
| AI and Pedagogy                  | AI tools, digital learning, responsible AI education               |       Yes |
| Transparency in Online Marketing | Current manuscript / A/B experimentation                           |       Yes |

### Research project page template

Each project should include:

```text
Title
One-sentence contribution
Research problem
Theoretical framing
Methods
Data / sample
Key findings or expected contribution
Outputs: publications, manuscripts, talks, grants
Collaborators
Status
Related links
```

---

## 4.4 Projects / Applied Work Page

The old Portfolio page has a valuable Projects section, including ongoing research projects and collaborative industry research projects. It explicitly frames your work as collaborations with researchers, industry professionals, and designers to deliver data-driven design strategies, predictive modeling, and informed decision-making. ([Nim Dvir][10])

The current `projects.astro` file already contains applied project entries, but they are hard-coded and mixed with research projects. ([GitHub][3])

### Recommended page title

Use one of these:

| Option                | Tone                                              |
| --------------------- | ------------------------------------------------- |
| **Projects**          | Simple and clear                                  |
| **Selected Projects** | Academic/professional                             |
| **Applied Work**      | Best for your scholar-practitioner identity       |
| **UX + AI Projects**  | More industry-facing                              |
| **Portfolio**         | Legacy continuity, but slightly older terminology |

My recommendation: **Projects** in the nav, with page heading **Applied Work**.

### Projects page structure

```text
Projects / Applied Work

Intro:
Applied UX, AI, product, content strategy, and design research work across nonprofit, health, retail, media, museum, and technology contexts.

Filters:
- UX Research
- Product Design
- Content Strategy
- AI / NLP
- Social Impact
- Health Tech
- Media / Publishing

Featured Case Studies:
- Costco Mobile App
- Dexcom G7+
- Barrier Free Living
- Nasher Sculpture Center
- Timeout Tel Aviv
- Zang Toi
- Facebook Content Strategy

Cross-linked Research Projects:
- Sticky Words
- Less Is More
- Information Engagement
```

---

## 4.5 Teaching Page

The Teaching page is already content-rich: graduate and undergraduate courses are defined in arrays, and it includes gallery images from Cloudinary. ([GitHub][5])

### Recommended Teaching upgrades

| Upgrade                                     | Purpose                                        |
| ------------------------------------------- | ---------------------------------------------- |
| Add course cards with “What students build” | Make teaching concrete                         |
| Add BITM 330 textbook/project section       | Connect teaching to your textbook work         |
| Add “AI in Teaching” subsection             | Signal current pedagogical innovation          |
| Add optimized classroom/project photos      | Increase warmth and credibility                |
| Add selected student feedback cards         | Keep strong quotes but avoid overwhelming page |

### Suggested Teaching structure

```text
Teaching

1. Teaching Philosophy
2. Courses
   - Graduate
   - Undergraduate
3. Signature Pedagogy
   - Project-based learning
   - AI-supported learning
   - Databases and analytics
   - UX/product thinking
4. Student Work
5. Student Feedback
6. Teaching Gallery
7. Teaching Materials / Textbook
```

---

## 4.6 Media Page

The Media page currently uses an `interviews` content collection and displays interview entries dynamically. ([GitHub][6]) This is the right pattern. The old site’s media identity should be expanded into a richer archive.

### Recommended Media structure

```text
Media

1. Public Scholarship
2. Video Appearances
3. Journalism and Interviews
4. Celebrity Interviews
5. Commentary / Cultural Writing
6. Selected Links
```

### Migration actions

| Action                                                           | Priority |
| ---------------------------------------------------------------- | -------: |
| Expand interview content collection                              |     High |
| Add interview metadata: publication, date, language, role, topic |     High |
| Add thumbnails where available                                   |   Medium |
| Separate academic media from entertainment journalism            |     High |
| Add Hebrew/English labels where relevant                         |   Medium |

---

# 5. Technical Migration Architecture

## 5.1 Keep Astro

The repo is already an Astro project. Its `package.json` uses `astro dev`, `astro build`, and `astro preview`; dependencies include Astro and `@astrojs/sitemap`. ([GitHub][8])

Do not migrate to Jekyll. Continue with Astro.

---

## 5.2 Use Content Collections

Astro content collections are designed for structured groups of content such as blog posts, product descriptions, profiles, and other repeated content types; they support querying, metadata, type checking, and rendering. ([Astro Docs][11])

Use collections for:

```text
src/content/
  config.ts
  projects/
  research/
  interviews/
  publications/
  talks/
```

### Recommended collections

| Collection         | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `projects`         | Applied UX/product/content strategy work               |
| `researchProjects` | Research projects with methods, outputs, collaborators |
| `interviews`       | Journalism/media/interviews                            |
| `publications`     | Publications, proceedings, dissertation                |
| `talks`            | Talks, presentations, invited lectures                 |
| `courses`          | Optional, for Teaching page scalability                |

---

## 5.3 Recommended Content Collection Schema

### `src/content/config.ts`

```ts
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.enum([
      "UX Research",
      "Product Design",
      "Content Strategy",
      "Digital Strategy",
      "Health Tech",
      "Social Impact",
      "Media",
      "AI / NLP",
      "Research"
    ]),
    summary: z.string(),
    role: z.string().optional(),
    organization: z.string().optional(),
    year: z.string().optional(),
    status: z.enum(["Completed", "Ongoing", "Archived"]).default("Completed"),
    image: z.string().optional(),
    alt: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    tags: z.array(z.string()).default([]),
    relatedResearch: z.array(z.string()).default([])
  })
});

const researchProjects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    summary: z.string(),
    status: z.enum([
      "Published",
      "Under Review",
      "In Progress",
      "Pilot",
      "Archived"
    ]),
    methods: z.array(z.string()).default([]),
    collaborators: z.array(z.string()).default([]),
    outputs: z.array(z.string()).default([]),
    image: z.string().optional(),
    alt: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99)
  })
});

const interviews = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    interviewee: z.string().optional(),
    publication: z.string().optional(),
    date: z.string(),
    language: z.enum(["English", "Hebrew", "Other"]).default("English"),
    type: z.enum([
      "Celebrity Interview",
      "Media Appearance",
      "Public Scholarship",
      "Article",
      "Video"
    ]),
    externalUrl: z.string().optional(),
    image: z.string().optional(),
    alt: z.string().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  projects,
  researchProjects,
  interviews
};
```

---

# 6. Proposed File Structure

```text
nimdvir.github.io/
  src/
    assets/
      images/
        headshots/
        projects/
        research/
        teaching/
        media/
        logos/
    components/
      ProjectCard.astro
      ResearchProjectCard.astro
      PublicationItem.astro
      MediaCard.astro
      SectionHeader.astro
    content/
      config.ts
      projects/
        costco-mobile-app.md
        barrier-free-living.md
        nasher-sculpture-center.md
        dexcom-g7-plus.md
        timeout-tel-aviv.md
        zang-toi.md
        facebook-content-strategy.md
      researchProjects/
        sticky-words.md
        less-is-more.md
        information-engagement.md
        words-on-trial.md
        transparency-online-marketing.md
        ai-pedagogy.md
      interviews/
        ...
    layouts/
      Layout.astro
      ProjectLayout.astro
      ResearchProjectLayout.astro
    pages/
      index.astro
      about.astro
      research.astro
      projects.astro
      projects/
        [slug].astro
      research/
        [slug].astro
      teaching.astro
      media.astro
      contact.astro
  public/
    documents/
      NimDvirCV.pdf
    images/
      og/
      favicons/
  scripts/
    optimize-images.mjs
    audit-links.mjs
  migration/
    old-site-content-audit.md
    image-inventory.csv
    migration-decisions.md
```

---

# 7. Asset and Image Migration Plan

## 7.1 Image Source Priority

Astro distinguishes between images stored in `src/` and images stored in `public/`. Images in `src/` can be imported and processed by Astro image components, while images in `public/` are served directly and are not optimized. ([Astro Docs][12])

Use this hierarchy:

| Priority | Source                            | Use                                                            |
| -------: | --------------------------------- | -------------------------------------------------------------- |
|        1 | Attached/original photo folder    | Primary source for headshots, teaching photos, project visuals |
|        2 | Existing repo images              | Keep if high quality and already working                       |
|        3 | Cloudinary-hosted teaching photos | Keep temporarily; later replace with optimized local copies    |
|        4 | Old Google Sites images           | Download only if necessary; do not hotlink                     |
|        5 | External images                   | Avoid unless licensed/credited                                 |

---

## 7.2 Asset Folder Design

```text
src/assets/images/
  headshots/
    nim-dvir-headshot-2026.webp
    nim-dvir-teaching-hero.webp

  projects/
    costco-mobile-app-card.webp
    barrier-free-living-card.webp
    nasher-sculpture-center-card.webp
    dexcom-g7-plus-card.webp
    timeout-tel-aviv-card.webp
    zang-toi-card.webp
    facebook-content-strategy-card.webp

  research/
    sticky-words-card.webp
    less-is-more-card.webp
    information-engagement-card.webp
    words-on-trial-card.webp

  teaching/
    bitm330-classroom-01.webp
    bitm522-student-projects-01.webp
    teaching-gallery-01.webp

  media/
    ynet-interview-card.webp
    rupaul-interview-card.webp
    lady-gaga-interview-card.webp
```

---

## 7.3 Image Optimization Rules

| Image Type       |         Width | Format       | Target Size |
| ---------------- | ------------: | ------------ | ----------: |
| Headshot / hero  |  1200–1600 px | WebP or AVIF |    ≤ 350 KB |
| Project card     |   800–1000 px | WebP         |    ≤ 180 KB |
| Research card    |   800–1000 px | WebP         |    ≤ 180 KB |
| Teaching gallery |  1000–1400 px | WebP         |    ≤ 250 KB |
| Open Graph image | 1200 × 630 px | WebP/JPG     |    ≤ 300 KB |
| Logos/icons      | SVG preferred | SVG/PNG      |     Minimal |

Astro’s image components can generate responsive image sizes and formats when configured, including `srcset` and `sizes` values. ([Astro Docs][12])

---

## 7.4 Optimization Script

Create:

```text
scripts/optimize-images.mjs
```

```js
// scripts/optimize-images.mjs
// Batch-optimizes source images into web-ready WebP files.
// Run from the project root with: node scripts/optimize-images.mjs

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import fg from "fast-glob";

const inputDir = "asset-inbox";
const outputDir = "src/assets/images/migrated";

// Create multiple responsive widths for common website contexts.
const widths = [600, 1000, 1600];

// Source formats to process.
const patterns = ["**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}"];

await fs.mkdir(outputDir, { recursive: true });

const files = await fg(patterns, {
  cwd: inputDir,
  absolute: true,
});

const manifest = [];

for (const file of files) {
  const parsed = path.parse(file);

  const safeBase = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const metadata = await sharp(file).metadata();

  for (const width of widths) {
    // Avoid upscaling small source images.
    if (metadata.width && metadata.width < width) continue;

    const outputName = `${safeBase}-${width}.webp`;
    const outputPath = path.join(outputDir, outputName);

    await sharp(file)
      .rotate() // respects EXIF orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);

    manifest.push({
      source: file,
      output: outputPath,
      sourceWidth: metadata.width,
      sourceHeight: metadata.height,
      outputWidth: width,
      format: "webp",
    });
  }
}

await fs.writeFile(
  path.join(outputDir, "image-manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(`Optimized ${manifest.length} image variants.`);
```

Install dependencies:

```bash
npm install -D sharp fast-glob
node scripts/optimize-images.mjs
```

---

# 8. Page Implementation Plan

## 8.1 Update Navigation

Update `Nav.astro` to include:

```text
Home
About
Research
Projects
Teaching
Media
Contact
```

If space is tight on mobile, use:

```text
Home
About
Research
Projects
More
```

Where More contains Teaching, Media, Contact.

---

## 8.2 Create Projects Page

### `src/pages/projects.astro`

Purpose: list applied projects only.

Pseudo-structure:

```astro
---
import Layout from "../layouts/Layout.astro";
import ProjectCard from "../components/ProjectCard.astro";
import { getCollection } from "astro:content";

const projects = await getCollection("projects");
const sorted = projects.sort((a, b) => a.data.order - b.data.order);
---

<Layout title="Projects" description="Applied UX, AI, product, and content strategy projects by Nim Dvir.">
  <main>
    <section class="hero">
      <p class="eyebrow">Applied Work</p>
      <h1>UX, AI, product, and content strategy projects</h1>
      <p>
        Selected collaborations across retail, health technology, nonprofit,
        museums, media, and digital strategy.
      </p>
    </section>

    <section class="project-grid">
      {sorted.map((project) => (
        <ProjectCard project={project} />
      ))}
    </section>
  </main>
</Layout>
```

---

## 8.3 Create Individual Project Pages

### `src/pages/projects/[slug].astro`

```astro
---
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const projects = await getCollection("projects");

  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<Layout
  title={project.data.title}
  description={project.data.summary}
  image={project.data.image}
>
  <article class="case-study">
    <p class="eyebrow">{project.data.category}</p>
    <h1>{project.data.title}</h1>
    <p class="summary">{project.data.summary}</p>

    <dl class="metadata">
      {project.data.role && <><dt>Role</dt><dd>{project.data.role}</dd></>}
      {project.data.organization && <><dt>Organization</dt><dd>{project.data.organization}</dd></>}
      {project.data.year && <><dt>Year</dt><dd>{project.data.year}</dd></>}
      <dt>Status</dt><dd>{project.data.status}</dd>
    </dl>

    <Content />
  </article>
</Layout>
```

---

## 8.4 Expand Research Page

### Add “Featured Research Projects”

Use the new `researchProjects` collection.

```astro
---
import { getCollection } from "astro:content";
import ResearchProjectCard from "../components/ResearchProjectCard.astro";

const researchProjects = await getCollection("researchProjects");
const featuredResearch = researchProjects
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order);
---

<section>
  <h2>Featured Research Projects</h2>
  <p>
    My research examines how people engage with information, language,
    interfaces, and AI-mediated systems.
  </p>

  <div class="grid">
    {featuredResearch.map((project) => (
      <ResearchProjectCard project={project} />
    ))}
  </div>
</section>
```

---

## 8.5 Create Research Project Pages

### `src/pages/research/[slug].astro`

This lets the Research section become a serious academic hub.

Each page should use the structure:

```text
Overview
Research Question
Motivation
Methods
Data / Participants
Key Findings
Outputs
Collaborators
Status
Related Publications
```

---

# 9. Content Writing Templates

## 9.1 Applied Project Template

```md
---
title: "Costco Mobile App"
category: "UX Research"
summary: "A mobile-app redesign concept focused on in-store navigation, checkout friction, and customer engagement."
role: "UX Researcher / Product Strategy"
organization: "Academic / portfolio project"
year: "YYYY"
status: "Completed"
image: "/src/assets/images/projects/costco-mobile-app-card.webp"
alt: "Preview image for Costco mobile app UX project."
featured: true
order: 1
tags:
  - UX Research
  - Retail
  - Mobile App
  - Gamification
---

## Context

Briefly describe the organization, domain, and user problem.

## Challenge

What was broken, inefficient, confusing, or underexplored?

## Research Approach

- Competitive analysis
- User journey mapping
- Pain-point identification
- Concept testing
- Prototype evaluation

## Key Insights

1. Insight one.
2. Insight two.
3. Insight three.

## Design / Strategy Recommendations

Describe the proposed solution.

## Impact

Describe expected or observed impact.

## Reflection

What this project shows about your broader UX/HCI approach.
```

---

## 9.2 Research Project Template

```md
---
title: "Sticky Words"
summary: "A computational linguistics research program examining how word choice shapes attention, memory, engagement, and decision-making."
status: "Published"
methods:
  - NLP
  - Computational linguistics
  - Experimental design
  - Behavioral analytics
collaborators:
  - "Eli Friedman"
  - "Sanjay Commuri"
outputs:
  - "Doctoral dissertation"
  - "Conference proceedings"
  - "Manuscripts under review"
featured: true
order: 1
---

## Overview

Describe the project in plain but scholarly language.

## Research Problem

What gap does this work address?

## Theoretical Contribution

Explain the information engagement / HCI / behavioral decision-making contribution.

## Methods

Describe the methods and data.

## Findings

Summarize known findings or expected contributions.

## Outputs

List dissertation, publications, talks, manuscripts.

## Future Direction

Explain where the research goes next.
```

---

# 10. Content Migration Inventory

## 10.1 Old → New Content Mapping

| Old Site Content                | New Location      | Action                                     |
| ------------------------------- | ----------------- | ------------------------------------------ |
| Old homepage bio                | Home / About      | Rewrite and merge                          |
| Education                       | About             | Compare with current About page and update |
| Qualifications and skills       | About             | Condense and modernize                     |
| Awards                          | About             | Merge, verify dates                        |
| Research interests              | Research          | Merge into research agenda                 |
| Manuscripts list                | Research          | Update, verify current status              |
| Publications                    | Research          | Move into structured publication list      |
| Talks                           | Research          | Move into talks section/collection         |
| Ongoing research projects       | Research Projects | Expand into project pages                  |
| Collaborative industry projects | Projects          | Expand into applied case studies           |
| Teaching content                | Teaching          | Merge selectively                          |
| Media content                   | Media             | Expand archive                             |
| Contact                         | Contact/Footer    | Update and standardize                     |

---

## 10.2 Applied Projects Migration Table

| Project                   | Destination      |   Priority | Treatment                                    |
| ------------------------- | ---------------- | ---------: | -------------------------------------------- |
| Costco Mobile App         | Projects         |       High | Full case study                              |
| Dexcom G7+                | Projects         |       High | Full case study, careful health-tech wording |
| Barrier Free Living       | Projects         |       High | Social impact/accessibility case study       |
| Nasher Sculpture Center   | Projects         |     Medium | UX/content/membership case study             |
| Timeout Tel Aviv          | Projects + Media |     Medium | Editorial UX/content strategy                |
| Zang Toi                  | Projects         |     Medium | Digital strategy/brand case study            |
| Facebook Content Strategy | Projects         | Low–Medium | Short legacy case study                      |
| Golf Buddy App            | Projects         |     Medium | Add if enough detail exists                  |

---

## 10.3 Research Projects Migration Table

| Project                          | Destination         | Priority | Treatment                                    |
| -------------------------------- | ------------------- | -------: | -------------------------------------------- |
| Sticky Words                     | Research            |     High | Full research project page                   |
| Less Is More                     | Research            |     High | Full research project page                   |
| Information Engagement           | Research            |     High | Full research project page                   |
| Words on Trial                   | Research            |     High | Full research project page                   |
| Transparency in Online Marketing | Research            |     High | Full research project page                   |
| AI/ML Pedagogy                   | Research + Teaching |   Medium | Research/pedagogy bridge                     |
| Digital Citizenship              | Teaching + Research |   Medium | Add if framed as pedagogy/public scholarship |

---

# 11. GitHub / Astro Execution Plan

## Phase 0 — Preparation

```bash
git checkout main
git pull origin main
git checkout -b migration/old-site-import
npm install
npm run dev
```

Create working folders:

```bash
mkdir migration
mkdir asset-inbox
mkdir -p src/content/projects
mkdir -p src/content/researchProjects
mkdir -p src/assets/images/projects
mkdir -p src/assets/images/research
mkdir -p src/assets/images/teaching
mkdir -p src/assets/images/media
mkdir -p src/assets/images/headshots
```

Add to `.gitignore`:

```gitignore
asset-inbox/
migration/raw-downloads/
.DS_Store
Thumbs.db
```

---

## Phase 1 — Content Audit

Create:

```text
migration/old-site-content-audit.md
migration/migration-decisions.md
migration/image-inventory.csv
```

### `image-inventory.csv` columns

```csv
source_file,current_location,recommended_filename,page_destination,content_type,alt_text,license_or_source,status,notes
```

### Content audit categories

| Decision | Meaning                              |
| -------- | ------------------------------------ |
| Keep     | Strong content; migrate              |
| Rewrite  | Useful but needs modernization       |
| Archive  | Keep in repo but do not feature      |
| Drop     | Outdated or redundant                |
| Verify   | Needs date/title/source confirmation |

---

## Phase 2 — Fix Site Foundation

### Required foundation fixes

| Task                      | File                                         | Priority |
| ------------------------- | -------------------------------------------- | -------: |
| Add Projects to nav       | `src/components/Nav.astro`                   |     High |
| Resolve current job title | `index.astro`, `about.astro`, `Layout.astro` |     High |
| Fix structured data       | `src/layouts/Layout.astro`                   |     High |
| Replace default README    | `README.md`                                  |   Medium |
| Fix deploy script         | `package.json` or GitHub Actions             |     High |
| Add contact page          | `src/pages/contact.astro`                    |   Medium |

The site’s layout currently contains schema metadata with a Person schema, job title, organization, links, and knowsAbout values. That should be updated once your official current title is finalized. ([GitHub][13])

---

## Phase 3 — Build Content Collections

Create:

```text
src/content/config.ts
```

Then create project files and research project files.

Suggested first batch:

```text
src/content/projects/
  costco-mobile-app.md
  barrier-free-living.md
  nasher-sculpture-center.md
  dexcom-g7-plus.md
  timeout-tel-aviv.md
  zang-toi.md
  facebook-content-strategy.md

src/content/researchProjects/
  sticky-words.md
  less-is-more.md
  information-engagement.md
  words-on-trial.md
  transparency-online-marketing.md
  ai-pedagogy.md
```

---

## Phase 4 — Rebuild Projects Page

Replace the hard-coded project array in `projects.astro` with `getCollection("projects")`.

Why: the current file stores all project content directly inside the page file, which is not scalable for richer case studies. ([GitHub][3])

---

## Phase 5 — Expand Research Page

Add:

```text
Featured Research Projects
Current Research Streams
Selected Publications
Manuscripts
Talks
Methods
```

The old Portfolio page contains a much longer research list, including manuscripts, refereed articles, and conference presentations; these should be reconciled with the new shorter Research page. ([Nim Dvir][10])

---

## Phase 6 — Expand Media Page

The Media page already uses the `interviews` collection, so extend that pattern rather than redesigning from scratch. ([GitHub][6])

Create/standardize entries for:

```text
Media/Interviews or src/content/interviews/
  rupaul.md
  lady-gaga.md
  jamie-foxx.md
  jim-carrey.md
  julia-louis-dreyfus.md
  michael-fassbender.md
```

Each entry should include:

```yaml
---
title: "Interview with RuPaul"
interviewee: "RuPaul"
publication: "Ynet"
date: "YYYY-MM-DD"
language: "Hebrew"
type: "Celebrity Interview"
externalUrl: ""
image: ""
alt: "Media thumbnail for interview with RuPaul."
featured: true
---
```

---

## Phase 7 — Teaching Page Enhancement

The current Teaching page is already structurally strong, with graduate and undergraduate courses and gallery arrays. ([GitHub][5])

Enhance it by adding:

```text
Teaching Philosophy
Signature Courses
AI in the Classroom
Student Projects
Textbook / Course Materials
Student Feedback
Teaching Gallery
```

Move images from Cloudinary to optimized local assets gradually, unless you intentionally want Cloudinary as your CDN.

---

## Phase 8 — Image Migration

### Step 1: Put originals in local inbox

```text
asset-inbox/
  attached-photos/
  old-site-downloads/
  screenshots/
```

### Step 2: Rename before optimization

Bad:

```text
IMG_2948.jpeg
Screen Shot 2023-05-01 at 8.32.11 PM.png
```

Good:

```text
nim-dvir-teaching-bitm330-classroom-01.jpg
costco-mobile-app-wireframe-01.png
sticky-words-research-diagram-01.png
```

### Step 3: Optimize

```bash
npm install -D sharp fast-glob
node scripts/optimize-images.mjs
```

### Step 4: Add alt text

Every image used in content should have specific alt text, especially teaching photos, project previews, and media thumbnails.

---

# 12. Deployment Plan

Astro recommends deploying to GitHub Pages using GitHub Actions; the official guide describes deploying a static prerendered Astro website from a GitHub repository through GitHub Actions. ([Astro Docs][14])

## Recommended Deployment Workflow

Create:

```text
.github/workflows/deploy.yml
```

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository
        uses: actions/checkout@v4

      - name: Install, build, and upload your site
        uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Then remove or revise the current deploy scripts that push to `master`. The current `package.json` deploy command pushes to `origin master`, while the repo interface shows the main branch as `main`. ([GitHub][8])

---

# 13. Pull Request Sequence

## PR 1 — Site Foundation

**Goal:** Make the new site ready for migration.

Tasks:

* Add Projects to nav.
* Add Contact page.
* Resolve title/role consistency.
* Update structured data in `Layout.astro`.
* Replace README starter text.
* Fix deployment workflow.

Acceptance criteria:

```bash
npm run build
npm run preview
```

No broken layout. Navigation shows Projects.

---

## PR 2 — Content Collections

**Goal:** Move scalable content into collections.

Tasks:

* Add `src/content/config.ts`.
* Create `projects` collection.
* Create `researchProjects` collection.
* Confirm existing `interviews` collection still works.
* Add first draft project/research entries.

Acceptance criteria:

* `npm run build` passes.
* No TypeScript/schema errors.
* Project entries render from content files.

---

## PR 3 — Projects / Applied Work Page

**Goal:** Rebuild projects as a real applied-work portfolio.

Tasks:

* Replace hard-coded project array.
* Create `ProjectCard.astro`.
* Create `projects/[slug].astro`.
* Add applied case studies.
* Add project categories/tags.
* Add optimized project images.

Acceptance criteria:

* `/projects` displays all applied projects.
* Each project has a working detail page.
* Research projects are no longer mixed awkwardly with applied projects.

---

## PR 4 — Research Page Expansion

**Goal:** Make Research substantial.

Tasks:

* Add Featured Research Projects section.
* Create `ResearchProjectCard.astro`.
* Create `research/[slug].astro`.
* Add Sticky Words, Less Is More, Information Engagement, Words on Trial, Transparency in Online Marketing, AI Pedagogy.
* Reconcile publications and manuscripts from old site.

Acceptance criteria:

* Research page has clear intellectual identity.
* Each featured research project has a page.
* Publications and manuscripts are current and not misleading.

---

## PR 5 — Media Archive Expansion

**Goal:** Preserve journalism/media identity.

Tasks:

* Expand interviews collection.
* Add metadata: interviewee, publication, date, language, type.
* Add media thumbnails where appropriate.
* Separate public scholarship, video, journalism, celebrity interviews.

Acceptance criteria:

* Media page feels intentional, not thin.
* Old journalism background supports your communication/research identity.

---

## PR 6 — Teaching Page Polish

**Goal:** Make Teaching visually and pedagogically stronger.

Tasks:

* Add teaching philosophy.
* Add signature assignments/projects.
* Add AI pedagogy section.
* Add optimized teaching gallery images.
* Add BITM 330 textbook/project section.

Acceptance criteria:

* Teaching page communicates course range, pedagogy, and student impact.
* Images are optimized and accessible.

---

## PR 7 — Final QA / Launch

**Goal:** Ship cleanly.

Tasks:

* Run build.
* Run preview.
* Check links.
* Check responsive layout.
* Check image sizes.
* Check metadata.
* Check Open Graph image.
* Confirm deployment.

Acceptance criteria:

* Live site works.
* No obvious broken images.
* No stale title/role inconsistency.
* No default Astro starter text.
* No production dependency on old Google Sites images.

---

# 14. QA Checklist

## Content QA

| Check             | Pass Criteria                                                       |
| ----------------- | ------------------------------------------------------------------- |
| Title consistency | Same current title across Home, About, schema, CV                   |
| Bio consistency   | Same name, affiliation, research identity                           |
| Research status   | Manuscripts marked accurately: published, under review, in progress |
| Project status    | Applied projects do not overclaim outcomes                          |
| Media links       | External links work                                                 |
| Contact info      | Email and professional links correct                                |

---

## Technical QA

| Check                    | Command / Method                    |
| ------------------------ | ----------------------------------- |
| Install works            | `npm install`                       |
| Dev server works         | `npm run dev`                       |
| Production build works   | `npm run build`                     |
| Preview works            | `npm run preview`                   |
| No broken internal links | manual or link checker              |
| No massive images        | check `dist/_astro` and image sizes |
| Sitemap generated        | verify after build                  |
| GitHub Pages deploys     | Actions tab                         |

---

## Accessibility QA

| Check               | Requirement                                |
| ------------------- | ------------------------------------------ |
| Alt text            | All meaningful images have useful alt text |
| Decorative images   | Empty alt or CSS background                |
| Color contrast      | Text readable on cards/buttons             |
| Keyboard navigation | Nav and links accessible                   |
| Heading hierarchy   | One H1 per page, logical H2/H3 order       |
| Link labels         | No vague “click here” links                |
| Mobile              | Cards and nav usable on phone              |

---

# 15. Suggested Timeline

## Fast Version: 1 Week

| Day   | Work                                        |
| ----- | ------------------------------------------- |
| Day 1 | Foundation fixes + content audit            |
| Day 2 | Image audit + optimization pipeline         |
| Day 3 | Projects content collection + Projects page |
| Day 4 | Research expansion                          |
| Day 5 | Media + Teaching updates                    |
| Day 6 | QA                                          |
| Day 7 | Deploy                                      |

## Better Version: 2–3 Weeks

| Phase                  | Duration |
| ---------------------- | -------: |
| Audit and architecture | 2–3 days |
| Asset cleanup          | 2–3 days |
| Content collections    |   2 days |
| Projects migration     | 3–4 days |
| Research expansion     | 3–4 days |
| Media + Teaching       |   3 days |
| QA and deployment      |   2 days |

---

# 16. Final Recommended Direction

The best final structure is:

```text
Home
About
Research
Projects
Teaching
Media
Contact
```

And the conceptual division should be:

```text
Research = scholarly work, methods, publications, manuscripts, academic projects.
Projects = applied UX, product, AI, content strategy, consulting, industry-facing work.
Teaching = pedagogy, courses, student work, classroom impact.
Media = journalism, interviews, public scholarship, cultural visibility.
```

The migration should make the Research page fuller, but not by dumping every project into it. Instead, Research should gain **research-project depth**, while Projects should become the home for **applied case studies**.

The old site has the raw material. The new site has the better frame. The migration should combine them into a site that says, very clearly:

> **I study how people engage with information, AI, language, and digital systems — and I build, teach, and communicate those ideas across research, industry, and media.**

[1]: https://www.nimdvir.org/ "Nim Dvir, PhD"
[2]: https://nimdvir.github.io/ "Nim Dvir, PhD"
[3]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/src/pages/projects.astro "raw.githubusercontent.com"
[4]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/src/pages/about.astro "raw.githubusercontent.com"
[5]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/src/pages/teaching.astro "raw.githubusercontent.com"
[6]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/src/pages/media.astro "raw.githubusercontent.com"
[7]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/src/pages/research.astro "raw.githubusercontent.com"
[8]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/package.json "raw.githubusercontent.com"
[9]: https://github.com/nimdvir/nimdvir.github.io "GitHub - nimdvir/nimdvir.github.io: https://github.com/nimdvir/nimdvir.github.io | · GitHub"
[10]: https://www.nimdvir.org/portfolio "Nim Dvir, PhD - Portfolio"
[11]: https://docs.astro.build/en/guides/content-collections/ "Content collections | Docs"
[12]: https://docs.astro.build/en/guides/images/ "Images | Docs"
[13]: https://raw.githubusercontent.com/nimdvir/nimdvir.github.io/main/src/layouts/Layout.astro "{pageTitle}"
[14]: https://docs.astro.build/en/guides/deploy/github/ "Deploy your Astro Site to GitHub Pages | Docs"
