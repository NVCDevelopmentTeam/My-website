import nodemailer from "nodemailer";

export async function post(request) {
  // Retrieve data from POST request body
  const { name, email, message } = request.body;

  // Create transporter with your email service provider configuration
  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g. 'Gmail'
    auth: {
      user: import.meta.env.VITE_EMAIL_ADDRESS,
      pass: import.meta.env.VITE_EMAIL_PASSWORD,
    },
  });

  // Set email message details
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "recipient_email_address@example.com",
    subject: "New Contact Message",
    text: message,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      body: "Message sent successfully!",
    };
  } catch (error) {
    return {
      status: 500,
      body: error.message,
    };
  }
}