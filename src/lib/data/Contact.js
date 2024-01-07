import nodemailer from "nodemailer";

export async function post(request) {
  const { name, email, message } = request.body;

  // Input validation
  if (!name || !email || !message) {
    return {
      status: 400,
      body: "Invalid input data",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: import.meta.env.VITE_EMAIL_ADDRESS,
      pass: import.meta.env.VITE_EMAIL_PASSWORD,
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
      body: "Message sent successfully!",
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      status: 500,
      body: error.message,
    };
  }
}
