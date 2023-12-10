import * as nodemailer from "nodemailer";
import InternalServerError from "../interfaces/internalServerError";
import { MailOptions } from "nodemailer/lib/json-transport";

export default class EmailService {
  transporter: nodemailer.Transporter;
  mailOptions: MailOptions;
  internalServerError: InternalServerError;
  constructor(internalServerError: InternalServerError) {
    this.internalServerError = internalServerError;
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
      subject: `Ocurrió un error de tipo: ${this.internalServerError.error.name} fecha: ${this.internalServerError.errorDate}`,
      text: `Detalles del error:
      ${this.internalServerError.error.stack}`,
    };
  }

  async sendEmail() {
    const response = await this.transporter.sendMail(this.mailOptions);
    return response;
  }
}
