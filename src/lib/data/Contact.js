import nodemailer from "nodemailer";

export async function post({ request }) {
  const { name, email, message } = await request.json();

  // Input validation
  if (!name || !email || !message) {
    return {
      status: 400,
      body: {
        error: "Invalid input data"
      }
    };
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.VITE_EMAIL_ADDRESS,
      pass: process.env.VITE_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "recipient_email_address@example.com",
    subject: "New Contact Message",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      body: {
        message: "Message sent successfully!"
      }
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      body: {
        error: "Failed to send message. Please try again later."
      }
    };
  }
}
