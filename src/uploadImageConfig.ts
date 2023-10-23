import { Request } from "express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as fsAsync from "fs/promises";
import { IMGFOLDER } from "./constanst";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      console.log(IMGFOLDER);

      if (!fs.existsSync(IMGFOLDER)) {
        await fsAsync.mkdir(IMGFOLDER);
      }
      cb(null, IMGFOLDER);
    } catch (error) {
      console.log(error);
    }
  },

  filename: (req, file, cb) => {
    const filename = file.originalname;
    cb(null, Date.now() + path.extname(filename));
  },
});

const upload = multer({
  fileFilter: (req: Request, file, cb) => {
    if (!file.mimetype.includes("image")) {
      return cb(new Error("Una imagen es obligatoria"));
    }

    cb(null, true);
  },
  storage: storage,
});

export default upload;
