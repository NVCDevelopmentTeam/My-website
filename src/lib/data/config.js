/**
 * All of these values are used throughout the site – for example,
 * in the <meta> tags, in the footer, and in the RSS feed.
 *
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/

export const siteTitle = 'Coding Nguyễn';
export const siteDescription = 'Built with the SvelteKit Static Blog Starter';
export const siteURL = 'codingnguyen.com';
export const siteLink = '';
export const siteAuthor = 'Coding Nguyễn';

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 10;

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'Blog',
		route: '/blog'
	},
	{
		title: 'About',
		route: '/about'
	},
	{
		title: 'Contact',
		route: '/contact'
	}
];
export const config = {
	title: 'Coding Nguyễn',
	logo: '/logo.png', // Path to your logo
	navLinks: [
		{ title: 'Trang chủ', href: '/' },
		{ title: 'Giới thiệu', href: '/about' },
		{ title: 'Blog', href: '/blog' },
		{ title: 'Liên hệ', href: '/contact' }
	],
	socialLinks: {
		twitter: 'your_twitter_handle',
		instagram: 'your_instagram_handle',
		github: 'your_github_handle',
		linkedin: 'your_linkedin_handle'
	}
};
