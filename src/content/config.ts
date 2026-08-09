import { defineCollection, z } from 'astro:content';

const taxonomyFields = {
	tags: z.array(z.string()).default([]),
	image: z.string().optional(),
	heroImage: z.string().optional(),
	featured: z.boolean().optional(),
	sortOrder: z.number().int().optional(),
};

const shortMonthDate = z.string().regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/, {
	message: 'Use Mon DD, YYYY, for example Mar 28, 2019.',
});

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.string(),
		...taxonomyFields,
		summary: z.string(),
		category: z.string().optional(),
	}),
});

const research = defineCollection({
	type: 'content',
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
	type: 'content',
	schema: z.object({
		title: z.string(),
		interviewee: z.string().min(1),
		date: shortMonthDate,
		tags: z.array(z.string()).default([]),
		image: z.string().url().optional(),
		imageAlt: z.string().min(1).optional(),
		imageCaption: z.string().min(1).optional(),
		heroImage: z.string().url().optional(),
		heroImageAlt: z.string().min(1).optional(),
		heroImageCaption: z.string().min(1).optional(),
		featured: z.boolean().optional(),
		sortOrder: z.number().int().optional(),
		summary: z.string(),
		source: z.string().optional(),
		sourceUrl: z.string().url().optional(),
	}).superRefine((data, context) => {
		if (!data.tags.includes('Interview')) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['tags'],
				message: 'Interview entries must include the Interview tag.',
			});
		}

		if (Boolean(data.source) !== Boolean(data.sourceUrl)) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['sourceUrl'],
				message: 'source and sourceUrl must either both be present or both be absent.',
			});
		}

		if (data.image && (!data.imageAlt || !data.imageCaption)) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['imageAlt'],
				message: 'imageAlt and imageCaption are required when image is present.',
			});
		}

		if (data.heroImage && (!data.heroImageAlt || !data.heroImageCaption)) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['heroImageAlt'],
				message: 'heroImageAlt and heroImageCaption are required when heroImage is present.',
			});
		}
	}),
});

const projects = defineCollection({
	type: 'content',
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
	type: 'content',
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
	type: 'content',
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
	type: 'content',
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

export const collections = { blog, research, interviews, projects, publications, talks, courses };
