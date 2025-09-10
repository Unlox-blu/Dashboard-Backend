import nodemailer from "nodemailer";

export const gmailService = async (to, subject, text) => {
  // Check if email credentials are properly configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
    throw new Error('Email service not configured');
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be an App Password, not regular password
    },
  });

  try {
    const result = await transporter.sendMail({
      from: `"Unlox" <${process.env.EMAIL_USER}>`, // Use the actual email as sender
      to,
      subject,
      html: text,
    });
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    throw error;
  }
};

// // Alternative: Mock email service for development
export const mockEmailService = async (to, subject, text) => {
  console.log('=== MOCK EMAIL SERVICE ===');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  console.log('=========================');
  return { messageId: 'mock-' + Date.now() };
};

