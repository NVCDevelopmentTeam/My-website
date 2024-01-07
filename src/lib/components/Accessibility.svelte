<script>
  import { onMount } from 'svelte';

  let isDarkMode = false;
  let fontSize = 16;
  let contrast = 'default';
  let color = 'default';

  function updateFontSize(value) {
    fontSize += value;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize);
  }

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('isDarkMode', isDarkMode);
    disableTransitionsTemporarily();
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('transition-none');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition-none');
    }, 0);
  }

  onMount(() => {
    const storedFontSize = localStorage.getItem('fontSize');
    if (storedFontSize) {
      fontSize = parseInt(storedFontSize, 10);
      document.documentElement.style.fontSize = `${fontSize}px`;
    }

    const storedIsDarkMode = localStorage.getItem('isDarkMode');
    if (storedIsDarkMode) {
      isDarkMode = storedIsDarkMode === 'true';
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  });
</script>

<button type="button" aria-label="Toggle dark mode" on:click={toggleDarkMode}>
  Toggle Dark Mode
</button>

<button type="button" on:click={() => updateFontSize(2)}>Increase Font Size</button>
<button type="button" on:click={() => updateFontSize(-2)}>Decrease Font Size</button>
<!-- Add similar click handlers for contrast and color -->

<style>
  button {
    padding: 10px;
    margin: 5px;
    border: none;
    cursor: pointer;
  }

  button.dark-mode-toggle {
  	background-color: #333;
  	color: #fff;
  	border-radius: 5px;
  	box-shadow: none;
  	transition: background-color 0.3s ease-in-out;
  	padding: 10px;
  	cursor: pointer;
  	border: none; 
	}

	button.font-size-adjustment,
	button.contrast-adjustment,
	button.color-adjustment{
		background-color: #007bff;
		color: #fff; 
		border-radius:5px; 
		padding:10px; 
		cursor:pointer; 
		border:none; 
		margin-right:10px
	}

	button.font-size-adjustment:hover,
	button.contrast-adjustment:hover,
	button.color-adjustment:hover{
	  background-color:#0056b3
	}

	body.dark button.dark-mode-toggle{
	  background-color:#fff; 
	  color:#333
	}
</style>