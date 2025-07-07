import { authService } from '$services/auth-service';

/**
 * @typedef {{ email: string; password: string }} LoginForm
 * @typedef {{ platform: string; ip_address: string }} Metadata
 * @typedef {{ email: string; firstName: string; lastName: string; password: string }} SignUpForm
 */

/**
 * Class containing authentication use cases.
 */
class AuthUseCases {
	/**
	 * Log in the user.
	 * @param {LoginForm} formData
	 * @param {Metadata} metadata
	 * @returns {Promise<any>}
	 */
	login(formData, metadata) {
		return authService.login(formData, metadata);
	}

	/**
	 * Register a new user.
	 * @param {SignUpForm} formData
	 * @returns {Promise<any>}
	 */
	async signUp(formData) {
		return authService.signUp(formData);
	}

	/**
	 * Log out an existing user.
	 * @param {string} userId
	 * @returns {Promise<void>}
	 */
	async logout(userId) {
		await authService.logout(userId);
	}
}

export const authUseCases = new AuthUseCases();
