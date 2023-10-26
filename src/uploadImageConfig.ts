import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import fsAsync from "fs/promises";
import { IMGFOLDER } from "./constanst";

const storage = multer.memoryStorage();

const upload = multer({
  fileFilter: (req: Request, file, callback) => {
    if (!file.mimetype.includes("image")) {
      console.log(file.mimetype);
      callback(new Error("Solo se permiten subir imagenes"));
    }
    callback(null, true);
  },

  storage: storage,
});

export { upload };
