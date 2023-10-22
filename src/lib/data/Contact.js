// Import nodemailer module
import nodemailer from "nodemailer";

// Export an async function that handles the POST request
export async function post(request) {
  // Retrieve data from POST request body
  const { name, email, message } = request.body;

  // Create transporter with your email service provider configuration
  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g. 'Gmail'
    auth: {
      user: import.meta.env.VITE_EMAIL_ADDRESS, // Your email address
      pass: import.meta.env.VITE_EMAIL_PASSWORD, // Your email password
    },
  });

  // Set email message details
  const mailOptions = {
    from: `"${name}" <${email}>`, // Sender's name and email address
    to: "recipient_email_address@example.com", // Recipient's email address
    subject: "New Contact Message", // Email subject
    text: message, // Email message body
  };

  try {
    // Send email using the transporter and the mail options
    await transporter.sendMail(mailOptions);
    // Return a success response with status code 200 and a message
    return {
      status: 200,
      body: "Message sent successfully!",
    };
  } catch (error) {
    // If there is an error, return a failure response with status code 500 and the error message
    return {
      status: 500,
      body: error.message,
    };
  }
}
