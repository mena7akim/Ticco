import sendEmail from "../email/sendEmail";
import { EventEmitter } from "events";

class EmailEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

const emailEmitter = new EmailEmitter();

emailEmitter.on(
  "sendEmail",
  (data: { to: string; subject: string; content: string }) => {
    sendEmail(data.to, data.subject, data.content);
  }
);

export default emailEmitter;
