<script>
  import { fade } from 'svelte/transition';

  
  /**
   * @typedef {Object} Props
   * @property {any} [slides] - Slide data
   */

  /** @type {Props} */
  let { slides = [
    {
      title: 'Chào mừng đến với Coding Nguyễn',
      subtitle: 'Web Dev – Accessibility Tester',
      ctaText: 'Xem dự án',
      ctaLink: '/projects',
      img: '/slides/slide1.jpg'
    },
    {
      title: 'Gen Z đầy năng lượng',
      subtitle: 'Phong cách trẻ trung & chuyên nghiệp',
      ctaText: 'Liên hệ',
      ctaLink: '/contact',
      img: '/slides/slide2.jpg'
    },
    // Anh thêm slide tiếp nếu muốn
  ] } = $props();

  let current = $state(0);

  function nextSlide() {
    current = (current + 1) % slides.length;
  }

  // Auto chuyển mỗi 5s
  let timer = $state(setInterval(nextSlide, 5000));
  
  // Reset timer khi người dùng tự thao tác (nếu sau này anh thêm nút next/prev)
  $effect(() => {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
    
    return () => clearInterval(timer);
  });
</script>

<section class="relative w-full h-screen overflow-hidden">
  {#each slides as slide, i}
    {#if i === current}
      <div class="absolute inset-0 bg-cover bg-center"
           style="background-image: url('{slide.img}')"
           transition:fade={{ duration: 800 }}>
        <div class="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
          <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4">{slide.title}</h1>
          <p class="text-lg sm:text-xl text-white mb-6">{slide.subtitle}</p>
          <a href={slide.ctaLink}
             class="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition">
            {slide.ctaText}
          </a>
        </div>
      </div>
    {/if}
  {/each}
</section>

<style>
  section { position: relative; }
</style>

