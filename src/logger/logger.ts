import * as fs from "fs";
import * as path from "path";

export default class Logger extends Error {
  readonly statusCode: number;
  readonly errorDate: string | Date;

  constructor(message: string, statuscode: number) {
    super(message);
    this.statusCode = statuscode;
    this.errorDate = new Date();
    Object.setPrototypeOf(this, Logger.prototype);
  }

  logShortError() {
    const errorMessage = `Codigo error: ${this.name} \n Mensaje: ${this.message} \n Fecha: ${this.errorDate}
     `;
    fs.appendFile(
      path.join(__dirname, "..", "..", "logs", "erroresAbreviados.txt"),
      errorMessage + "\n \n",
      (err) => {
        if (err) console.log(err);
      },
    );
  }
}
