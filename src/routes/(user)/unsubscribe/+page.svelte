<script>
  import { run } from 'svelte/legacy';

  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let email = $state('');
  let message = $state('');
  let loading = $state(false);

  let unsubscribeToken = $derived(page.data.token);
  run(() => {
    email = page.data.email;
  });

  const confirmUnsubscribe = async () => {
    loading = true;
    try {
      const response = await fetch(`/api/unsubscribe.json?email=${encodeURIComponent(email)}&token=${unsubscribeToken}`, {
        method: 'GET'
      });

      const result = await response.json();

      if (response.ok) {
        message = result.success;
      } else {
        message = `Error: ${result.error}`;
      }
    } catch (error) {
      message = 'An error occurred. Please try again later.';
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>Unsubscribe</title>
  <meta name="description" content="Unsubscribe" />
</svelte:head>

{#if message}
  <p>{message}</p>
{:else}
  <p>Do you really want to unsubscribe?</p>
  <button onclick={confirmUnsubscribe} disabled={loading}>
    {#if loading} Unsubscribing... {/if}
    {#if !loading} Yes, Unsubscribe {/if}
  </button>
{/if}
