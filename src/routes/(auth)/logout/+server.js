import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const POST = async (event) => {
	try {
		const { session } = await auth.handleRequest(event);

		if (session) {
			await auth.invalidateSession(session.id);
		}

		const { cookies } = event;
		cookies.delete('session_id', {
			path: '/'
		});
	} catch (error) {
		console.error('Logout error:', error);
	}

	redirect(302, '/login');
};
