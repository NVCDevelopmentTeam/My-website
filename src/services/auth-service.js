import { auth } from '$lib/server/lucia';

class AuthService {
	async login(formData, metadata = {}) {
		const { email, password } = formData;

		// Validate input
		if (!email || !password) {
			throw new Error('Email and password are required');
		}

		// Use the correct Lucia method to validate credentials
		const user = await auth.validateUser(email.toLowerCase(), password);

		if (!user) {
			throw new Error('Invalid credentials');
		}

		// Create session with user ID
		const session = await auth.createSession({
			userId: user.id,
			attributes: metadata
		});

		return session;
	}

	async logout(sessionId) {
		try {
			if (!sessionId) {
				throw new Error('Session ID is required');
			}

			// Invalidate the specific session
			await auth.invalidateSession(sessionId);
			return { success: true };
		} catch (error) {
			console.error('Logout error:', error);
			throw error;
		}
	}

	async logoutAllSessions(userId) {
		try {
			if (!userId) {
				throw new Error('User ID is required');
			}

			// Invalidate all sessions for the user
			await auth.invalidateAllUserSessions(userId);
			return { success: true };
		} catch (error) {
			console.error('Logout all sessions error:', error);
			throw error;
		}
	}

	async signUp(formData) {
		try {
			const { email, firstName, lastName, password } = formData;

			// Validate input
			if (!email || !password || !firstName || !lastName) {
				throw new Error('All fields are required');
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				throw new Error('Invalid email format');
			}

			// Validate password strength (minimum 6 characters)
			if (password.length < 6) {
				throw new Error('Password must be at least 6 characters long');
			}

			// Create user with key
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email.toLowerCase(),
					password
				},
				attributes: {
					email: email.toLowerCase(),
					firstName: firstName.trim(),
					lastName: lastName.trim()
				}
			});

			return user;
		} catch (error) {
			// Handle Lucia-specific errors
			if (error?.message?.includes('AUTH_DUPLICATE_KEY_ID')) {
				throw new Error('User with this email already exists');
			}
			throw error;
		}
	}

	async validateSession(sessionId) {
		try {
			if (!sessionId) {
				return null;
			}

			const session = await auth.validateSession(sessionId);
			return session;
		} catch (error) {
			console.error('Session validation error:', error);
			return null;
		}
	}

	async getUser(userId) {
		try {
			if (!userId) {
				throw new Error('User ID is required');
			}

			const user = await auth.getUser(userId);
			return user;
		} catch (error) {
			console.error('Get user error:', error);
			throw error;
		}
	}

	async updateUser(userId, updateData) {
		try {
			if (!userId) {
				throw new Error('User ID is required');
			}

			const user = await auth.updateUserAttributes(userId, updateData);
			return user;
		} catch (error) {
			console.error('Update user error:', error);
			throw error;
		}
	}

	async changePassword(userId, currentPassword, newPassword) {
		try {
			if (!userId || !currentPassword || !newPassword) {
				throw new Error('User ID, current password, and new password are required');
			}

			// Validate new password strength
			if (newPassword.length < 6) {
				throw new Error('New password must be at least 6 characters long');
			}

			// Update the password
			await auth.updateKeyPassword('email', userId, newPassword);

			return { success: true };
		} catch (error) {
			console.error('Change password error:', error);
			throw error;
		}
	}
}

export const authService = new AuthService();
