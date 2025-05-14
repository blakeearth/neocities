import pluginWebc from "@11ty/eleventy-plugin-webc";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import tailwindcss from '@tailwindcss/postcss';
import fs from 'fs';
import path from 'path';

import cssnano from 'cssnano';
import postcss from 'postcss';
import pluginFilters from "./_config/filters.js";

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default function (eleventyConfig) {
	eleventyConfig.ignores.add("README.md");
	eleventyConfig.ignores.add("./_includes/layouts/css/tailwind.css");

	eleventyConfig.addPlugin(pluginWebc, {
		components: [
			"./_components/**/*.webc",
			"npm:@11ty/is-land/*.webc"
		]
	});

	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "card",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "blake.earth",
			base: "https://blake.earth/",
			author: {
				name: "blake earth",
			}
		}
	});

	eleventyConfig.setServerOptions({
		domDiff: false
	});

	eleventyConfig.addPassthroughCopy("assets");

	eleventyConfig.addPassthroughCopy({ 'content/robots.txt': '/robots.txt' });

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addCollection("tagsList", function (collectionApi) {
		const tagsList = new Set();
		collectionApi.getAll().map(item => {
			if (item.data.tags) { // handle pages that don't have tags
				item.data.tags.map(tag => {if (tag !== "card") tagsList.add(tag)})
			}
		});
		return tagsList;
	});

	const monthText = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	function toReadableDate(date) {
		date = new Date(date);
		const year = date.getUTCFullYear().toString();
		const month = monthText[date.getUTCMonth()];
		const day = date.getUTCDate().toString();
		return `${month} ${day}, ${year}`;
	}

	eleventyConfig.addNunjucksFilter("toReadableDate", toReadableDate);

	function getPostTags(array) {
		return array.filter((tagName) => {return !tagName.includes('card')});
	}
	eleventyConfig.addNunjucksFilter("getPostTags", getPostTags);

	eleventyConfig.on('eleventy.before', async () => {
		const tailwindInputPath = path.resolve('./assets/styles/tailwind.css');

		const tailwindOutputPath = './_includes/layouts/css/tailwind.css';

		const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');

		const outputDir = path.dirname(tailwindOutputPath);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		const result = await processor.process(cssContent, {
			from: tailwindInputPath,
			to: tailwindOutputPath,
		});

		fs.writeFileSync(tailwindOutputPath, result.css);
	});

	const processor = postcss([
	//compile tailwind
	tailwindcss(),

	//minify tailwind css
	cssnano({
		preset: 'default',
	}),
	]);

	return {
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
		},
	}
};
