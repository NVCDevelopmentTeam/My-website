<script>
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import logo from '$lib/images/logo.png';
	import Search from './Search.svelte';
	import AccessibilityMenu from './AccessibilityMenu.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {string} [navMenu]
	 */

	/** @type {Props} */
	let { navMenu = 'NavMenu' } = $props();
	let expanded = $state(false);
</script>

<header id="top">
	<div class="site-logo">
		<div class="corner">
			<a href="/">
				<img src={logo} alt="Coding Nguyễn" />
			</a>
		</div>
		<ul class="nav-item">
			<li>
				<a class="skip" href="#nav">Skip to main navigation</a>
			</li>
			<li>
				<a class="skip" href="#main">Skip to main content</a>
			</li>
			<li>
				<a class="skip" href="#footer">Skip to footer</a>
			</li>
		</ul>
	</div>
	<nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top" id="nav">
		<button
			class="navbar-toggler"
			type="button"
			data-toggle="collapse"
			data-target="#navbarResponsive"
			aria-controls="navbarResponsive"
			aria-expanded={expanded}
			aria-label="Toggle navigation"
			onclick={() => (expanded = !expanded)}
		>
			{navMenu}
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarResponsive" hidden={!expanded}>
			<ul id="main-menu" class="navbar-nav ml-auto">
				<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="/about">About</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/blog') ? 'page' : undefined}>
					<a href="/blog">blog</a>
				</li>
				<li aria-current={page.url.pathname === '/contact' ? 'page' : undefined}>
					<a href="/contact">contact</a>
				</li>
				<li aria-current={page.url.pathname === '/Portfolio' ? 'page' : undefined}>
					<a href="/Portfolio">Portfolio</a>
				</li>
				<li aria-current={page.url.pathname === '/project' ? 'page' : undefined}>
					<a href="/project">project</a>
				</li>
			</ul>
		</div>
	</nav>
	<div class="search-accessibility">
		<AccessibilityMenu />
		<Search />
	</div>
</header>
