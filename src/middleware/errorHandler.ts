import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import EmailService from "../services/emailService";

const errorHandler: ErrorRequestHandler = (
  error: Error,
  request,
  response,
  next,
) => {
  const emailService = new EmailService();
  response.status(500).json({ message: "Hubo un error inesperado" });
};

export default errorHandler;
