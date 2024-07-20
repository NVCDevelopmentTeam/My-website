<script>
  import { onMount } from 'svelte';

  let email = '';
  let message = '';
  let loading = false;

  const subscribe = async () => {
    loading = true;
    try {
      const response = await fetch('/api/subscribe.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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

<form on:submit|preventDefault={subscribe} class="subscribe-form">
  <input
    type="email"
    bind:value={email}
    placeholder="Enter your email"
    required
    class="email-input"
  />
  <button type="submit" disabled={loading} class="subscribe-button">
    {#if loading} Subscribing... {/if}
    {#if !loading} Subscribe {/if}
  </button>
</form>

{#if message}
  <p class="message">{message}</p>
{/if}

<style>
  .subscribe-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .email-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
  }

  .email-input:focus {
    border-color: #007bff;
  }

  .subscribe-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .subscribe-button:disabled {
    background-color: #cccccc;
  }

  .subscribe-button:not(:disabled):hover {
    background-color: #0056b3;
  }

  .message {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
  }
</style>
