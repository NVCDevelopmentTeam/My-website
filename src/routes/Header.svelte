<script>
  import { page } from '$app/stores';
  import { browser } from '$app/environment'
  import logo from '$lib/images/logo.png';
  import github from '$lib/images/github.svg';
  import Search from '$lib/components/Search.svelte';
  import Accessibility from '$lib/components/Accessibility.svelte';

  export let navMenu;
  let expanded = false;
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
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarResponsive"
      aria-controls="navbarResponsive"
      aria-expanded={expanded}
      aria-label="Toggle navigation"
      on:click={() => (expanded = !expanded)}
    >
      {navMenu}
      <span class="navbar-toggler-icon"></span>
      <svg viewBox="0 0 20 20" fill="none">
        <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
        <path d="M1 10L19 10" stroke="black" stroke-width="2" />
      </svg>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive" hidden={!expanded}>
      <ul id="main-menu" class="navbar-nav ml-auto">
        <li
          aria-current={
            $page.url.pathname === '/' ? 'page' : undefined
          }
        >
          <a id="home" accesskey="h" href="/">Home</a>
        </li>
        <li
          aria-current={
            $page.url.pathname === '/about' ? 'page' : undefined
          }
        >
          <a id="about" accesskey="a" href="/about">About</a>
        </li>
        <li
          aria-current={
            $page.url.pathname.startsWith('/blog') ? 'page' : undefined
          }
        >
          <a id="blog" accesskey="b" href="/blog">blog</a>
        </li>
        <li
          aria-current={
            $page.url.pathname === '/contact' ? 'page' : undefined
          }
        >
          <a id="contact" accesskey="c" href="/contact">contact</a>
        </li>
      </ul>
    </div>
  </nav>
<Search />
<accessibility />
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

  .site-logo {
    display: flex;
    align-items: center;
  }

  .corner {
    width: 3em;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1rem;
  }

  .nav-item li {
    list-style: none;
  }

  .nav-item a {
    color: #1d1d1f;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .navbar {
    background-color: #fff;
    color: #1d1d1f;
    font-weight: bold;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  #nav {
    display: flex;
    align-items: center;
    box-shadow: none;
  }

  .navbar-toggler {
    color: #1d1d1f;
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
  }

  .navbar-toggler svg {
    width: 20px;
    height: 20px;
  }

  .navbar-toggler span {
    display: none;
  }
  
  .collapsible {
    border-bottom: 1px solid var(--gray-light, #eee);
  }
  
  button {
    background-color: var(--background, #fff);
    color: var(--gray-darkest, #282828);
    display: flex;
		justify-content: space-between;
    width: 100%;
		border: none;
		margin: 0;
		padding: 1em 0.5em;
  }
  
  button[aria-expanded="true"] {
    border-bottom: 1px solid var(--gray-light, #eee);
  }

  button[aria-expanded="true"] .vert {
    display: none;
  }

  button:focus svg {
    outline: 2px solid;
  }

  button [aria-expanded="true"] rect {
    fill: currentColor;
  }

  svg {
    height: 0.7em;
		width: 0.7em;
  }
  
  .vert {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: #fff;
  }

  ul {
    margin: 0;
    padding-left: 0;
    display: flex;
    list-style: none;
  }

  li[aria-current='page']::before {
    content: '';
    height: 4px;
    width: 100%;
    background-color: #1d1d1f;
    position: absolute;
    bottom: -10px;
    left: 0;
  }
</style>

