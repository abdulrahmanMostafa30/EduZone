
const axios = require("axios");
const recaptchaMiddleware = async (recaptchaToken) => {


  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHAV3_SECRET_KEY,
        response: recaptchaToken,
      },
    }
  );

  const data = response.data;
  const isValidCaptcha = data.success && data.score >= 0.5;

  if (!isValidCaptcha) {
    return false
  }
  return true
}

module.exports = {
  recaptchaMiddleware,
};
