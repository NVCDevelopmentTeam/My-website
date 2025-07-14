import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const POST = async ({ locals, cookies }) => {
	try {
		// Get session from locals (Lucia way)
		const session = await locals.auth.validate();

		if (session) {
			// Invalidate session in database
			await auth.invalidateSession(session.sessionId);

			// Clear session from locals
			locals.auth.setSession(null);
		}

		// Also clear any session cookies as fallback
		cookies.delete('auth_session', {
			path: '/'
		});

		// Clear other potential auth cookies
		cookies.delete('lucia_session', {
			path: '/'
		});
	} catch (error) {
		console.error('Logout error:', error);
		// Continue with logout even if there's an error
	}

	// Always redirect to login after logout attempt
	redirect(302, '/login');
};
