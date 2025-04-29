<script>
  import { page } from '$app/state';
  import { siteAuthor } from '$lib/data/config';
import LiveChat from './LiveChat.svelte';
  import { onMount } from 'svelte';

  let year = $state();

  onMount(() => {
    year = new Date().getFullYear();
  });
</script>

<div class="site-footer">
  <footer class="site-info" aria-label="Site" itemtype="" itemscope>
<nav>
<ul>
        <li aria-current={page.url.pathname === '/privacy-policy' ? 'page' : undefined}>
          <a href="/privacy-policy">privacy policy</a>
        </li>
        <li aria-current={page.url.pathname === '/accessibility-statement' ? 'page' : undefined}>
          <a href="/accessibility-statement">accessibility statement</a>
        </li>
</ul>    
</nav>
    <div class="inside-site-info grid-container" id="footer">
  <div class="copyright-bar">
        © {year, siteAuthor} all rights reserved
      </div>
    </div>
  </footer>
</div>

<a class="back" href="#top">back to top</a>
<LiveChat />
