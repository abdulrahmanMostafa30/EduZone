const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Abdelrhman Mostafa <hello@eduzone.io",
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: `
    <h3>Forgot your password?</h3>
    <p>Don't worry! We've got you covered.</p>
    <p>Please click on the following link to reset your password:</p>
    <p><a href="${options.resetLink}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The EduZone Team</p>
  `,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
