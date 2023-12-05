import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import Logger from "../logger/logger";

const errorHandler: ErrorRequestHandler = (
  error: Error,
  request,
  response,
  next,
) => {
  const logger = new Logger(error.message, 500);
  logger.logShortError();
  response.status(500).json({ message: "Hubo un error inesperado" });
};

export default errorHandler;
