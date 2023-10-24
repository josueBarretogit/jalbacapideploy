require("dotenv").config();
import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import fsAsync from "fs/promises";
import { IMGFOLDER } from "./constanst";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

export { upload, cloudinary };
