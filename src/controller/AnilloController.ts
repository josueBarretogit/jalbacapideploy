import AnilloRepository from "../repositories/AnilloRepositorio";
import { Anillo } from "../entity/Anillo";
import { EntityTarget } from "typeorm";
import { Request, Response } from "express";
import * as fs from "fs/promises";
import * as path from "path";
import DataURIParser from "datauri/parser";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

class AnilloController extends AnilloRepository {
  constructor(entity: EntityTarget<Anillo>) {
    super(entity);
  }

  async getAllAnillos(request: Request, response: Response) {
    try {
      const anillos = await this.getAll();
      return response.status(200).json(anillos);
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async getAnillo(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json({ response: "No se encontro id" });
      return;
    }
    try {
      const searchTermIdAnillo: any = { ...request.body };
      const anillo = await this.getBy(searchTermIdAnillo);
      return response.status(200).json(anillo);
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async createAnillo(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json({ response: "Peticion sin cuerpo" });
      return;
    }
    try {
      const anillo: any = { ...request.body };

      const uploaderServiceReponse: UploadApiResponse | UploadApiErrorResponse =
        await this.CloudinaryService.uploadImage(
          request.file.buffer,
          request.file.originalname,
        );

      anillo.foto = uploaderServiceReponse.url;

      console.log(anillo.foto);
      const anilloCreated: Anillo = await this.create(anillo);

      response.status(200).json({ anilloCreated, foto: anilloCreated.foto });
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async updateAnillo(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      console.log(request.body);
      response.status(400).json({ response: "Peticion sin cuerpo" });
      return;
    }
    try {
      const anilloValues: Anillo = { ...request.body };
      const anilloUpdated = await this.update(
        { id: parseInt(request.params.id) },
        anilloValues,
      );
      return response.status(200).json(anilloUpdated);
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async deleteAnillo(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json({ response: "No se encontró id" });
      return;
    }
    try {
      const searchTermIdAnillo: any = { ...request.body };

      const anillo = await this.delete(searchTermIdAnillo);

      return response.status(200).json(anillo);
    } catch (error) {
      return response
        .status(400)
        .json({ error: error + "No se encontró el anillo a eliminar" });
    }
  }
  async replaceImage(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      console.log(request.body);
      response.status(400).json({ response: "Peticion sin cuerpo" });
      return;
    }
    try {
      const anilloValues: Anillo = { ...request.body };
      const anilloUpdated = await this.update(
        { id: parseInt(request.params.id) },
        anilloValues,
      );
      return response.status(200).json(anilloUpdated);
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }
}

export default AnilloController;
