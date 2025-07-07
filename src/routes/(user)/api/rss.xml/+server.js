import { siteTitle, siteDescription, siteURL, siteLink } from '$lib/data/config';

export async function GET() {
	const data = await Promise.all(
		Object.entries(import.meta.glob('$lib/posts/*.md')).map(async ([path, page]) => {
			const { metadata } = await page();
			const slug = path.split('/').pop().split('.').shift();
			return { ...metadata, slug };
		})
	);

	const posts = data.sort((a, b) => new Date(b.date) - new Date(a.date));

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
