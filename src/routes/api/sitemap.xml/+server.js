import fetchPosts from '$lib/data/fetchPosts';
import { siteURL } from '$lib/data/config';

// Export the sitemap.xml file name
export const prerender = true;

/**
 * Generates the post URL based on the slug.
 * @param {string} slug - The slug of the post.
 * @returns {string} - The full URL of the post.
 */
const getPostUrl = (slug) => `${siteURL}/post/${slug}`;

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
  // Fetch all posts
  const { posts } = await fetchPosts();

  // Generate the XML string for the sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      <url>
        <loc>${siteURL}</loc>
        <priority>1.0</priority>
      </url>

      ${posts
        .map(
          (post) => `<url>
            <loc>${getPostUrl(post.slug)}</loc>
            <lastmod>${
              post.updated
                ? new Date(post.updated).toISOString()
                : new Date(post.date).toISOString()
            }</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          </url>`
        )
        .join('')}
    </urlset>`;

  // Return the XML response
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-max-age=600',
    },
  });
}
