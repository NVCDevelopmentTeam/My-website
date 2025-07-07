import { redirect } from '@sveltejs/kit';
import { openDB } from '$lib/data/database';

export async function load({ url }) {
	const email = url.searchParams.get('email');
	const token = url.searchParams.get('token');

	if (!email || !token) {
		redirect(303, '/error?message=Missing email or token'); // Redirect to an error page with a message
	}

	const db = await openDB();
	const subscriber = await db.get(
		'SELECT * FROM subscribers WHERE email = ? AND unsubscribe_token = ?',
		[email, token]
	);

	if (!subscriber) {
		redirect(303, '/error?message=Invalid email or token'); // Redirect to an error page with a message
	}

	return { email, token };
}
