import { createTransport } from "nodemailer";
import "../../env";
import log from "../logger/logger";

const sendEmail = async (to: string, subject: string, content: string) => {
  log.info("sending email to ", to);
  const transporter = createTransport({
    service: process.env.NODE_ENV === "development" ? "gmail" : undefined,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT as string, 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `Ticco <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: content,
  };
  await transporter.sendMail(mailOptions);
  log.info("email sent successfully to ", to);
};

export default sendEmail;
