const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const user = process.env.EMAIL_USER || 'freeads.testing@gmail.com';
    const pass = process.env.EMAIL_PASS || 'qqfvjrstbsgawvar';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `FreeAds <${user}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully delivered to ${to}: ${info.response}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message || error);
    return false;
  }
};

module.exports = sendEmail;
