const sendgridMail = require("@sendgrid/mail");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function post(request) {
  const { email } = request.body;

  if (!email) {
    return {
      status: 400,
      body: { message: "Email is required" },
    };
  }

  const msg = {
    to: email,
    from: "noreplay@mywebsite.com",
    subject: "Welcome to my website!",
    html: "Thank you for subscribing to my website.",
  };

  try {
    await sendgridMail.send(msg);
    return { status: 200 };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}
