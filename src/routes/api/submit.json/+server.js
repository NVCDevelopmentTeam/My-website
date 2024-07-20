import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import contact from '$lib/data/contact';  // Make sure the path and file extension are correct

dotenv.config();

// Create a transporter for Nodemailer using SSL
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Using SSL
  secure: true, // true for 465, false for other ports
  Auth: {
    user: process.env.SMTP_USER, // Actually the outgoing email
    pass: process.env.SMTP_PASS // Application password
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

    // Configure email content
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`, // Sender name and email address
      to: process.env.SMTP_USER, // Administrator email (your email)
      replyTo: data.email, // Email of the form sender
      subject: `Contact form submission: ${data.title}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
      html: `<p><strong>Name:</strong> ${data.name}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Message:</strong> ${data.message}</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Save contact data
    await contact.save(data);

    return json({ success: true, message: 'Thank you for your message!' });
  } catch (error) {
    console.error('Error:', error);
    return json({ success: false, message: `An error occurred while processing your request: ${error.message}` }, { status: 500 });
  }
}