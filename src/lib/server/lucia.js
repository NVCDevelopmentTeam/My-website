import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { client } from './prisma'; // Assuming you have a prisma.js file
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: prisma(client),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),

	// Populates the user object when you fetch it
	getUserAttributes: (data) => {
		return {
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName
		};
	}
});