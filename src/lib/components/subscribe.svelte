<script>
  import { useState } from "svelte";
  import { post } from "$lib/api";

  let email = "";
  let successMessage = "";
  let errorMessage = "";
  let isLoading = false;

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;

    try {
      await post("/subscribe", { email });
      successMessage = "You've successfully subscribed!";
      errorMessage = "";
    } catch (error) {
      successMessage = "";
      errorMessage = "Something went wrong. Please try again later.";
    }

    isLoading = false;
    email = "";
  }
</script>

<main>
  <h1>Subscribe to receive post by email</h1>

  {#if successMessage}
    <p>{successMessage}</p>
  {:else if errorMessage}
    <p>{errorMessage}</p>
  {/if}

  <form on:submit={handleSubmit}>
    <label>
      Email:
      <input type="email" bind:value={email} required />
    </label>

    <button type="submit" disabled={isLoading}>
      {isLoading ? "Subscribing..." : "Subscribe"}
    </button>
  </form>
</main>
