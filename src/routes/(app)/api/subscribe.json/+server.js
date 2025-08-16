import { json } from '@sveltejs/kit';
import { openDB } from '$lib/data/database';
import { sendEmail } from '$lib/data/sendEmail';
import { v4 as uuidv4 } from 'uuid';

export const POST = async ({ request, url }) => {
	try {
		const data = await request.json();

		if (!data.email || !validateEmail(data.email)) {
			return json({ error: 'Invalid email address' }, { status: 400 });
		}

		const db = await openDB();
		const subscribedAt = new Date().toISOString();

		const existingSubscriber = await db.get('SELECT * FROM subscribers WHERE email = ?', [
			data.email
		]);

		if (existingSubscriber) {
			return json({ error: 'Email already subscribed' }, { status: 409 });
		}

		const unsubscribeToken = uuidv4();

		await db.run(
			'INSERT INTO subscribers (email, subscribed_at, unsubscribe_token) VALUES (?, ?, ?)',
			[data.email, subscribedAt, unsubscribeToken]
		);

		const origin = url.origin;
		const unsubscribeLink = `${origin}/unsubscribe?email=${encodeURIComponent(data.email)}&token=${unsubscribeToken}`;

		const emailText = `Thank you for subscribing! To unsubscribe, click here: ${unsubscribeLink}`;
		const emailHtml = `<p>Thank you for subscribing!</p><p>To unsubscribe, click <a href="${unsubscribeLink}">here</a>.</p>`;

		await sendEmail(data.email, 'Subscription Confirmation', emailText, emailHtml);

		return json({ success: 'Subscription successful! Confirmation email sent.' });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
};

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(String(email).toLowerCase());
}
