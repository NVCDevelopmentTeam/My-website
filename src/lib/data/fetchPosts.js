// in fetchPosts.js
  const posts = await Promise.all(
    // added "as: 'raw'" as an option
    Object.entries(import.meta.glob('/src/lib/posts/*.md', { as: 'raw' })).map(
      async ([path, resolver]) => {
        console.log(path);
        // get the raw content of the file
        const raw = await resolver();
        // convert the markdown and extract metadata
        const { metadata } = parseMD(raw);  
        console.log(metadata);
        const slug = path.split('/').pop().slice(0, -3);
        return { ...metadata, slug };
      }
    )
  );