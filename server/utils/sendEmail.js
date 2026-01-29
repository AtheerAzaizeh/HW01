import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn('Email credentials not found in env. Email not sent.');
      return;
  }
    
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
