import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { message } = await request.json();

		if (!message) {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		// Simple response logic - you can expand this
		const botResponse = generateResponse(message);

		return json({
			message: botResponse,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

function generateResponse(message) {
	// Basic response logic - expand as needed
	const responses = {
		hello: 'Hi there! How can I help you?',
		'how are you': "I'm doing well, thank you for asking!",
		bye: 'Goodbye! Have a great day!'
	};

	message = message.toLowerCase().trim();
	return responses[message] || "I'm not sure how to respond to that. Can you rephrase?";
}
