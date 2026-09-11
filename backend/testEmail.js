const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'freeads.testing@gmail.com',
        pass: 'qqfvjrstbsgawvar',
      },
    });

    const mailOptions = {
      from: `FreeAds <freeads.testing@gmail.com>`,
      to: 'freeads.testing@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from the FreeAds system.',
    };

    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.response}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    if (error.response) {
        console.error('SMTP Response:', error.response);
    }
  }
}

testEmail();
