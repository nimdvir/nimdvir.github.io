import { defineCollection, z } from "astro:content";

const taxonomyFields = {
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  heroImage: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
};

const validDate = (date: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) &&
  Number.isFinite(Date.parse(`${date}T12:00:00Z`)) &&
  new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date;
const editorialChecks = (
  data: { draft: boolean; date: string; image?: string; imageAlt?: string },
  ctx: z.RefinementCtx,
) => {
  if (!data.draft && !validDate(data.date))
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["date"],
      message: "Published entries need a valid YYYY-MM-DD date.",
    });
  if (!data.draft && data.image && !data.imageAlt?.trim())
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["imageAlt"],
      message: "Add descriptive alternative text for the cover image.",
    });
};

const blog = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      date: z.string(),
      ...taxonomyFields,
      summary: z.string(),
      category: z.string().optional(),
      draft: z.boolean().default(true),
      imageAlt: z.string().optional(),
      imageCaption: z.string().optional(),
    })
    .superRefine(editorialChecks),
});
const news = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      date: z.string(),
      summary: z.string(),
      draft: z.boolean().default(true),
      inline: z.boolean().default(true),
      link: z
        .string()
        .refine(
          (value) =>
            (value.startsWith("/") && !value.startsWith("//")) ||
            /^https?:\/\//.test(value),
          "Use a root-relative path or an HTTP(S) URL.",
        )
        .optional(),
    })
    .superRefine(editorialChecks),
});

const research = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    year: z.string(),
    ...taxonomyFields,
    summary: z.string(),
    subtitle: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    imageAlt: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
    researchAreas: z.array(z.string()).optional(),
    methods: z.array(z.string()).optional(),
    relatedPublicationSlugs: z.array(z.string()).optional(),
    relatedTalkSlugs: z.array(z.string()).optional(),
  }),
});

const interviews = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    interviewee: z.string().optional(),
    date: z.string(),
    ...taxonomyFields,
    summary: z.string(),
    source: z.string().optional(),
    sourceUrl: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    ...taxonomyFields,
    category: z.string(),
    year: z.string().optional(),
    status: z.string().optional(),
    client: z.string().optional(),
    role: z.string().optional(),
    outcome: z.string().optional(),
    externalUrl: z.string().url().optional(),
    researchSlug: z.string().optional(),
  }),
});

const publications = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    year: z.string(),
    authors: z.array(z.string()).default([]),
    venue: z.string(),
    summary: z.string().optional(),
    ...taxonomyFields,
    type: z.string().optional(),
    status: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const talks = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    year: z.string(),
    event: z.string(),
    summary: z.string().optional(),
    ...taxonomyFields,
    location: z.string().optional(),
    status: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const courses = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    ...taxonomyFields,
    institution: z.string().optional(),
    term: z.string().optional(),
    level: z.string().optional(),
    status: z.string().optional(),
    syllabusUrl: z.string().url().optional(),
  }),
});

export const collections = {
  blog,
  news,
  research,
  interviews,
  projects,
  publications,
  talks,
  courses,
};
