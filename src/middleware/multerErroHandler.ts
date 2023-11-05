import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { upload } from "../uploadImageConfig";

export function handleMulterUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const uploadMulterImage = upload.single("image");
  uploadMulterImage(req, res, (error: any) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json("No puedes subir ese tipo de archivo");
    } else if (error) {
      return res.status(500).json("No puedes subir ese tipo de archivo");
    }
    next();
  });
}
