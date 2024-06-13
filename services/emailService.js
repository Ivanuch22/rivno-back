const nodemailer = require('nodemailer');

const createTransporter = () => {
  console.log(process.env.MAIL_USER)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter;
};

const send = async (to, subject, body) => {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: `${process.env.MAIL_USER} `, 
      to: to, 
      subject: subject, 
      text: "Hello world?", 
      html: body, 
    });

    console.log('Email sent:', info);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

module.exports = {
  send,
};

