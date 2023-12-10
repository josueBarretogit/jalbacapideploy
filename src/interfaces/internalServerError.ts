export default class InternalServerError {
  readonly statusCode = 500;
  readonly fileLocation: string;
  readonly methodLocation: string;
  readonly error: Error;
  readonly errorDate: string = new Date().toLocaleString();

  constructor(fileLocation: string, methodLocation: string, error: Error) {
    this.fileLocation = fileLocation;
    this.methodLocation = methodLocation;
    this.error = error;
  }
}
