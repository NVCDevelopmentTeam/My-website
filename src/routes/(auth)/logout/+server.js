import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		redirect(302, '/login');
	}
	await auth.invalidateSession(session.sessionId);
	locals.auth.setSession(null);
	redirect(302, '/login');
};

