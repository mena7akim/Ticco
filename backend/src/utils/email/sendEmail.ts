import { createTransport } from "nodemailer";
import "../../env";
import log from "../logger/logger";

const sendEmail = async (to: string, subject: string, content: string) => {
  console.log("sending email to ", to);
  const transporter = createTransport({
    service: "gmail",
    host: "stmp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `Ticksy <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: content,
  };
  log.info(
    "Email",
    `Sending email to ${to} with subject "${subject}" with content "${content}"`
  );
  await transporter.sendMail(mailOptions);
  log.info(
    "Email",
    `Email sent to ${to} with subject "${subject}" with content "${content}"`
  );
};

export default sendEmail;
