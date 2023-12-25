import { NextFunction, Request, Response } from "express";
import {
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { IEntity } from "../interfaces/interfaces";
import CloudinaryService from "../services/cloudinaryService";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import InternalServerError from "../interfaces/internalServerError";

export default abstract class GenericController<T extends IEntity = any> {
  readonly genericRepository: Repository<T>;
  public readonly CloudinaryService: CloudinaryService;
  constructor(entity: EntityTarget<T>) {
    this.genericRepository = AppDataSource.getRepository(entity);
    this.CloudinaryService = new CloudinaryService();
  }

  private ThrowError(methodWhereErrorOcurred: string, error: Error) {
    return new InternalServerError(__filename, methodWhereErrorOcurred, error);
  }

  GetAll = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const entities = await this.genericRepository.find({
        order: {
          id: "DESC",
        } as FindOptionsOrder<T>,
      });
      response.status(200).json(entities);
      return entities;
    } catch (error) {
      return next(this.ThrowError("GetAll", error));
    }
  };

  GetBy = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!request.body) {
      response.status(400).json("Falta cuerpo");
      return;
    }
    try {
      const searchTerm = request.body as FindOptionsWhere<T>;
      const entity = await this.genericRepository.findOneBy(searchTerm);
      response.status(200).json(entity);
      return entity;
    } catch (error) {
      return next(this.ThrowError("GetBy", error));
    }
  };

  Insert = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!request.body) {
      response.status(400).json("Falta body");
      return;
    }
    try {
      const entityToInsert: T = this.genericRepository.create();
      Object.assign(entityToInsert, request.body);

      const uploaderServiceReponse: UploadApiResponse | UploadApiErrorResponse =
        await this.CloudinaryService.uploadImage(
          request.file.buffer,
          request.file.originalname,
        );

      console.log(uploaderServiceReponse);
      entityToInsert.foto = uploaderServiceReponse.secure_url;

      const entityInserted = await this.genericRepository.save(entityToInsert);
      response.status(200).json({ entityInserted, foto: entityInserted.foto });
    } catch (error) {
      return next(this.ThrowError("Insert", error));
    }
  };

  Update = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!request.body || !request.query.id) {
      response.status(400).json("Falta body o id");
      return;
    }
    try {
      const searchById = request.query as FindOptionsWhere<T>;
      const entityToUpdate: T =
        await this.genericRepository.findOneBy(searchById);
      if (!entityToUpdate) {
        response.status(200).json("No se encontro esta entidad");
        return;
      }
      Object.assign(entityToUpdate, request.body);
      const entityUpdated = await this.genericRepository.save(entityToUpdate);
      response.status(200).json(entityUpdated);
      return entityUpdated;
    } catch (error) {
      return next(this.ThrowError("Update", error));
    }
  };

  Delete = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!request.query.id) {
      response.status(400).json("Falta id");
      return;
    }
    try {
      const searchById = request.query as FindOptionsWhere<T>;
      const entityToDelete: T =
        await this.genericRepository.findOneBy(searchById);

      const deleteOperationResponse = await this.CloudinaryService.deleteImage(
        entityToDelete.foto,
      );

      const entityDeleted: T =
        await this.genericRepository.remove(entityToDelete);

      response.status(200).json(entityDeleted);
      return entityToDelete;
    } catch (error) {
      return next(this.ThrowError("Delete", error));
    }
  };

  SearchReferencia = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    if (!request.body.referencia) {
      response.status(400).json("No se recibió referencia");
      return;
    }
    try {
      const searchTermIdEntity: any = request.body;
      const entity: any =
        await this.genericRepository.findOneBy(searchTermIdEntity);
      if (entity) {
        return response.status(200).json(false);
      }
      return response.status(200).json(true);
    } catch (error) {
      return next(this.ThrowError("SearchReferencia", error));
    }
  };

  ReplaceImage = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    if (!Object.keys(request.query.id)) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }
    try {
      const searchTermIdEntity: any = request.query;
      const anilloToReplaceImage =
        await this.genericRepository.findOneBy(searchTermIdEntity);

      const url = anilloToReplaceImage.foto;
      const buffer = request.file.buffer;
      const filename = request.file.originalname;

      const cloudinaryResponse = await this.CloudinaryService.updateImage(
        url,
        buffer,
        filename,
      );

      anilloToReplaceImage.foto = cloudinaryResponse.secure_url;

      const updatedAnillo: T =
        await this.genericRepository.save(anilloToReplaceImage);

      return response.status(200).json(updatedAnillo);
    } catch (error) {
      return next(this.ThrowError("ReplaceImage", error));
    }
  };
}
