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
  async deleteImage(idJoya: number, publicId: string) {}
}

export default CloudinaryService;
