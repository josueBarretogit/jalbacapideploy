import { NextFunction, Request, Response } from "express";

function verifyImage(request: Request, response: Response, next: NextFunction) {
  if (!request.file) {
    return response.status(400).json({ response: "una imagen es obligatoria" });
  }

  next();
}
export default verifyImage;
