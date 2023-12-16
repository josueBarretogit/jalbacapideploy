import { ErrorRequestHandler } from "express";
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

    if (error.error.message == "Solo se permiten subir imagenes") {
      return response.status(500).json("Solo se permiten subir imagenes");
    }

    await emailService.sendEmail();

    response.status(500).json("Hubo un error inesperado");
  } catch (error) {
    response.status(500).json("Hubo un error inesperado");
  }
};

export default errorHandler;
