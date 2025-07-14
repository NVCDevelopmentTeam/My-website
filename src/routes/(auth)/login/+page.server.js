import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import { authUseCases } from '$usecases/auth-usecases';

export const load = async ({ locals }) => {
	const session = locals.session;
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
		const { request, cookies, locals } = event;

		// Parse and validate form data from incoming request
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			// Return form with validation errors (HTTP 400)
			return fail(400, { form });
		}

		try {
			// Attempt backend login with validated form data
			const session = await authUseCases.login(form.data, {
				platform: 'web',
				ip_address: request.headers.get('x-forwarded-for') || '0.0.0.0'
			});

			// Set session using your auth system
			if (locals.auth && locals.auth.setSession) {
				// If using Lucia with locals.auth
				locals.auth.setSession(session);
			} else {
				// Fallback: Set session cookie manually
				cookies.set('auth_session', session.sessionId, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 60 * 60 * 24 * 30 // 30 days
				});
			}

			// On success, attach a success message and redirect
			return message(form, 'Login successful! Redirecting...');
		} catch (error) {
			console.error('Login error:', error);

			// Set user-facing error message on the form
			form.message = error.message || 'Login failed — please check your credentials.';
			return fail(400, { form });
		}
	}
};
