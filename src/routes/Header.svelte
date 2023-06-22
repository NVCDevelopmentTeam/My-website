<script> 
import { page } from '$app/stores';
import logo from '$lib/images/logo.png';
import github from '$lib/images/github.svg';
import classnames from 'classnames';
const cx = classnames.bind();

let isMenuCollapsed = true;
let navbar;

function toggleMenu() {
  isMenuCollapsed = !isMenuCollapsed;
  if (isMenuCollapsed) {
    navbar.classList.add('collapsed');
  } else {
    navbar.classList.remove('collapsed');
  }
}
</script>
 <header id="top"> <div class="site-logo"> <div class="corner"> <a href="/"> <img src={logo} alt="Coding Nguyễn" /> </a> </div> <ul class="nav-item"> <li class="nav-item"> <a class="skip" href="#nav">Skip to main navigation</a> </li> <li class="nav-item"> <a class="skip" href="#main">Skip to main content</a> </li> <li class="nav-item"> <a class="skip" href="#footer">Skip to footer</a> </li> </ul> </div> <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 fixed-top" id="nav"> <svg viewBox="0 0 2 3" aria-hidden="true"> <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" /> </svg> <button class="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" on:click={toggleMenu}>
<span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarNav">
 <ul class="navbar-nav ms-auto"> <li class="nav-menu"> <a class={cx({ 'nav-link': true, active: $page.url.pathname === '/' })} href="/" aria-current={$page.url.pathname === '/' ? 'page' : undefined} > home </a> </li> <li class="nav-menu"> <a class={cx({ 'nav-link': true, active: $page.url.pathname === '/about' })} href="/about" aria-current={$page.url.pathname === '/about' ? 'page' : undefined} > about </a> </li> <li class="nav-menu"> <a class={cx({ 'nav-link': true, active: $page.url.pathname.startsWith('/blog') })} href="/blog" aria-current={($page.url.pathname.startsWith('/blog')) ? 'page' : undefined} > blog </a> </li> <li class="nav-menu"> <a class={cx({ 'nav-link': true, active: $page.url.pathname === '/contact' })} href="/contact" aria-current={$page.url.pathname === '/contact' ? 'page' : undefined} > contact </a> </li> </ul> </div> <div class="corner"> <a href="https://github.com/sveltejs/kit"> <img src={github} alt="GitHub" /> </a> </div> </nav> </header> <style> :root { --color-theme-1: #007bff; --color-background: rgba(255, 255, 255, 0.7); --color-text: #fff; } header { display: flex; justify-content: space-between; } .corner { width: 3em; height: 3em; display: flex; align-items: center; justify-content: center; } .corner img { width: 2em; height: 2em; object-fit: contain; } .site-logo { display: flex; align-items: center; justify-content: space-between; } .nav-item { display: flex; flex-wrap: wrap; align-items: center; margin-left: 1rem; } .nav-item .nav-item { margin-left: 2rem; } .nav-link { display: block; padding: 0.5rem; color: var(--color-text); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; transition: color 0.2s linear; } .nav-link.active { color: var(--color-theme-1); border-bottom: 2px solid var(--color-theme-1); } .nav-link:hover { color: var(--color-theme-1); } nav { display: flex; justify-content: center; background: var(--color-background); } svg { width: 2em; height: 3em; display: block; } path { fill: var(--color-background); } ul { padding: 0; margin: 0; display: flex; justify-content: center; align-items: center; list-style: none; flex-wrap: wrap; height: 3em; } li { position: relative; height: 100%; white-space: nowrap; } li[aria-current='page']:: performance { --size: 6px; content: ''; width: 0; height: 0; position: absolute; top: 0; left: calc(50% - var(--size)); border: var(--size) solid transparent; border-top: var(--size) solid var(--color-theme-1); } .collapse { height: 0; transition: height 0.35s ease; overflow: hidden; } .collapse:not(.collapsed) { height: auto; } .collapsed { height: 0; } @media (max-width: 991px) { .nav-item { position: absolute; top: 4rem; left: 0; z-index: 10; width: 100%; box-shadow: 0 2px 6px 0 rgba(0,0,0,.2); background: var(--color-background); } .nav-item.collapsed { display: none; } .navbar-toggler { display: flex; } .nav-menu { display: block; text-align: center; margin-top: 1rem; } } </style>