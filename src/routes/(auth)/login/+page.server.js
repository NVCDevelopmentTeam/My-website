import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load = async ({ locals }) => {
	const { session } = await locals.auth.validateUser();
	if (session) {
		// Redirect logged-in user immediately
		redirect(302, '/admin');
	}
	// Initialize a validated form with schema defaults
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const { request, locals } = event;

		// Parse and validate form data from incoming request
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			// Return form with validation errors (HTTP 400)
			return fail(400, { form });
		}

		try {
			const { email, password } = form.data;
			const key = await auth.useKey('email', email, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);

			// On success, attach a success message and redirect
			return message(form, 'Login successful! Redirecting...');
		} catch (error) {
			console.error('Login error:', error);

			// Set user-facing error message on the form
			form.message = 'Login failed — please check your credentials.';
			return fail(400, { form });
		}
	}
};
