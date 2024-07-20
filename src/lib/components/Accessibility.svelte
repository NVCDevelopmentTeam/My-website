<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let darkMode = false;
  let fontSize = 16;
  let contrast = false;
  let colorFilters = false;
  let menuOpen = writable(false);

  function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    announceMode('Dark mode', darkMode);
  }

  function increaseFontSize() {
    fontSize += 2;
    document.documentElement.style.fontSize = `${fontSize}px`;
    announceFontSize();
  }

  function decreaseFontSize() {
    fontSize -= 2;
    document.documentElement.style.fontSize = `${fontSize}px`;
    announceFontSize();
  }

  function toggleContrast() {
    contrast = !contrast;
    document.body.classList.toggle('high-contrast', contrast);
    announceMode('High contrast mode', contrast);
  }

  function toggleColorFilters() {
    colorFilters = !colorFilters;
    document.body.classList.toggle('color-filters', colorFilters);
    announceMode('Color filters', colorFilters);
  }

  function announceFontSize() {
    const announcer = document.getElementById('font-size-announcer');
    announcer.innerText = `Font size is now ${fontSize}px`;
    setTimeout(() => announcer.innerText = '', 1000);
  }

  function announceMode(mode, isEnabled) {
    const announcer = document.getElementById('mode-announcer');
    announcer.innerText = `${mode} is now ${isEnabled ? 'enabled' : 'disabled'}`;
    setTimeout(() => announcer.innerText = '', 1000);
  }

  onMount(() => {
    document.body.classList.toggle('dark', darkMode);
  });
</script>

<nav aria-label="Accessibility menu" class="accessibility-menu">
  <button
    type="button"
    aria-expanded={$menuOpen}
    aria-controls="accessibility-options"
    on:click={() => menuOpen.set(!$menuOpen)}>
    {#if $menuOpen}
      Close accessibility menu
    {:else}
      Open accessibility menu
    {/if}
  </button>

  {#if $menuOpen}
    <div id="accessibility-options" role="menu">
      <a
        href="#"
        aria-controls="darkMode"
        aria-pressed={darkMode}
        aria-label="Toggle dark mode"
        on:click|preventDefault={toggleDarkMode}>
        {#if darkMode}
          Go light
        {:else}
          Go dark
        {/if}
      </a>

      <a
        href="#"
        aria-controls="increaseFontSize"
        aria-label="Increase font size"
        on:click|preventDefault={increaseFontSize}>
        Increase font size
      </a>

      <a
        href="#"
        aria-controls="decreaseFontSize"
        aria-label="Decrease font size"
        on:click|preventDefault={decreaseFontSize}>
        Decrease font size
      </a>

      <p style="font-size: {fontSize + 'px'}">Font size is: {fontSize}</p>
      <div id="font-size-announcer" aria-live="assertive" style="position: absolute; left: -9999px;"></div>
      <div id="mode-announcer" aria-live="assertive" style="position: absolute; left: -9999px;"></div>

      <a
        href="#"
        aria-controls="contrast"
        aria-pressed={contrast}
        aria-label="Toggle contrast"
        on:click|preventDefault={toggleContrast}>
        {#if contrast}
          Low contrast
        {:else}
          High contrast
        {/if}
      </a>

      <a
        href="#"
        aria-controls="colorFilters"
        aria-pressed={colorFilters}
        aria-label="Toggle color filters"
        on:click|preventDefault={toggleColorFilters}>
        {#if colorFilters}
          Default filters
        {:else}
          Change filters
        {/if}
      </a>
    </div>
  {/if}
</nav>

<style>
  :global(body.dark) {
    background: #333;
    color: #fff;
  }

  :global(body.high-contrast) {
    background: #000;
    color: #fff;
  }

  :global(body.color-filters) {
    filter: invert(1);
  }

  .accessibility-menu {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  .accessibility-menu > button {
    background: #fff;
    border: 2px solid #000;
    border-radius: 5px;
    color: #000;
    padding: 10px 15px;
    margin: 5px 0;
    cursor: pointer;
    width: 100%;
  }

  .accessibility-menu > button:active {
    background: inherit;
  }

  #accessibility-options {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  #accessibility-options a {
    background: #fff;
    border: 2px solid #000;
    border-radius: 5px;
    color: #000;
    padding: 10px 15px;
    margin: 5px 0;
    cursor: pointer;
    text-decoration: none;
    width: 100%;
    text-align: center;
  }

  #accessibility-options a:active {
    background: inherit;
  }

  #accessibility-options p {
    margin: 5px 0;
    font-size: 1em;
  }
</style>
