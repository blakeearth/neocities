import { file, glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const cards = defineCollection({
	loader: glob({ base: './src/content/cards', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const lyricStatuses = defineCollection({
	loader: file("src/data/lyric-statuses.json"),
	schema: z.object({
		emoji: z.string(),
		text: z.string(),
		date: z.coerce.date().nullable().optional(),
		attribution: z.string(),
	})
});

const siteUpdates = defineCollection({
	loader: file("src/data/site-updates.json"),
	schema: z.object({
		text: z.string(),
		date: z.coerce.date().nullable().optional(),
	})
});

const highlights = defineCollection({
	loader: file("src/data/highlights.json"),
	schema: z.object({
		text: z.string(),
		title: z.string(),
		OLID: z.string(),
		tags: z.string(),
		timestamp: z.string(),
	})
});

const books = defineCollection({
	loader: file("src/data/books.json"),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().nullable(),
		author: z.string(),
		coverImage: z.object({
			small: z.string().nullable(),
			medium: z.string().nullable(),
			large: z.string().nullable()
		}).nullable(),
		publishDate: z.string().nullable(),
		publishers: z.array(z.string()).nullable(),
		subjects: z.array(z.string()).nullable(),
		pageCount: z.number().nullable(),
		url: z.string().nullable(),
	})
});

export const collections = { cards, lyricStatuses, siteUpdates, highlights, books };
