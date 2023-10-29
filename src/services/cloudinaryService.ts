require("dotenv").config();
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import DataURIParser from "datauri/parser";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class CloudinaryService {
  uploader = cloudinary.uploader;

  imgParser = new DataURIParser();

  async uploadImage(
    buffer: Buffer,
    filename: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const imgData = this.imgParser.format(
      path.extname(filename).toString(),
      buffer,
    );

    const imgMetaData = await this.uploader.upload(imgData.content);

    return imgMetaData;
  }

  async deleteImage(url: string) {
    const parseUrl = url.split("/");

    const publicId = parseUrl[parseUrl.length - 1];

    const publicIdWithoutExtname = publicId.split(".")[0];
    return this.uploader.destroy(publicIdWithoutExtname);
  }

  async updateImage(url: string, buffer: Buffer, filename: string) {
    await this.deleteImage(url);
    return this.uploadImage(buffer, filename);
  }
}

export default CloudinaryService;
