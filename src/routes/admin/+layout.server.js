import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		redirect(301, '/login');
	}
	return {};
};
