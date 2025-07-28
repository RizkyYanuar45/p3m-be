const nodeMailer = require("nodemailer");

const sendMail = async (to, subject, text, isHtml = false) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const mailOptions = {
      from: `"P3M Team" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    };

    if (isHtml) {
      mailOptions.html = text;

      mailOptions.text = text
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    } else {
      mailOptions.text = text;
    }

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
