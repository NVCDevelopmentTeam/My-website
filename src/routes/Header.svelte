<script>
  import { page } from '$app/stores';
  import { browser } from '$app/environment'
  import logo from '$lib/images/logo.png';
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
      on:click={() => expanded = !expanded}>
      {navMenu}
      <svg viewBox="0 0 20 20" fill="none">
        <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
        <path d="M1 10L19 10" stroke="black" stroke-width="2" />
      </svg>
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive" hidden={!expanded}>
      <ul id="main-menu" class="navbar-nav ml-auto">
        <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
          <a accesskey="h" href="/">Home</a>
        </li>
        <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
          <a accesskey="a" href="/about">About</a>
        </li>
        <li aria-current={$page.url.pathname.startsWith('/blog') ? 'page' : undefined}>
          <a accesskey="b" href="/blog">blog</a>
        </li>
        <li aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}>
          <a accesskey="c" href="/contact">contact</a>
        </li>
      </ul>
      <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
      </svg>
    </div>
  </nav>
  <div class="search-accessibility">
    <Search />
    <Accessibility />
  </div>
</header>
<style> #top { display: flex; align-items: center; background-color: #fff; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); padding: 1rem; position: fixed; top: 0; left: 0; right: 0; z-index: 999; } .site-logo { display: flex; align-items: center; } .corner { margin-right: 1rem; } .corner a { display: block; } .nav-item { display: flex; align-items: center; list-style: none; margin: 0; padding: 0; } .nav-item li { margin-right: 0.5rem; } .nav-item li:last-child { margin-right: 0; } .skip { position: absolute; left: -9999px; } .navbar { display: flex; align-items: center; justify-content: space-between; background-color: #343a40; padding: 0.75rem 1.5rem; } .navbar svg { width: 1.5rem; height: 2.25rem; fill: #fff; margin-right: 1rem; } .navbar-toggler { border: none; background: none; cursor: pointer; outline: none; display: flex; align-items: center; } .navbar-toggler svg.vert { stroke: #fff; stroke-width: 2; } .navbar-toggler svg.vert path { stroke: #000; } .navbar-toggler .navbar-toggler-icon { width: 1.25rem; height: 1.25rem; background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23fff"%3E%3Cpath stroke="%23000" stroke-width="4" stroke-linecap="round" d="M2.5 7.5h15M2.5 12.5h15"%3E%3C/path%3E%3C/svg%3E'); background-repeat: no-repeat; background-size: contain; } .collapse { display: flex; flex-direction: column; align-items: center; background-color: #343a40; padding: 1rem; transition: height 0.3s ease-out; height: 0; overflow: hidden; } #navbarResponsive[hidden] { height: auto !important; } #main-menu { display: flex; align-items: center; list-style: none; margin: 0; padding: 0; margin-top: 1rem; } #main-menu li { margin-bottom: 0.75rem; } #main-menu li:last-child { margin-bottom: 0; } #main-menu a { color: #fff; text-decoration: none; font-size: 1.2rem; transition: opacity 0.3s ease; } #main-menu a:hover { opacity: 0.8; } .search-accessibility { display: flex; align-items: center; margin-left: 1.5rem; } </style>
