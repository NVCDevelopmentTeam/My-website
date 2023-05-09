import nodemailer from "nodemailer";

export const post = async (req) => {
  // Retrieve data from POST request body
  const { name, email, message } = req.body;

  // Create transporter with your email service provider configuration
  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g. 'Gmail'
    auth: {
      user: "your_email_address@gmail.com",
      pass: "your_email_password",
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
};
