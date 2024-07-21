<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let darkMode = writable(false);
  let fontSize = writable(16);
  let contrast = writable(false);
  let colorFilters = writable(false);
  let menuOpen = writable(false);

  function toggleDarkMode() {
    darkMode.update(value => {
      document.body.classList.toggle('dark', !value);
      announceMode('Dark mode', !value);
      return !value;
    });
  }

  function increaseFontSize() {
    fontSize.update(size => {
      document.documentElement.style.fontSize = `${size + 2}px`;
      announceFontSize(size + 2);
      return size + 2;
    });
  }

  function decreaseFontSize() {
    fontSize.update(size => {
      document.documentElement.style.fontSize = `${size - 2}px`;
      announceFontSize(size - 2);
      return size - 2;
    });
  }

  function toggleContrast() {
    contrast.update(value => {
      document.body.classList.toggle('high-contrast', !value);
      announceMode('High contrast mode', !value);
      return !value;
    });
  }

  function toggleColorFilters() {
    colorFilters.update(value => {
      document.body.classList.toggle('color-filters', !value);
      announceMode('Color filters', !value);
      return !value;
    });
  }

  function announceFontSize(size) {
    const announcer = document.getElementById('font-size-announcer');
    announcer.innerText = `Font size is now ${size}px`;
    setTimeout(() => announcer.innerText = '', 1000);
  }

  function announceMode(mode, isEnabled) {
    const announcer = document.getElementById('mode-announcer');
    announcer.innerText = `${mode} is now ${isEnabled ? 'enabled' : 'disabled'}`;
    setTimeout(() => announcer.innerText = '', 1000);
  }

  onMount(() => {
    darkMode.subscribe(value => document.body.classList.toggle('dark', value));
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
      <button
        type="button"
        aria-controls="darkMode"
        aria-pressed={$darkMode}
        aria-label="Toggle dark mode"
        on:click={toggleDarkMode}>
        {#if $darkMode}
          Go light
        {:else}
          Go dark
        {/if}
      </button>

      <button
        type="button"
        aria-controls="increaseFontSize"
        aria-label="Increase font size"
        on:click={increaseFontSize}>
        Increase font size
      </button>

      <button
        type="button"
        aria-controls="decreaseFontSize"
        aria-label="Decrease font size"
        on:click={decreaseFontSize}>
        Decrease font size
      </button>

      <p style="font-size: {$fontSize + 'px'}">Font size is: {$fontSize}</p>
      <div id="font-size-announcer" aria-live="assertive" style="position: absolute; left: -9999px;"></div>
      <div id="mode-announcer" aria-live="assertive" style="position: absolute; left: -9999px;"></div>

      <button
        type="button"
        aria-controls="contrast"
        aria-pressed={$contrast}
        aria-label="Toggle contrast"
        on:click={toggleContrast}>
        {#if $contrast}
          Low contrast
        {:else}
          High contrast
        {/if}
      </button>

      <button
        type="button"
        aria-controls="colorFilters"
        aria-pressed={$colorFilters}
        aria-label="Toggle color filters"
        on:click={toggleColorFilters}>
        {#if $colorFilters}
          Default filters
        {:else}
          Change filters
        {/if}
      </button>
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

  #accessibility-options button {
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

  #accessibility-options button:active {
    background: inherit;
  }

  #accessibility-options p {
    margin: 5px 0;
    font-size: 1em;
  }
</style>
