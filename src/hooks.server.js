import { incrementVisitorCount } from '$lib/data/statsService';

export async function handle({ event, resolve }) {
  try {
    await incrementVisitorCount();
    const response = await resolve(event);
    return response;
  } catch (error) {
    console.error('Error in hooks:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
