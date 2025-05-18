// @ts-check
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"

import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
    site: "https://blake.earth",
    redirects: {
        "/highlights": "/library/highlights",
        "/highlights/books": "/highlights",
        "/highlights/tags": "/highlights",
    },
    integrations: [mdx(), sitemap()],

    vite: {
        plugins: [tailwindcss()],
    },
})
