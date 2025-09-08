import nodemailer from "nodemailer";

export const gamilService = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return await transporter.sendMail({
    from: '"Unlox" <confirmation@unlox.com>',
    to,
    subject,
    html: text,
  });
};

