require("dotenv").config();
import { Request } from "express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as fsAsync from "fs/promises";
import { IMGFOLDER } from "./constanst";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({
  fileFilter: (req: Request, file, cb) => {
    if (!file.mimetype.includes("image")) {
      return cb(new Error("Una imagen es obligatoria"));
    }

    cb(null, true);
  },
  storage: storage,
});

export { upload, cloudinary };
