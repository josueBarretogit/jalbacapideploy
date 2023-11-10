import { Solitario } from "../entity/Solitario";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import { Request, Response } from "express";
import SolitarioRepository from "../repositories/SolitarioRepository";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

class SolitarioController extends SolitarioRepository {
  constructor(entity: EntityTarget<Solitario>) {
    super(entity);
  }

  async getAllSolitarios(request: Request, response: Response) {
    try {
      const solitarios = await this.getAll();
      return response.status(200).json(solitarios);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async getSolitario(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json("No se encontro id");
      return;
    }

    try {
      const searchTermIdSolitario: any = { ...request.body };
      const solitario = await this.getBy(searchTermIdSolitario);
      response.status(200).json(solitario);
      return;
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async createSolitario(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }

    try {
      const solitario: Solitario = { ...request.body };

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

      solitario.foto = uploaderServiceReponse.url;
      const solitarioCreated = await this.create(solitario);
      return response.status(200).json(solitarioCreated);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async updateSolitario(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }

    try {
      const solitarioValues: Solitario = { ...request.body };

      const solitarioUpdated = await this.update(
        { id: parseInt(request.query.id as string) },
        solitarioValues,
      );

      response.status(200).json(solitarioUpdated);
      return;
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async deleteSolitario(request: Request, response: Response) {
    if (!request.query.id) {
      response.status(400).json("No se encontró id");
      return;
    }

    try {
      const searchTermIdSolitario: FindOptionsWhere<Solitario> = {
        id: parseInt(request.query.id as string),
      };

      const solitarioDeleted = await this.delete(searchTermIdSolitario);

      const deleteOperationResponse = await this.CloudinaryService.deleteImage(
        solitarioDeleted.foto,
      );

      console.log(deleteOperationResponse);

      response.status(200).json(solitarioDeleted);

      return;
    } catch (error) {
      return response
        .status(400)
        .json({ error: error + "No se encontró el solitario a eliminar" });
    }
  }
  async replaceImage(request: Request, response: Response) {
    if (!Object.keys(request.query.id)) {
      console.log(request.body);
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const solitarioToReplaceImage: Solitario = await this.getBy({
        id: parseInt(request.query.id as string),
      });

      const url = solitarioToReplaceImage.foto;
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

      solitarioToReplaceImage.foto = cloudinaryResponse.url;

      const updatedSolitario: Solitario = await this.update(
        { id: solitarioToReplaceImage.id },
        solitarioToReplaceImage,
      );
      console.log(cloudinaryResponse);

      return response.status(200).json(updatedSolitario);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default SolitarioController;
