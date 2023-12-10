import AnilloRepository from "../repositories/AnilloRepositorio";
import { Anillo } from "../entity/Anillo";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import { Request, Response } from "express";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

class AnilloController extends AnilloRepository {
  constructor(entity: EntityTarget<Anillo>) {
    super(entity);
  }

  async getAllAnillos(request: Request, response: Response) {
    try {
      console.log(request.cookies);
      const anillos = await this.getAll();
      return response.status(200).json(anillos);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async createAnillo(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const anillo: any = { ...request.body };

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

      anillo.foto = uploaderServiceReponse.url;

      console.log(anillo.foto);
      const anilloCreated: Anillo = await this.create(anillo);

      response.status(200).json({ anilloCreated, foto: anilloCreated.foto });
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async updateAnillo(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      console.log(request.body);
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const anilloValues: Anillo = { ...request.body };
      const anilloUpdated = await this.update(
        { id: parseInt(request.query.id as string) },
        anilloValues,
      );
      return response.status(200).json(anilloUpdated);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async deleteAnillo(request: Request, response: Response) {
    if (!request.query.id) {
      response.status(400).json("No se encontró id");
      return;
    }
    try {
      const searchTermIdAnillo: FindOptionsWhere<Anillo> = {
        id: parseInt(request.query.id as string),
      };

      const anillo = await this.delete(searchTermIdAnillo);

      const deleteOperationResponse = await this.CloudinaryService.deleteImage(
        anillo.foto,
      );

      console.log(deleteOperationResponse);

      response.status(200).json(anillo);
    } catch (error) {
      response.status(400).json(error + "No se encontró el anillo a eliminar");
    }
  }
}

export default AnilloController;
