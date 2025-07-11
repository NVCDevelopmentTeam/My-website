import { superValidate, message } from 'sveltekit-superforms/server'; // validation + flash message helper
import { zod } from 'sveltekit-superforms/adapters'; // adapter for Zod schemas
import { loginSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import { authUseCases } from '$usecases/auth-usecases';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		// Redirect logged-in user immediately
		redirect(301, '/admin');
	}

	// Initialize a validated form with schema defaults
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		// Parse and validate form data from incoming request
		const form = await superValidate(event.request, zod(loginSchema));

		if (!form.valid) {
			// Return form with validation errors (HTTP 400)
			return fail(400, { form });
		}

		try {
			// Attempt backend login
			const session = await authUseCases.login(form.data, {
				platform: 'web',
				ip_address: event.request.headers.get('x-forwarded-for') || '0.0.0.0'
			});
			event.locals.auth.setSession(session);
		} catch (error) {
			console.error('Login error:', error);
			// Set user-facing error message
			form.message = 'Login failed — please check your credentials.';
			return fail(400, { form });
		}

		// On success, attach a success message for client to handle
		return message(form, 'Login successful! Redirecting...');
	}
};
