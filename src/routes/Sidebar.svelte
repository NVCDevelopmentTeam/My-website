<script>
  let links = [
    { text: 'Home', slug: '/' },
    { text: 'About', slug: '/about' },
    { text: 'Blog', slug: '/blog' },
    { text: 'Contact', slug: '/contact' }
	  ];

  function handleClick(link) {
    console.log('Clicked on', link.text, link.slug);
  }
</script>

<sidebar>
  <ul>
    {#each links as link}
      <li>
        <a href={link.slug} on:click={(e) => {
          e.preventDefault();
          handleClick(link);
        }}>{link.text}</a>
      </li>
    {/each}
  </ul>
</sidebar>

<style>
  sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 20%;
    padding: 24px;
    background-color: #f2f2f2;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 24px;
  }

  a {
    display: block;
    text-decoration: none;
    font-weight: bold;
    color: #333;
    transition: all 0.3s ease;
  }

  a:hover {
    color: #000;
  }
</style>
