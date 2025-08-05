import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { z } from 'zod';

// Define schema
const signUpSchema = z
	.object({
		firstName: z.string().min(2, 'First name must be at least 2 characters long'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
		email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters long'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
	try {
		const { session } = await auth.handleRequest(event);
		if (session) {
			redirect(302, '/admin');
		}
		const form = await superValidate(zod(signUpSchema));
		return {
			form
		};
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		console.error('Error in load function:', error);
		const form = await superValidate(zod(signUpSchema));
		return { form };
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { cookies } = event;
		const form = await superValidate(event, zod(signUpSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const { firstName, lastName, email, password } = form.data;
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email.toLowerCase(),
					password
				},
				attributes: {
					email: email.toLowerCase(),
					firstName,
					lastName
				}
			});
			const session = await auth.createSession({
				userId: user.id,
				attributes: { platform: 'email', ip_address: event.getClientAddress() }
			});
			cookies.set('session_id', session.id, { path: '/' });
		} catch (error) {
			if (error instanceof Response) {
				throw error;
			}
			console.error('Sign up error:', error);
			const form = await superValidate(event, zod(signUpSchema));
			if (
				error.message?.includes('UNIQUE constraint failed') || // for sqlite
				error.code === 'P2002' || // for prisma
				error.message?.includes('duplicate')
			) {
				form.errors.email = ['Email already exists'];
				return fail(400, { form });
			}
			form.errors._errors = ['Registration failed. Please try again.'];
			return fail(500, { form });
		}
		redirect(302, '/admin');
	}
};
