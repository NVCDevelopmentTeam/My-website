    <script>
        import { page } from '$app/stores';
        import logo from '$lib/images/logo.png';
        import github from '$lib/images/github.svg';
    </script>

<header>
    <!-- Navbar -->
    <div class="site-logo">
        <div class="corner">
            <a href="/">
                <img src={logo} alt="Coding Nguyễn" />
            </a>
        </div>
        <ul class="nav-item">
            <li class="nav-item" id="nav-item">
                <a href="#nav" class="skip">Skip to main navigation</a>
            </li>
            <li class="nav-item" id="nav-item">
                <a href="#main" class="skip">Skip to main content</a>
            </li>
            <li class="nav-item" id="nav-item">
                <a href="#footer" class="skip">Skip to footer</a>
            </li>
        </ul>

    </div>
    <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top" id="nav">
        <svg viewBox="0 0 2 3" aria-hidden="true">
            <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
        </svg>
            <div class="inside-header grid-container">
                <button class="navbar-toggler"
                        type="button"
on:click={toggleMenu}
						                        data-bs-toggle="collapse"
                        data-bs-target="#navmenu"
                        aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navmenu">
                    <ul class="navbar-nav ms-auto">
                        <li>
                            <a accesskey="h" class="nav-link" href="/" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>home</a>
                        </li>
                        <li>
                            <a accesskey="a" class="nav-link" href="/about" aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>about</a>
                        </li>
                        <li>
                            <a accesskey="p" class="nav-link" href="/posts" aria-current={$page.url.pathname.startsWith('/posts') ? 'page' : undefined}>posts</a>
                        </li>
                    </ul>
                    <svg viewBox="0 0 2 3" aria-hidden="true">
                        <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
                    </svg>
                </div>
</div>
    </nav>
    <div class="corner">
        <a href="https://github.com/sveltejs/kit">
            <img src={github} alt="GitHub" />
        </a>
    </div>
</header>

    <style>
        header {
            display: flex;
            justify-content: space-between;
        }
        .corner {
            width: 3em;
            height: 3em;
        }
        .corner a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
        .corner img {
            width: 2em;
            height: 2em;
            object-fit: contain;
        }
        nav {
            display: flex;
            justify-content: center;
            --background: rgba(255, 255, 255, 0.7);
        }
        svg {
            width: 2em;
            height: 3em;
            display: block;
        }
        path {
            fill: var(--background);
        }
        ul {
            position: relative;
            padding: 0;
            margin: 0;
            height: 3em;
            display: flex;
            justify-content: center;
            align-items: center;
            list-style: none;
            background: var(--background);
            background-size: contain;
        }
        li {
            position: relative;
            height: 100%;
        }
        li[aria-current='page']::before {
            --size: 6px;
            content: '';
            width: 0;
            height: 0;
            position: absolute;
            top: 0;
            left: calc(50% - var(--size));
            border: var(--size) solid transparent;
            border-top: var(--size) solid var(--color-theme-1);
        }
        nav a {
            display: flex;
            height: 100%;
            align-items: center;
            padding: 0 0.5rem;
            color: var(--color-text);
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            transition: color 0.2s linear;
        }
        a:hover {
            color: var(--color-theme-1);
        }
    </style>