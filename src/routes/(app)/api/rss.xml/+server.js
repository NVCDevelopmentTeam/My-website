import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config';

/**
 * @typedef {Object} Post
 * @property {string} slug
 * @property {string} title
 * @property {string} author
 * @property {string} date
 * @property {string} excerpt
 */

/**
 * @typedef {Object} PostModule
 * @property {Post} metadata
 * @property {any} default
 */

export async function GET() {
	const data = await Promise.all(
		Object.entries(import.meta.glob('$lib/posts/*.md')).map(async ([path, pageModule]) => {
			const page = /** @type {PostModule} */ (await pageModule());
			const { metadata } = page;
			const slug = path.split('/').pop().split('.').shift();
			return { ...metadata, slug };
		})
	);

	const posts = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const rss = `
    <rss version="2.0">
      <channel>
        <title>${siteTitle}</title>
        <description>${siteDescription}</description>
        <link>${siteURL}</link>
        ${posts
					.map(
						(post) => `
            <item>
              <title>${post.title}</title>
              <description>${post.excerpt}</description>
              <link>${siteLink}/${post.slug}</link>
              <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            </item>`
					)
					.join('')}
      </channel>
    </rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml'
		}
	});
}
