<script context="module">
  export async function load({ error }) {
    error(404, 'Not Found');
  }
</script>

<svelte:head>
  <title>404 - Page Not Found</title>
  <meta name="description" content="The page you are looking for does not exist." />
</svelte:head>

<main>
  <h1>Sorry</h1>
  <p>The page you visited does not exist.<br>Please try again later or <a href="/">go back to the home page</a>.</p>
  <p>If you believe this is an error, you can <a href="/contact">contact us</a> for assistance.</p>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 4rem;
    font-weight: bold;
    color: #ff0000;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
