import { json } from '@sveltejs/kit';
import { siteAuthor } from '$lib/data/config';
import { openDB } from '$lib/data/database';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true', // true nếu SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function POST({ request }) {
  const { title, summary, url } = await request.json();

  // Lấy danh sách subscribers từ database
  const db = await openDB();
  const subs = await db.all('SELECT email FROM subscribers WHERE notify_new_post = 1');

  if (!subs.length) {
    return json({ success: true, sent: 0 });
  }

  // Tạo email gửi
  const messages = subs.map(row => ({
    from: `"${siteAuthor}" <${process.env.EMAIL_FROM}>`,
    to: row.email,
    subject: `📝 Bài mới: ${title}`,
    html: `
      <h2>${title}</h2>
      <p>${summary}</p>
      <p><a href="${url}">Xem bài viết tại đây</a></p>
      <hr/>
      <p>— ${siteAuthor}</p>
    `
  }));

  // Gửi email song song
  await Promise.all(messages.map(msg => transporter.sendMail(msg)));

  // Tùy: lưu log thông báo vào DB
  const timestamp = Date.now();
  const id = uuidv4();
  await db.run(
    'INSERT INTO notifications(id, type, meta, created_at) VALUES (?, ?, ?, ?)',
    id, 'new-post', JSON.stringify({ title, url }), timestamp
  );

  return json({ success: true, sent: messages.length });
}
