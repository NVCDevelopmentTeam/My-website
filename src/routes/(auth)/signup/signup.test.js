import { actions } from './+page.server.js';
import { describe, it, expect, vi } from 'vitest';
import { fail } from '@sveltejs/kit';

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => ({
		user: {
			findUnique: vi.fn(),
			create: vi.fn()
		}
	}))
}));

vi.mock('nodemailer', () => ({
	default: {
		createTransport: vi.fn(() => ({
			sendMail: vi.fn()
		}))
	}
}));

describe('POST /signup', () => {
	it('should return a success response when the form data is valid', async () => {
		const request = new Request('http://localhost/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123',
				'confirm-password': 'Password123'
			}).toString()
		});

		const { register } = actions;
		const response = await register({ request });

		expect(response.success).toBe(true);
	});

	it('should return a fail response when the form data is invalid', async () => {
		const request = new Request('http://localhost/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				name: '',
				email: 'test@example.com',
				password: 'password123',
				'confirm-password': 'password123'
			}).toString()
		});

		const { register } = actions;
		const response = await register({ request });

		expect(response.data.error).toBe('Vui lòng kiểm tra lại thông tin đăng ký');
	});
});
