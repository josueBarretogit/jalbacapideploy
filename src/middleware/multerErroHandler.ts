import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { upload } from "../uploadImageConfig";

const uploadMulterImage = upload.single("image");

export function handleMulterUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadMulterImage(req, res, (error: any) => {
    if (error instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ response: "Hubo un error a la hora de subir la imagen" });
    }
  });

  next();
}
