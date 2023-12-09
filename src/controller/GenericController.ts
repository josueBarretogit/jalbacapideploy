import { NextFunction, Request, Response } from "express";
import { EntityTarget, FindOptionsWhere, Repository } from "typeorm";
import { AppDataSource } from "../data-source";

export default abstract class GenericController<T> {
  private readonly genericRepository: Repository<T>;
  constructor(entity: EntityTarget<T>) {
    this.genericRepository = AppDataSource.getRepository(entity);
  }

  private ThrowError(methodWhereErrorOcurred: string, error: Error) {}

  async GetAll(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const entities = await this.genericRepository.find();
      response.status(200).json(entities);
      return entities;
    } catch (error) {
      return next(this.ThrowError("GetAll", error));
    }
  }

  async GetBy(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
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
  }

  async Insert(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
    if (!request.body) {
      response.status(400).json("Falta body");
      return;
    }
    try {
      const entityToInsert: T = this.genericRepository.create();
      Object.assign(entityToInsert, request.body);
      const entityInserted = await this.genericRepository.save(entityToInsert);
      response.status(200).json(entityInserted);
    } catch (error) {
      return next(this.ThrowError("Insert", error));
    }
  }

  async Update(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
    if (!request.body || !request.params.id) {
      response.status(400).json("Falta body o id");
      return;
    }
    try {
      const searchById = request.params as FindOptionsWhere<T>;
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
  }

  async Delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
    if (!request.params.id) {
      response.status(400).json("Falta id");
      return;
    }
    try {
      const searchById = request.params as FindOptionsWhere<T>;
      const entityToDelete: T =
        await this.genericRepository.findOneBy(searchById);
      const entityDeleted: T =
        await this.genericRepository.remove(entityToDelete);
      response.status(200).json(entityDeleted);
      return entityToDelete;
    } catch (error) {
      return next(this.ThrowError("Delete", error));
    }
  }

  async searchReferencia(request: Request, response: Response) {
    if (!request.body.referencia) {
      console.log(request.body.referencia);
      response.status(400).json("No se recibió referencia");
      return;
    }
    try {
      const searchTermIdAnillo: any = request.body;
      const anillo: any =
        await this.genericRepository.findOneBy(searchTermIdAnillo);
      if (anillo) {
        return response.status(200).json(false);
      }
      return response.status(200).json(true);
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}
