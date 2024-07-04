<script>
  import { onMount } from 'svelte';

  let darkMode = false;
  let fontSize = 10;
  let contrast = false;
  let colorFilters = false;

  function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
  }

  function increaseFontSize() {
    fontSize++;
  }

  function decreaseFontSize() {
    fontSize--;
  }

  function toggleContrast() {
    contrast = !contrast;
  }

  function toggleColorFilters() {
    colorFilters = !colorFilters;
  }

  onMount(() => {
    document.body.classList.toggle('dark', darkMode);
  });
</script>

<button class="dark-mode" type="button"
  aria-controls="darkMode"
  aria-label="Dark mode"
  on:click={toggleDarkMode}>
  <svg viewBox="0 0 20 20" fill="none">
    <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
    <path d="M1 10L19 10" stroke="black" stroke-width="2" />
  </svg>
  <span class="navbar-toggler-icon"></span>
  {#if darkMode}
    Go light
  {:else}
    Go dark
  {/if}
</button>

<button on:click={increaseFontSize}>Increase font size</button>
<button on:click={decreaseFontSize}>Decrease font size</button>
<p style="font-size: {fontSize + 'px'}">Font size is: {fontSize}</p>

<button class="contrast" type="button"
  aria-controls="contrast"
  aria-label="Contrast"
  on:click={toggleContrast}
  style="--bg-color: {contrast ? '#000' : '#fff'}; --text-color: {contrast ? '#fff' : '#000'};">
  <svg viewBox="0 0 20 20" fill="none">
    <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
    <path d="M1 10L19 10" stroke="black" stroke-width="2" />
  </svg>
  <span class="navbar-toggler-icon"></span>
  {#if contrast}
    High contrast
  {:else}
    Low contrast
  {/if}
</button>

<button class="color-filters" type="button"
  aria-controls="colorFilters"
  aria-label="Color filters"
  on:click={toggleColorFilters}
  style="filter: {colorFilters ? 'invert(1)' : 'none'};">
  <svg viewBox="0 0 20 20" fill="none">
    <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
    <path d="M1 10L19 10" stroke="black" stroke-width="2" />
  </svg>
  <span class="navbar-toggler-icon"></span>
  {#if colorFilters}
    Default filters
  {:else}
    Change filters
  {/if}
</button>

<style>
  :global(body.dark) {
    background: #333;
    color: #fff;
  }

  button {
    background: var(--bg-color, #fff);
    border: 2px solid var(--text-color, #000);
    border-radius: 5px;
    color: var(--text-color, #000);
    padding: 10px 15px;
    margin: 5px;
    cursor: pointer;
  }

  button:active {
    background: inherit;
  }

  .contrast {
    --bg-color: #fff;
    --text-color: #000;
  }

  .color-filters {
    filter: none;
  }
</style>
