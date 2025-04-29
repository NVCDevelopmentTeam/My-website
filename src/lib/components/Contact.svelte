<script>
  import { onMount } from 'svelte';
  let name = $state('');
  let email = $state('');
  let title = $state('');
  let message = $state('');
  let status = $state("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    status = 'Submitting...';

    const formData = {
      name,
      email,
      title,
      message
    };

    try {
      const response = await fetch("/api/submit.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        status = result.message || "Success";
        // Reset form fields after successful submission
        name = '';
        email = '';
        title = '';
        message = '';
      } else {
        status = result.message || "An error occurred while processing your request";
      }
    } catch (error) {
      console.error('Error:', error);
      status = "An error occurred while processing your request";
    }
  };
</script>

<form onsubmit={handleSubmit}>
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
