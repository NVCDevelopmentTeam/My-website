<script>
    export let messages = [];
    export let adminName = 'Admin';
</script>

<!-- Message display area -->
<div style="max-height: 400px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; background: #f9f9f9;">
    {#each messages as msg (msg.text)}
        <div style="margin-bottom: 10px;">
            <strong>{msg.self ? msg.name : adminName}:</strong>
            <p>{msg.text}</p>
        </div>
    {/each}
</div>
