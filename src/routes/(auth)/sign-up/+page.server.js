import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { authUseCases } from '$usecases/auth-usecases';
import { z } from 'zod';

// Define schema
const signUpSchema = z
	.object({
		email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),

		password: z.string().min(8, 'Password must be at least 8 characters long'),

		confirmPassword: z.string().min(1, 'Please confirm your password'),

		name: z
			.string()
			.min(2, 'Name must be at least 2 characters long')
			.max(50, 'Name must be less than 50 characters'),

		terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	try {
		// Check if user is already authenticated
		if (locals.session) {
			redirect(301, '/admin');
		}

		// Initialize form with zod adapter
		const form = await superValidate(zod(signUpSchema));

		return {
			form
		};
	} catch (error) {
		// Re-throw redirects
		if (error instanceof Response) {
			throw error;
		}

		console.error('Error in load function:', error);

		// Return empty form on error
		const form = await superValidate(zod(signUpSchema));
		return { form };
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { locals, getClientAddress } = event;

		try {
			// Validate form data with zod adapter
			const form = await superValidate(event, zod(signUpSchema));

			if (!form.valid) {
				return fail(400, {
					form
				});
			}

			// Get client IP address
			const clientIP = getClientAddress() || '0.0.0.0';

			// Sign up the user
			await authUseCases.signUp(form.data);

			// Auto-login after successful signup
			const session = await authUseCases.login(form.data, {
				platform: 'web',
				ip_address: clientIP
			});

			// Set session in locals
			locals.auth.setSession(session);

			// Redirect to admin page on success
			redirect(301, '/admin');
		} catch (error) {
			// Re-throw redirects
			if (error instanceof Response) {
				throw error;
			}

			console.error('Sign up error:', error);

			// Handle different types of errors
			if (
				error.message?.includes('email already exists') ||
				error.message?.includes('duplicate') ||
				error.code === 'DUPLICATE_EMAIL'
			) {
				const form = await superValidate(event, zod(signUpSchema));
				form.errors.email = ['Email already exists'];
				return fail(400, { form });
			}

			if (error.message?.includes('validation') || error.message?.includes('invalid')) {
				const form = await superValidate(event, zod(signUpSchema));
				form.errors._errors = ['Invalid registration data'];
				return fail(400, { form });
			}

			// Generic error handling
			const form = await superValidate(event, zod(signUpSchema));
			form.errors._errors = ['Registration failed. Please try again.'];
			return fail(500, { form });
		}
	}
};
