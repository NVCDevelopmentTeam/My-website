<script>
  let darkMode = false;

  function toggle() {
    darkMode = !darkMode;
    window.document.body.classList.toggle('dark');
  }
</script>

<button class="dark mode" type="button"
  data-toggle="darkMode"
  data-target="darkMode"
  aria-controls="darkMode"
  aria-pressed={darkMode}
  aria-checked={darkMode}
  aria-label="Dark mode"
  on:click={toggle}>
  <svg viewBox="0 0 20 20" fill="none">
    <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
    <path d="M1 10L19 10" stroke="black" stroke-width="2" />
  </svg>
  <span class="navbar-toggler-icon"></span>
  {#if darkMode }
    Go light
  {:else}
    Go dark
  {/if}
</button>

<style>
  button {
    background: var(--bg-color);
    border: 2px solid var(--text-color);
    border-radius: 5px;
    color: var(--text-color);
    padding: 10px 15px;
  }

  button:active {
    background: inherit;
  }
</style>