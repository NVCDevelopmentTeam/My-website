<script>
  import { onMount } from 'svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import PostsList from '$lib/components/PostsList.svelte';
  import { search, searchResults, isLoading } from '$lib/data/search';
  import { siteTitle } from '$lib/data/config';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  let query = '';
  let hasResults = false;
  let hasSearched = false;
  let currentPage = 1;
  let totalPosts = 0;
  let posts = [];

  // Lấy query từ URL
  $: if (page && page.url) {
    query = page.url.searchParams.get('q') || '';
  }

  onMount(async () => {
    if (query) {
      await performSearch();
    }
  });

  async function performSearch() {
    try {
      isLoading.set(true);
      await search(query);
      posts = get(searchResults); // Cập nhật dữ liệu tìm kiếm
      hasResults = posts.length > 0;
      hasSearched = query.length > 0;
      totalPosts = posts.length;
    } catch (error) {
      console.error('Lỗi khi lấy kết quả tìm kiếm:', error);
    } finally {
      isLoading.set(false);
    }
  }
</script>

<svelte:head>
  <title>Search results for "{decodeURIComponent(query)}" - {siteTitle}</title>
  <meta name="description" content={`Search results for keyword "${decodeURIComponent(query)}"`} />
</svelte:head>

<div class="search-results-container">
  {#if hasSearched}
    {#if $isLoading}
      <p>Đang tải kết quả...</p>
    {:else if !hasResults}
      <h1>Không tìm thấy</h1>
      <p>Rất tiếc, không có nội dung nào phù hợp với yêu cầu tìm kiếm của bạn. Hãy thử với các từ khóa khác.</p>
    {:else}
      <h1>Kết quả tìm kiếm cho "{decodeURIComponent(query)}"</h1>
      <div class="mt-8">
        <PostsList posts={posts} />
      </div>
    {/if}
  {/if}
  <Pagination currentPage={currentPage} totalPosts={totalPosts} />
</div>
