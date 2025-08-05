import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { z } from 'zod';

const prisma = new PrismaClient();

// Email configuration
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || 'smtp.gmail.com',
	port: process.env.SMTP_PORT || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
});

// Generate 6-digit OTP
function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp, name) {
	const mailOptions = {
		from: process.env.SMTP_FROM || 'noreply@codingNguyen.com',
		to: email,
		subject: 'Mã xác thực tài khoản - Coding Nguyễn',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
					<h1 style="color: white; margin: 0;">Coding Nguyễn</h1>
				</div>
				
				<div style="padding: 30px; background: #f9f9f9;">
					<h2 style="color: #333; margin-bottom: 20px;">Xin chào ${name}!</h2>
					
					<p style="color: #666; line-height: 1.6;">
						Cảm ơn bạn đã đăng ký tài khoản tại Coding Nguyễn. Để hoàn tất quá trình đăng ký, 
						vui lòng sử dụng mã xác thực bên dưới:
					</p>
					
					<div style="text-align: center; margin: 30px 0;">
						<div style="background: white; border: 2px dashed #667eea; padding: 20px; display: inline-block; border-radius: 10px;">
							<h1 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
						</div>
					</div>
					
					<p style="color: #666; line-height: 1.6;">
						Mã xác thực này có hiệu lực trong <strong>10 phút</strong>. 
						Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
					</p>
					
					<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
						<p style="color: #999; font-size: 12px; text-align: center;">
							Email này được gửi tự động, vui lòng không trả lời.<br>
							© 2025 Coding Nguyễn. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		`
	};

	await transporter.sendMail(mailOptions);
}

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const email = data.get('email')?.toString().toLowerCase().trim();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirm-password')?.toString();

		// Validation
		const errors = {};

		if (!name || name.length < 2) {
			errors.name = 'Họ tên phải có ít nhất 2 ký tự';
		}

		if (!email) {
			errors.email = 'Email là bắt buộc';
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				errors.email = 'Định dạng email không hợp lệ';
			}
		}

		if (!password) {
			errors.password = 'Mật khẩu là bắt buộc';
		} else {
			// Password strength validation
			if (password.length < 8) {
				errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
			} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
				errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
			}
		}

		if (password !== confirmPassword) {
			errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				error: 'Vui lòng kiểm tra lại thông tin đăng ký',
				errors
			});
		}

		try {
			// Check if user already exists
			const existingUser = await prisma.user.findUnique({
				where: { email }
			});

			if (existingUser) {
				return fail(400, {
					error: 'Email này đã được sử dụng',
					errors: {
						email: 'Email này đã được sử dụng'
					}
				});
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 12);

			// Generate OTP
			const otp = generateOTP();
			const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

			// Create user with pending verification
			const user = await prisma.user.create({
				data: {
					firstName: name.split(' ')[0],
					lastName: name.split(' ').slice(1).join(' '),
					email,
					hashedPassword,
					role: 'ADMIN', // First user is admin
					isActive: false, // Will be activated after email verification
					emailVerified: false,
					otpCode: otp,
					otpExpires
				}
			});

			// Send OTP email
			await sendOTPEmail(email, otp, name);

			return {
				success: true,
				otpSent: true,
				message: 'Tài khoản đã được tạo. Vui lòng kiểm tra email để xác thực.'
			};
		} catch (error) {
			console.error('Registration error:', error);

			// Handle specific Prisma errors
			if (error.code === 'P2002') {
				return fail(400, {
					error: 'Email này đã được sử dụng',
					errors: {
						email: 'Email này đã được sử dụng'
					}
				});
			}

			return fail(500, {
				error: 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.'
			});
		}
	},

	'verify-otp': async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().toLowerCase().trim();
		const otp = data.get('otp')?.toString().trim();

		// Validation
		if (!email || !otp) {
			return fail(400, {
				error: 'Email và mã OTP là bắt buộc',
				errors: {
					otp: !otp ? 'Mã OTP là bắt buộc' : undefined
				}
			});
		}

		if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
			return fail(400, {
				error: 'Mã OTP phải là 6 chữ số',
				errors: {
					otp: 'Mã OTP phải là 6 chữ số'
				}
			});
		}

		try {
			// Find user with matching email and OTP
			const user = await prisma.user.findFirst({
				where: {
					email,
					otpCode: otp,
					otpExpires: {
						gt: new Date()
					}
				}
			});

			if (!user) {
				return fail(400, {
					error: 'Mã OTP không hợp lệ hoặc đã hết hạn',
					errors: {
						otp: 'Mã OTP không hợp lệ hoặc đã hết hạn'
					}
				});
			}

			// Activate user account
			await prisma.user.update({
				where: { id: user.id },
				data: {
					isActive: true,
					emailVerified: true,
					emailVerifiedAt: new Date(),
					otpCode: null,
					otpExpires: null
				}
			});

			return {
				success: true,
				message: 'Tài khoản đã được xác thực thành công. Bạn có thể đăng nhập ngay bây giờ.'
			};
		} catch (error) {
			console.error('OTP verification error:', error);
			return fail(500, {
				error: 'Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại.'
			});
		}
	}
};
