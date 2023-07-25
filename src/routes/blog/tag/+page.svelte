<script>
  let tags = [];
  let newTag = "";

  function addTag() {
    if (newTag.trim() !== "") {
      tags = [...tags, newTag];
      newTag = "";
    }
  }

  function removeTag(tag) {
    tags = tags.filter((t) => t !== tag);
  }
</script>

<h1>Tags</h1>
<div>
  <input type="text" bind:value={newTag} placeholder="Add a tag" />
  <button on:click={addTag}>Add</button>
</div>

<div>
  {#each tags as tag (tag)}
    <span>{tag}</span>
    <button on:click={() => removeTag(tag)}>Remove</button>
  {/each}
</div>
