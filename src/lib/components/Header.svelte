<script>
    import { page } from '$app/state'; // Svelte 5 state import
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
    let menuButtonRef = $state(null); // Reference to menu button

    function handleClickOutside(event) {
        const nav = document.getElementById('navbar');
        const button = event.target.closest('button');
        
        // More robust click outside detection
        if (!button && nav && !nav.contains(event.target) && expanded) {
            expanded = false;
        }
    }

    function toggleMenu() {
        expanded = !expanded;
        
        // Focus management for accessibility
        if (expanded) {
            // Focus first navigation link when menu opens
            setTimeout(() => {
                const firstLink = document.querySelector('#navbar a');
                if (firstLink) firstLink.focus();
            }, 0);
        }
    }

    // Close menu on navigation
    afterNavigate(() => {
        expanded = false;
    });

    // Handle escape key to close menu
    function handleKeydown(event) {
        if (event.key === 'Escape' && expanded) {
            expanded = false;
            // Return focus to menu button
            if (menuButtonRef) {
                menuButtonRef.focus();
            }
        }
    }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<header id="top" class="sticky top-0 bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between px-4 py-2 lg:px-8">
            <!-- Logo section -->
            <a 
                href="/" 
                class="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-md"
            >
                <img src={logo} alt="Coding Nguyễn logo" class="h-10 w-auto" />
                <span class="sr-only">Home</span>
            </a>

            <!-- Skip links for accessibility - improved z-index -->
            <ul class="sr-only focus-within:not-sr-only absolute left-2 top-2 bg-white border rounded shadow-lg p-2 space-y-1 z-[60]">
                <li>
                    <a 
                        class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 px-2 py-1 rounded" 
                        href="#nav"
                    >
                        Skip to navigation
                    </a>
                </li>
                <li>
                    <a 
                        class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 px-2 py-1 rounded" 
                        href="#main"
                    >
                        Skip to content
                    </a>
                </li>
                <li>
                    <a 
                        class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 px-2 py-1 rounded" 
                        href="#footer"
                    >
                        Skip to footer
                    </a>
                </li>
            </ul>

            <!-- Search and accessibility -->
            <div class="flex items-center space-x-4">
                <AccessibilityMenu />
                <Search />
                
                <!-- Mobile menu button -->
                <button
                    bind:this={menuButtonRef}
                    type="button"
                    class="lg:hidden inline-flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors"
                    aria-expanded={expanded}
                    aria-controls="navbar"
                    aria-label="Toggle navigation menu"
                    onclick={toggleMenu}
                >
                    <span class="sr-only">{navMenu}</span>
                    <svg 
                        class="w-6 h-6 transition-transform duration-200" 
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
                } lg:flex lg:items-center lg:justify-center bg-white lg:bg-transparent border-t lg:border-t-0 lg:pb-0 pb-2 transition-all duration-200 ease-in-out`}
                role="menubar"
                aria-orientation="horizontal"
            >
                {#each [
                    { href: '/', label: 'Home' },
                    { href: '/about', label: 'About' },
                    { href: '/blog', label: 'Blog' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/project', label: 'Project' }
                ] as link (link.href)}
                    <li role="none">
                        <a
                            href={link.href}
                            role="menuitem"
                            aria-current={page.url.pathname === link.href ? 'page' : undefined}
                            class={`block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                                page.url.pathname === link.href 
                                    ? 'bg-gray-100 font-medium text-blue-600' 
                                    : ''
                            }`}
                        >
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</header>