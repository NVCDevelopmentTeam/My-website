import { json } from '@sveltejs/kit';
import fetchPosts from '$lib/data/fetchPosts';

// Cấu hình API
export const config = {
  runtime: 'edge'
};

// Xử lý phương thức POST
export async function POST({ request }) {
  try {
    const { slug } = await request.json();

    // Kiểm tra xem slug có được cung cấp không
    if (!slug) {
      return json({ error: 'Slug is required' }, { status: 400 });
    }

    // Fetch tất cả các bài viết
    const { posts } = await fetchPosts(); // Sử dụng destructuring để lấy posts từ dữ liệu trả về

    // Tìm bài viết với slug khớp
    const post = posts.find((p) => p.slug === slug);

    // Nếu không tìm thấy bài viết
    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 });
    }

    // Trả về tiêu đề và nội dung của bài viết
    return json({ title: post.title, content: post.content });
  } catch (error) {
    console.error('Error in tts.json API:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Xử lý phương thức GET
export function GET() {
  return json({ error: 'Method not allowed' }, { status: 405 });
}
