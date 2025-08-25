require("dotenv").config(); // Ensure environment variables are loaded
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
    console.log("nodemailer page");
    console.log("to=",to,"subject",subject,"text=",text)
    
  // console.log("Receiver:", to);
  // console.log("Subject:", subject);
  // console.log("Text:", text);

  // Debugging .env loading issue
//    console.log("EMAIL_USER:", process.env.EMAIL_USER);
//  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Exists" : "Missing");

  try {
    const info = await transporter.sendMail({
      from: `"PETCARE " <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<div ><h1>Petcare</h1> ${text} <div>`
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendMail;
