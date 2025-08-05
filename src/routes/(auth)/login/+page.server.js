import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const rememberMe = data.get('remember-me') === 'on';

		// Validation
		if (!email || !password) {
			return fail(400, {
				error: 'Email và mật khẩu là bắt buộc',
				errors: {
					email: !email ? 'Email là bắt buộc' : undefined,
					password: !password ? 'Mật khẩu là bắt buộc' : undefined
				}
			});
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Định dạng email không hợp lệ',
				errors: {
					email: 'Định dạng email không hợp lệ'
				}
			});
		}

		try {
			// Find user in database
			const user = await prisma.user.findUnique({
				where: { email },
				select: {
					id: true,
					email: true,
					firstName: true,
					lastName: true,
					hashedPassword: true,
					role: true,
					isActive: true,
					emailVerified: true,
					lastLoginAt: true
				}
			});

			if (!user) {
				return fail(400, {
					error: 'Email hoặc mật khẩu không chính xác',
					errors: {}
				});
			}

			// Check if account is active
			if (!user.isActive) {
				return fail(400, {
					error: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.',
					errors: {}
				});
			}

			// Check if email is verified
			if (!user.emailVerified) {
				return fail(400, {
					error: 'Vui lòng xác thực email trước khi đăng nhập.',
					errors: {}
				});
			}

			// Verify password
			const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
			if (!passwordMatch) {
				return fail(400, {
					error: 'Email hoặc mật khẩu không chính xác'
				});
			}

			// Generate JWT token
			const tokenPayload = {
				userId: user.id,
				email: user.email,
				role: user.role
			};

			const tokenOptions = {
				expiresIn: rememberMe ? '30d' : '24h'
			};

			const token = jwt.sign(tokenPayload, JWT_SECRET, tokenOptions);

			// Update last login time
			await prisma.user.update({
				where: { id: user.id },
				data: { lastLoginAt: new Date() }
			});

			// Set HTTP-only cookie
			cookies.set('auth_token', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
			});

			// Return success response
			return {
				success: true,
				token,
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role
				}
			};
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				error: 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.'
			});
		}
	}
};
