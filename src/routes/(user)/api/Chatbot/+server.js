import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const POST = async ({ request }) => {
	try {
		const { message } = await request.json();

		// Enhanced input validation
		if (!message || typeof message !== 'string') {
			return json({ error: 'Message must be a non-empty string' }, { status: 400 });
		}

		if (message.length > 1000) {
			return json({ error: 'Message is too long (max 1000 characters)' }, { status: 400 });
		}

		// Check if Gemini API key is configured
		if (!process.env.GEMINI_API_KEY) {
			console.error('GEMINI_API_KEY is not configured');
			return json({ error: 'AI service not configured' }, { status: 500 });
		}

		// Add timeout to the response generation
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(() => reject(new Error('Request timeout')), 30000)
		);

		// Generate response using Gemini AI with timeout
		const botResponse = await Promise.race([generateGeminiResponse(message), timeoutPromise]);

		return json({
			id: uuidv4(),
			message: botResponse,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Error in chatbot API:', error.message);
		const errorMessage =
			error.message === 'Request timeout' ? 'Request timed out' : 'Internal server error';
		return json({ error: errorMessage }, { status: 500 });
	}
};

async function generateGeminiResponse(message) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

		// Add safety settings and generation config
		const result = await model.generateContent({
			contents: [{ role: 'user', parts: [{ text: message }] }],
			generationConfig: {
				temperature: 0.7,
				topK: 40,
				topP: 0.95,
				maxOutputTokens: 1024
			}
		});

		if (!result.response) {
			throw new Error('Empty response from Gemini');
		}

		return result.response.text();
	} catch (error) {
		console.error('Error generating Gemini response:', error);
		return generateFallbackResponse(message);
	}
}

function generateFallbackResponse(message) {
	// Fallback response logic in case Gemini API fails
	const responses = {
		hello: 'Hi there! How can I help you?',
		'how are you': "I'm doing well, thank you for asking!",
		bye: 'Goodbye! Have a great day!'
	};

	const normalizedMessage = message.toLowerCase().trim();
	return (
		responses[normalizedMessage] ||
		"I'm experiencing some technical difficulties. Please try again later."
	);
}
