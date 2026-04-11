// services/auth-service/src/utils/mail.util.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendMail = async ({ to, subject, html }) => {

  await transporter.sendMail({
  from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
  to,
  subject,
  html
  }, (err, info) => {
    if (err) {
      console.error("MAIL ERROR:", err);
    } else {
      console.log("MAIL SENT:", info);
    }
  });

};