import { Request } from "express";
import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}build/public2`);
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
