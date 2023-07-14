<script context="module">
  export function preload({ error }) {
    error(404, new Error("Page not found"))
  }
</script>

<svelte:head>
  <title>404</title>
  <meta name="description" content="404" />
</svelte:head>

<main>
  <h1>Sorry</h1>
  <p>The page you visited does not exist.<br>Please try again later or <a href="/">go back to the home page</a></p>
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
    padding: 1rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.5rem;
    text-align: center;
  }

  a {
    color: #008aff;
    text-decoration: none;
    font-weight: bold;
  }
</style>
