import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import fsAsync from "fs/promises";
import { IMGFOLDER } from "./constanst";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

export { upload };
