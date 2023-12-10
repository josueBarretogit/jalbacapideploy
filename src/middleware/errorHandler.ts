import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import EmailService from "../services/emailService";
import InternalServerError from "../interfaces/internalServerError";

const errorHandler: ErrorRequestHandler = async (
  error: InternalServerError,
  request,
  response,
  next,
) => {
  try {
    const emailService = new EmailService(error);
    await emailService.sendEmail();
    response.status(500).json({ message: "Hubo un error inesperado" });
  } catch (error) {
    response.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export default errorHandler;
