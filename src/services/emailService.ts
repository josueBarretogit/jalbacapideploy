import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export default class EmailService {
  transporter: nodemailer.Transporter;
  mailOptions: MailOptions;
  error: Error;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
    this.mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
    };
  }

  async sendEmail(emailSubject: string, bodytextEmail: string) {
    this.mailOptions.subject = emailSubject;
    this.mailOptions.text = bodytextEmail;
    const response = await this.transporter.sendMail(this.mailOptions);
    return response;
  }
}
