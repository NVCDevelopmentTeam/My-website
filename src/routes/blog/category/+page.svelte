<script context="module">
  export let category;
  export let posts;
  // Fetch blog posts by category from an API or database
  export async function load({ params }) {
    const { category } = params;
    const response = await fetch(`/api/posts?category=${category}`);
    const posts = await response.json();
    return {
      props: {
        category,
        posts
      }
    };
  }
</script>

<svelte:head>
  <title>{category} Category</title>
  <meta name="description" content="My website" />
</svelte:head>

<main>
  <h1>Welcome to the {category} category page</h1>
  <p>Here's a list of all the posts in this category:</p>
  <ul>
    {#each posts as post}
      <li>{post.title}</li>
    {/each}
  </ul>
</main>

<style>
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style:none;
  }

  li {
    margin-bottom: 0.5rem;
  }
</style>
