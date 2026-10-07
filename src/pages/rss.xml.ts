import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { site } from "../config/site";
import { getPosts, type Post } from "../lib/writing";

/** Feed readers resolve relative URLs against the feed, not the post, so make site-relative ones absolute. */
const absolutizeUrls = (html: string): string =>
  html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${site.url}/`);

function fullContent(post: Post): string {
  const html = post.rendered?.html;
  if (html === undefined) throw new Error(`rss: no rendered HTML for post "${post.id}"`);
  return absolutizeUrls(html);
}

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
      content: fullContent(post),
    })),
  });
};
