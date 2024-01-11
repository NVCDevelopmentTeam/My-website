<script>
  let darkMode = false;
  let fontSize = 10;
  let contrast = false;
  let colorFilters = false;

  function toggle() {
    darkMode = !darkMode;
    window.document.body.classList.toggle('dark');
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
</script>

<button class="dark mode" type="button"
  data-toggle="darkMode"
  data-target="darkMode"
  aria-controls="darkMode"
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

<button on:click={e => fontSize++}>Increase font size</button>
<button on:click={e => fontSize--}>Decrease font size</button>
<p style="font-size: {fontSize + 'px'}">Font size is: { fontSize }</p>

<button class="contrast" type="button"
  data-toggle="contrast"
  data-target="contrast"
  aria-controls="contrast"
  aria-label="Contrast"
  on:click={toggleContrast}>
  <svg viewBox="0 0 20 20" fill="none">
    <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
    <path d="M1 10L19 10" stroke="black" stroke-width="2" />
  </svg>
  <span class="navbar-toggler-icon"></span>
  {#if contrast }
    high
  {:else}
    low
  {/if}
</button>

<button class="color-filters" type="button"
  data-toggle="colorFilters"
  data-target="colorFilters"
  aria-controls="colorFilters"
  aria-label="Color filters"
  on:click={toggleColorFilters}>
  <svg viewBox="0 0 20 20" fill="none">
    <path class="vert" d="M10 1V19" stroke="black" stroke-width="2" />
    <path d="M1 10L19 10" stroke="black" stroke-width="2" />
  </svg>
  <span class="navbar-toggler-icon"></span>
  {#if  colorFilters }
    default
  {:else}
    change
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