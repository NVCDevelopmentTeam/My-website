import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import contact from '$lib/data/contact';

dotenv.config();

// Tạo một transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  return json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST({ request }) {
  try {
    const data = await request.json();

    // Validate the data
    if (!data.name || !data.email || !data.title || !data.message) {
      return json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Cấu hình nội dung email
    const mailOptions = {
      from: `"${data.name}" <${data.email}>`, // Hiển thị email của người dùng điền vào form
      to: process.env.EMAIL_USER, // Email quản trị viên (email của anh)
      replyTo: data.email, // Email của người dùng điền vào form
      subject: `Contact form submission: ${data.title}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
      // Để nội dung email thêm rõ ràng hơn, ta có thể thêm phần text vào đây.
      html: `<p><strong>Name:</strong> ${data.name}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Message:</strong> ${data.message}</p>`
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    // Lưu dữ liệu liên hệ
    await contact.save(data);

    return json({ success: true, message: 'Thank you for your message!' });
  } catch (error) {
    console.error('Error:', error);
    return json({ success: false, message: 'An error occurred while processing your request' }, { status: 500 });
  }
}
