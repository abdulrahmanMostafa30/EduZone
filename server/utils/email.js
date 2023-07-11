const nodemailer = require("nodemailer");
const { google } = require('googleapis');

// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.EMAIL_CLIENT_ID
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const sendEmail = async (options) => {
  const accessToken = await oAuth2Client.getAccessToken();

  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USERNAME,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  // const transporter = nodemailer.createTransport({      
  //   host: process.env.EMAIL_HOST,
  //   auth: {
  //     type: "login", // default
  //     user:  process.env.EMAIL_HOST,
  //     pass: process.env.EMAIL_PASSWORD,
  //   }
  // });
 

  // 2) Define the email options
  const mailOptions = {
    from: `EduZone <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
