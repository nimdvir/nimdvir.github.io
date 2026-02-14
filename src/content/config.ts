import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.string(),
		tags: z.array(z.string()),
		summary: z.string(),
		image: z.string().optional(),
		category: z.string().optional(),
	}),
});

const research = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		year: z.string(),
		tags: z.array(z.string()),
		summary: z.string(),
		image: z.string().optional(),
	}),
});

const interviews = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.string(),
		tags: z.array(z.string()),
		summary: z.string(),
		image: z.string().optional(),
		source: z.string().optional(),
		sourceUrl: z.string().optional(),
		heroImage: z.string().optional(),
	}),
});

export const collections = { blog, research, interviews };
