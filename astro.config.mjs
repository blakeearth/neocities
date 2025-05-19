// @ts-check
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"

import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
    site: "https://blake.earth",
    redirects: {
        "/highlights": "/library",
        "/highlights/books": "/library",
        "/highlights/tags": "/library",
    },
    integrations: [mdx(), sitemap()],

    vite: {
        plugins: [tailwindcss()],
    },
})
