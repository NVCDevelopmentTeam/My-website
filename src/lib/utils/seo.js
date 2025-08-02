import { browser } from 

// Generate dynamic meta tags
export function generateMetaTags(data) {
	const {
		title = 'Coding Nguyễn',
		description = 'Website cá nhân và blog về lập trình, accessibility và công nghệ',
		keywords = 'lập trình, accessibility, a11y, web development, svelte, javascript',
		author = 'Coding Nguyễn',
		url = 'https://codingNguyen.com',
		image = '/og-image.jpg',
		type = 'website',
		locale = 'vi_VN'
	} = data;

	return {
		title,
		description,
		keywords,
		author,
		canonical: url,
		openGraph: {
			title,
			description,
			url,
			image,
			type,
			locale,
			siteName: 'Coding Nguyễn'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			image,
			creator: '@codingNguyen'
		}
	};
}

// Generate structured data (JSON-LD)
export function generateStructuredData(data) {
	const {
		type = 'WebSite',
		name = 'Coding Nguyễn',
		url = 'https://codingNguyen.com',
		description = 'Website cá nhân và blog về lập trình, accessibility và công nghệ',
		author = {
			'@type': 'Person',
			name: 'Coding Nguyễn',
			url: 'https://codingNguyen.com/about'
		},
		publisher = {
			'@type': 'Person',
			name: 'Coding Nguyễn',
			url: 'https://codingNguyen.com'
		}
	} = data;

	const baseStructure = {
		'@context': 'https://schema.org',
		'@type': type,
		name,
		url,
		description,
		author,
		publisher,
		inLanguage: 'vi-VN',
		potentialAction: {
			'@type': 'SearchAction',
			target: `${url}/search-results?q={search_term_string}`,
			'query-input': 'required name=search_term_string'
		}
	};

	// Add specific properties based on type
	if (type === 'BlogPosting') {
		return {
			...baseStructure,
			'@type': 'BlogPosting',
			headline: data.title,
			datePublished: data.datePublished,
			dateModified: data.dateModified || data.datePublished,
			image: data.image,
			articleBody: data.content,
			wordCount: data.wordCount,
			keywords: data.keywords
		};
	}

	if (type === 'Person') {
		return {
			...baseStructure,
			'@type': 'Person',
			jobTitle: 'Web Developer & Accessibility Specialist',
			knowsAbout: ['Web Development', 'Accessibility', 'JavaScript', 'Svelte', 'A11y Testing'],
			sameAs: data.socialLinks || []
		};
	}

	return baseStructure;
}

// Generate XML sitemap
export function generateSitemap(pages) {
	const baseUrl = 'https://codingNguyen.com';
	const currentDate = new Date().toISOString().split('T')[0];

	const urls = pages.map(page => {
		const priority = page.priority || (page.url === '/' ? '1.0' : '0.8');
		const changefreq = page.changefreq || 'weekly';
		const lastmod = page.lastmod || currentDate;

		return `
		<url>
			<loc>${baseUrl}${page.url}</loc>
			<lastmod>${lastmod}</lastmod>
			<changefreq>${changefreq}</changefreq>
			<priority>${priority}</priority>
		</url>`;
	}).join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls}
</urlset>`;
}

// Generate robots.txt
export function generateRobotsTxt(options = {}) {
	const {
		userAgent = '*',
		disallow = [],
		allow = [],
		sitemap = 'https://codingNguyen.com/sitemap.xml',
		crawlDelay = null
	} = options;

	let robotsTxt = `User-agent: ${userAgent}\n`;

	if (disallow.length > 0) {
		disallow.forEach(path => {
			robotsTxt += `Disallow: ${path}\n`;
		});
	}

	if (allow.length > 0) {
		allow.forEach(path => {
			robotsTxt += `Allow: ${path}\n`;
		});
	}

	if (crawlDelay) {
		robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
	}

	robotsTxt += `\nSitemap: ${sitemap}`;

	return robotsTxt;
}

// Validate SEO requirements
export function validateSEO(data) {
	const errors = [];
	const warnings = [];

	// Required fields
	if (!data.title || data.title.length === 0) {
		errors.push('Title is required');
	} else if (data.title.length > 60) {
		warnings.push('Title should be under 60 characters for optimal display');
	}

	if (!data.description || data.description.length === 0) {
		errors.push('Description is required');
	} else if (data.description.length > 160) {
		warnings.push('Description should be under 160 characters for optimal display');
	}

	if (!data.keywords || data.keywords.length === 0) {
		warnings.push('Keywords are recommended for better SEO');
	}

	if (!data.canonical) {
		warnings.push('Canonical URL is recommended');
	}

	// Image validation
	if (data.image && !data.image.startsWith('http') && !data.image.startsWith('/')) {
		warnings.push('Image URL should be absolute or start with /');
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
}

// Social sharing URLs
export function getSocialSharingUrls(data) {
	const { url, title, description } = data;
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedDescription = encodeURIComponent(description);

	return {
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
		linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
		pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
		reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
		telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
		whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
	};
}

// Track analytics events
export function trackAnalytics(event, data = {}) {
	if (!browser) return;

	// Google Analytics 4
	if (typeof gtag !== 'undefined') {
		gtag('event', event, data);
	}

	// Google Tag Manager
	if (typeof dataLayer !== 'undefined') {
		dataLayer.push({
			event,
			...data
		});
	}

	// Custom analytics
	console.log('Analytics Event:', event, data);
}

// SEO-friendly URL slug generation
export function generateSlug(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-'); // Remove multiple hyphens
}

// Calculate reading time
export function calculateReadingTime(content) {
	const wordsPerMinute = 200;
	const words = content.trim().split(/\s+/).length;
	const readingTime = Math.ceil(words / wordsPerMinute);
	return readingTime;
}

// Extract excerpt from content
export function extractExcerpt(content, maxLength = 160) {
	const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
	if (plainText.length <= maxLength) {
		return plainText;
	}
	return plainText.substring(0, maxLength).trim() + '...';
}

