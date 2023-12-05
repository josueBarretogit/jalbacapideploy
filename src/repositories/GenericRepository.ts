import {
  DataSource,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { AppDataSource } from "../data-source";
import CloudinaryService from "../services/cloudinaryService";
import { Request, Response } from "express";

class GenericRepository<T> {
  public orderById: FindOptionsOrder<T>;
  protected repository: Repository<T>;
  public CloudinaryService: CloudinaryService;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
    this.CloudinaryService = new CloudinaryService();
  }

  async getAll(relations?: FindOptionsRelations<T>): Promise<T[]> {
    if (relations === null) {
      return this.repository.find({
        order: this.orderById,
      });
    }

    return this.repository.find({
      relations: relations,
      order: this.orderById,
    });
  }

  async getBy(
    searchTerm: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    if (relations === null) {
      return this.repository.findOne({
        where: searchTerm,
      });
    }

    return this.repository.findOne({
      where: searchTerm,
      relations: relations,
    });
  }

  async create(entityToCreate: T): Promise<T> {
    return this.repository.save(entityToCreate);
  }

  async update(searchTerm: FindOptionsWhere<T>, valuesToUpdate: T): Promise<T> {
    const entityToUpdate: T = await this.repository.findOneBy(searchTerm);
    Object.assign(entityToUpdate, valuesToUpdate);
    return this.repository.save(entityToUpdate);
  }

  async delete(searchTerm: FindOptionsWhere<T>): Promise<T> {
    const entitytoDelete: T = await this.repository.findOneBy(searchTerm);
    console.log(entitytoDelete);
    return this.repository.remove(entitytoDelete);
  }

  async searchReferencia(request: Request, response: Response) {
    if (!request.body.referencia) {
      console.log(request.body.referencia);
      response.status(400).json("No se recibió referencia");
      return;
    }
    try {
      const searchTermIdAnillo: any = request.body;
      const anillo: any = await this.getBy(searchTermIdAnillo);
      if (anillo) {
        return response.status(200).json(false);
      }
      return response.status(200).json(true);
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}

export { GenericRepository };
