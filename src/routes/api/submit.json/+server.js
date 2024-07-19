import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import contact from '$lib/data/contact';

dotenv.config();

// Create a transporter for Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  Auth: {
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

    // Configure email content
    const mailOptions = {
      from: `"${data.name}" <${data.email}>`, // Display the email of the user filling out the form
      to: process.env.EMAIL_USER, // Administrator email (your email)
      replyTo: data.email, // Email of the user filling in the form
      subject: `Contact form submission: ${data.title}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
      // To make the email content more clear, we can add text here.
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
    return json({ success: false, message: 'An error occurred while processing your request' }, { status: 500 });
  }
}