import { file, glob } from 'astro/loaders';
import highlightData from '../src/data/highlights/highlights.json';
import updateData from '../src/data/site_updates/site-updates.json';
import lyricData from '../src/data/lyric_statuses/lyric-statuses.json';
import { defineCollection, z } from 'astro:content';

const cards = defineCollection({
	loader: glob({ base: './src/content/cards', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		draft: z.boolean().optional(),
	}),
});

const lyricStatuses = defineCollection({
	loader: () => {
		const response = lyricData.lyric_statuses;
		return response.map((l, index) => { return { ...l, id: index.toString() } });
	}, 
	schema: z.object({
		emoji: z.string(),
		text: z.string(),
		date: z.coerce.date().nullable().optional(),
		attribution: z.string(),
	})
});

const siteUpdates = defineCollection({
	loader: () => {
		const response = updateData.site_updates;
		return response.map((u, index) => { return { ...u, id: index.toString() } });
	},
	schema: z.object({
		text: z.string(),
		date: z.coerce.date().nullable().optional(),
	})
});

const highlights = defineCollection({
	loader: () => {
		const response = highlightData.highlights;
		return response.map((h, index) => { return { ...h, tags: h.tag.toString(), id: index.toString() } });
	},
	schema: z.object({
		text: z.string(),
		source: z.string(),
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
