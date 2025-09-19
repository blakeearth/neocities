import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts"

export async function GET(context) {
    const posts = await getCollection(
        "cards",
        ({ data }) => data.draft !== true
    )
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: posts
            .sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate))
            .map((post) => ({
                title: post.data.title,
                description:
                    post.data.description ??
                    post.body.substring(0, 499) + "...",
                link: `/cards/${post.id}/`,
            })),
    })
}
