import { Request } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  fileFilter: (req: Request, file, callback) => {
    if (!file.mimetype.includes("image")) {
      callback(new Error("Solo se permiten subir imagenes"));
    }
    callback(null, true);
  },

  storage: storage,
});

export default upload;
