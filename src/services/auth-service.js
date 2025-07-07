import { auth } from '$lib/server/lucia';

class AuthService {
	async login(formData, metadata) {
		const { email, password } = formData;
		const user = await auth.validateUser(email, password);
		if (!user) {
			throw new Error('Invalid credentials');
		}
		return auth.createSession({ userId: user.id, attributes: metadata });
	}

	async logout(userId) {
		return auth.invalidateAllUserSessions(userId);
	}

	signUp(formData) {
		const { email, firstName, lastName, password } = formData;
		return auth.createUser({
			key: {
				providerId: 'email',
				providerUserId: email.toLowerCase(),
				password
			},
			attributes: {
				email,
				firstName,
				lastName
			}
		});
	}
}

export const authService = new AuthService();
