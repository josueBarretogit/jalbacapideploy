import DijeRepository from "../repositories/DijeRepository";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import { Request, Response } from "express";
import { Dije } from "../entity/Dije";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

class DijeController extends DijeRepository {
  constructor(entity: EntityTarget<Dije>) {
    super(entity);
  }

  async getAllDijes(request: Request, response: Response) {
    try {
      const dijes = await this.getAll();
      return response.status(200).json(dijes);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async getDije(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json("No se encontro id");
      return;
    }
    try {
      const searchTermIdDije: any = { ...request.body };
      const dije = await this.getBy(searchTermIdDije);
      return response.status(200).json(dije);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async createDije(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const dije: Dije = { ...request.body };

      const uploaderServiceReponse: UploadApiResponse | UploadApiErrorResponse =
        await this.CloudinaryService.uploadImage(
          request.file.buffer,
          request.file.originalname,
        );

      if ("message" in uploaderServiceReponse) {
        return response
          .status(500)
          .json({ response: uploaderServiceReponse.message });
      }

      dije.foto = uploaderServiceReponse.url;
      const dijeCreated = await this.create(dije);
      return response.status(200).json(dijeCreated);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async updateDije(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const dijeToUpdate: Dije = { ...request.body };

      const dijeUpdated = await this.update(
        { id: parseInt(request.query.id as string) },
        dijeToUpdate,
      );

      return response.status(200).json(dijeUpdated);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async deleteDije(request: Request, response: Response) {
    if (!request.query.id) {
      response.status(400).json("No se encontro id");

      return;
    }
    try {
      const searchTermDije: FindOptionsWhere<Dije> = {
        id: parseInt(request.query.id as string),
      };

      const dijeDeleted = await this.delete(searchTermDije);

      const deleteOperationResponse = await this.CloudinaryService.deleteImage(
        dijeDeleted.foto,
      );

      console.log(deleteOperationResponse);

      return response.status(200).json(dijeDeleted);
    } catch (error) {
      return response.status(400).json({ messagge: error });
    }
  }
  async replaceImage(request: Request, response: Response) {
    if (!Object.keys(request.query.id)) {
      console.log(request.body);
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const dijeToReplaceImage: Dije = await this.getBy({
        id: parseInt(request.query.id as string),
      });

      const url = dijeToReplaceImage.foto;
      const buffer = request.file.buffer;
      const filename = request.file.originalname;

      const cloudinaryResponse = await this.CloudinaryService.updateImage(
        url,
        buffer,
        filename,
      );

      if ("message" in cloudinaryResponse) {
        return response.status(500).json(cloudinaryResponse.message);
      }

      dijeToReplaceImage.foto = cloudinaryResponse.url;

      const updatedDije: Dije = await this.update(
        { id: dijeToReplaceImage.id },
        dijeToReplaceImage,
      );
      console.log(cloudinaryResponse);

      return response.status(200).json(updatedDije);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default DijeController;
