import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = locals.session;
	if (!session) {
		redirect(301, '/login');
	}
	return {};
};
