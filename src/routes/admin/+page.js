await fetch('/api/new-post', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ title, summary, url })
});
