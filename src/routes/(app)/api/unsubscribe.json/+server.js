import { json } from '@sveltejs/kit';
import { openDB } from '$lib/data/database';

export const prerender = false;

export const GET = async ({ url }) => {
	try {
		const email = url.searchParams.get('email');
		const token = url.searchParams.get('token');

		if (!email || !token) {
			return json({ error: 'Missing email or token' }, { status: 400 });
		}

		const db = await openDB();

		const existingSubscriber = await db.get('SELECT * FROM subscribers WHERE email = ?', [email]);

		if (!existingSubscriber) {
			return json({ error: 'Subscriber not found' }, { status: 404 });
		}

		if (token !== existingSubscriber.unsubscribe_token) {
			return json({ error: 'Invalid token' }, { status: 403 });
		}

		await db.run('DELETE FROM subscribers WHERE email = ?', email);

		return json({ success: 'Unsubscribed successfully' });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
};