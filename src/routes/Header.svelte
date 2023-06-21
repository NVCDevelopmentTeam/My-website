<script>
  import { page } from '$app/stores';
  import logo from '$lib/images/logo.png';
  import github from '$lib/images/github.svg';
  import classnames from 'classnames';

  const cx = classnames.bind();

  let isMenuCollapsed = true;

  function toggleMenu() {
    isMenuCollapsed = !isMenuCollapsed;
    const navbar = document.getElementById('navbarNav');
    if (isMenuCollapsed) {
      navbar.classList.add('collapsed'); // Add the class "collapsed" to hide the menu
    } else {
      navbar.classList.remove('collapsed'); // Remove the class "collapsed" to show the menu
    }
  }
</script>

<header id="top">
  <div class="site-logo">
    <div class="corner">
      <a href="/">
        <img src={logo} alt="Coding Nguyễn" />
      </a>
    </div>
    <ul class="nav-item">
      <li class="nav-item">
        <a class="skip" href="#nav">Skip to main navigation</a>
      </li>
      <li class="nav-item">
        <a class="skip" href="#main">Skip to main content</a>
      </li>
      <li class="nav-item">
        <a class="skip" href="#footer">Skip to footer</a>
      </li>
    </ul>
  </div>
  <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top" id="nav">
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <button class="navbar-toggler" type="button" on:click={toggleMenu} aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="{cx('collapse', 'navbar-collapse', { collapsed: isMenuCollapsed })}" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-menu">
          <a class="nav-link" href="/" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>home</a>
        </li>
        <li class="nav-menu">
          <a class="nav-link" href="/about" aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>about</a>
        </li>
        <li class="nav-menu">
          <a class="nav-link" href="/blog" aria-current={($page.url.pathname.startsWith('/blog')) ? 'page' : undefined}>blog</a>
        </li>
        <li class="nav-menu">
          <a class="nav-link" href="/contact" aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}>contact</a>
        </li>
      </ul>
    </div>
    <div class="corner">
      <a href="https://github.com/sveltejs/kit">
        <img src={github} alt="GitHub" />
      </a>
    </div>

  </nav>
</header>

<style>
  :root {
    --color-theme-1: #007bff;
  }

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
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
    flex-wrap: wrap;
  }

  @media (min-width: 992px) {
    ul {
      height: 3em;
    }
  }

  li {
    position: relative;
    height: 100%;
    white-space: nowrap;
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
    padding: 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  .collapse {
    height: 0;
    transition: height 0.35s ease;
    overflow: hidden;
  }

  .collapse:not(.collapsed) {
    height: auto;
  }

  .nav-link {
    display: block;
    padding: 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  .nav-link:hover {
    color: var(--color-theme-1);
  }

  .collapsed {
    height: 0;
  }
</style>
