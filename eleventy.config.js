import pluginWebc from "@11ty/eleventy-plugin-webc";
import { InputPathToUrlTransformPlugin } from "@11ty/eleventy";

import pluginFilters from "./_config/filters.js";

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default function (eleventyConfig) {
	eleventyConfig.ignores.add("README.md");

	eleventyConfig.addPlugin(pluginWebc, {
		components: [
			"./_components/**/*.webc",
			"npm:@11ty/is-land/*.webc"
		]
	});

	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

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
		const year = date.getUTCFullYear().toString();
		const month = monthText[date.getUTCMonth()];
		const day = date.getUTCDate().toString();
		return `${month} ${day}, ${year}`;
	}


	eleventyConfig.addLiquidFilter("toReadableDate", toReadableDate);
	eleventyConfig.addNunjucksFilter("toReadableDate", toReadableDate);

	return {
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
		},
	}
};
