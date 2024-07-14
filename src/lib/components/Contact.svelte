<script>
  import { onMount } from 'svelte';
  let name = '';
  let email = '';
  let title = '';
  let message = '';
  let status = "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    status = 'Submitting...';

    const formData = {
      name,
      email,
      title,
      message
    };

    const response = await fetch("/api/submit.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      console.log(result);
      status = result.message || "Success";
    } else {
      status = result.message || "An error occurred while processing your request";
    }
  };
</script>

<form on:submit={handleSubmit}>
  <div class="form-group">
    <label for="name">Name *</label>
    <input type="text" id="name" bind:value={name} class="form-input" required />
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" bind:value={email} class="form-input" required />
  </div>

  <div class="form-group">
    <label for="title">Title *</label>
    <input type="text" id="title" bind:value={title} class="form-input" required />
  </div>

  <div class="form-group">
    <label for="message">Message *</label>
    <textarea id="message" bind:value={message} class="form-input" required></textarea>
  </div>

  <button type="submit" class="form-button">Submit</button>

  {#if status}
    <p>{status}</p>
  {/if}
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input,
  textarea {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  textarea {
    height: 10rem;
  }

  button[type="submit"] {
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }

  .form-input:invalid {
    border-color: #e32;
  }

  .form-input:focus {
    box-shadow: 0 0 0 2px #007bff;
  }

  .form-input:required:after {
    content: " *";
    color: red;
  }
</style>
