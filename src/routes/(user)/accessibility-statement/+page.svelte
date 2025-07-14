<script>
	import { siteTitle } from '$lib/data/config';
	const pageTitle = 'Accessibility Statement';
	const description = 'This is accessibility page';
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="container mx-auto px-4 py-16">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-4xl font-bold text-center mb-8">{pageTitle}</h1>
		<div class="prose dark:prose-invert max-w-none">
			<p>
				We are committed to making our website accessible to everyone. This statement outlines the
				accessibility features of our website and our efforts to ensure a positive experience for
				all users.
			</p>
			<h2>Accessibility Features</h2>
			<ul>
				<li>
					<strong>Semantic HTML:</strong> We use semantic HTML to provide a clear and logical structure
					for assistive technologies.
				</li>
				<li>
					<strong>Keyboard Navigation:</strong> All interactive elements are navigable and operable using
					a keyboard.
				</li>
				<li>
					<strong>Alt Text for Images:</strong> All meaningful images have descriptive alt text.
				</li>
				<li>
					<strong>Color Contrast:</strong> We strive to maintain sufficient color contrast for readability.
				</li>
				<li>
					<strong>Responsive Design:</strong> Our website is designed to be accessible on various devices
					and screen sizes.
				</li>
			</ul>
			<h2>Feedback</h2>
			<p>
				We are continuously working to improve the accessibility of our website. If you encounter
				any accessibility barriers or have suggestions for improvement, please contact us at <a
					href="mailto:your-email@example.com"
					class="text-blue-600 hover:underline">your-email@example.com</a
				>.
			</p>
		</div>
	</div>
</div>
