import { redirect } from '@sveltejs/kit';

export const load = async () => {
	redirect(301, `/blog/tag`);
};
