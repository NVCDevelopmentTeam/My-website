<script>
  import { rss } from "svelte-feeds";
  
  const feed = rss({
    title: "Your website's title",
    description: "Your website's description",
    feed_url: "https://yourwebsite.com/rss.xml",
    site_url: "https://yourwebsite.com",
  });

  // Add items to feed using a loop
  // For example, you can fetch data from an API and add it to the feed
  $: {
    const data = await fetch("https://yourwebsite.com/api/posts");
    const items = await data.json();

    items.forEach((item) => {
      // add item to feed
      feed.item({
        title: item.title,
        description: item.summary,
        url: `https://yourwebsite.com/posts/${item.slug}`,
        date: item.createdAt,
      });
    });
  }
</script>

<!-- output the xml markup -->
<feed format="rss">{feed.xml()}</feed>

