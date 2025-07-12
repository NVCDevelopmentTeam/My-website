<script>
    import { page } from '$app/stores';
    import { afterNavigate } from '$app/navigation';
    import logo from '$lib/images/logo.png';
    import Search from './Search.svelte';
    import AccessibilityMenu from './AccessibilityMenu.svelte';

    /**
     * @typedef {Object} Props
     * @property {string} [navMenu] - Svelte 5 props
     */

    /** @type {Props} */
    let { navMenu = 'Menu' } = $props();

    let expanded = $state(false); // Svelte 5 state

    function handleClickOutside(event) {
        const nav = document.getElementById('navbar');
        const button = event.target.closest('button');
        if (!button && nav && !nav.contains(event.target) && expanded) {
            expanded = false;
        }
    }

    afterNavigate(() => {
        expanded = false;
    });
</script>

<svelte:window onclick={handleClickOutside} />

<header id="top" class="sticky top-0 bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between px-4 py-2 lg:px-8">
            <!-- Logo section -->
            <a 
                href="/" 
                class="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
                <img src={logo} alt="Coding Nguyễn logo" class="h-10 w-auto" />
                <span class="sr-only">Home</span>
            </a>

            <!-- Skip links for accessibility -->
            <ul class="sr-only focus-within:not-sr-only absolute left-2 top-2 bg-white border rounded shadow p-2 space-y-1">
                <li><a class="focus:outline-none focus:ring" href="#nav">Skip to navigation</a></li>
                <li><a class="focus:outline-none focus:ring" href="#main">Skip to content</a></li>
                <li><a class="focus:outline-none focus:ring" href="#footer">Skip to footer</a></li>
            </ul>

            <!-- Search and accessibility -->
            <div class="flex items-center space-x-4">
                <AccessibilityMenu />
                <Search />
                
                <!-- Mobile menu button -->
                <button
                    type="button"
                    class="lg:hidden inline-flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    aria-expanded={expanded}
                    aria-controls="navbar"
                    aria-label="Toggle navigation menu"
                    onclick={() => (expanded = !expanded)}
                >
                    <span class="sr-only">{navMenu}</span>
                    <svg 
                        class="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        {#if expanded}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        {:else}
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        {/if}
                    </svg>
                </button>
            </div>
        </div>

        <!-- Navigation -->
        <nav 
            id="nav"
            class="lg:block"
            aria-label="Main navigation"
        >
            <ul
                id="navbar"
                class={`${
                    expanded ? 'block' : 'hidden'
                } lg:flex lg:items-center lg:justify-center overflow-hidden`}
            >
                {#each [
                    { href: '/', label: 'Home' },
                    { href: '/about', label: 'About' },
                    { href: '/blog', label: 'Blog' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/project', label: 'Project' }
                ] as link (link.href)}
                    <li>
                        <a
                            href={link.href}
                            aria-current={$page.url.pathname === link.href ? 'page' : undefined}
                            class={`block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500${$page.url.pathname === link.href ? ' bg-gray-100 font-medium' : ''}`}
                        >
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</header>
