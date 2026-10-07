import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { site } from "../config/site";
import { getPosts } from "../lib/writing";

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: `${site.name}: writing`,
    description: "Notes on building and shipping software.",
    site: context.site ?? site.url,
    trailingSlash: false,
    customData: "<language>en</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}`,
    })),
  });
};
