// @ts-check
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"

import tailwindcss from "@tailwindcss/vite"
import AutoImport from "astro-auto-import"

// https://astro.build/config
export default defineConfig({
    site: "https://blake.earth",
    redirects: {
        "/highlights": "/library",
        "/highlights/books": "/library",
        "/highlights/tags": "/library",
    },
    integrations: [
        AutoImport({
            imports: [
                "./src/components/Highlight.astro",
                "./src/components/Quote.astro",
                "./src/components/YouTube.astro",
            ],
        }),
        mdx(),
        sitemap(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
})
