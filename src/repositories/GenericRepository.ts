import {
  DataSource,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { cloudinary } from "../uploadImageConfig";

class GenericRepository<T> {
  public orderById: FindOptionsOrder<T>;
  protected repository: Repository<T>;
  public cloudinaryProvider = cloudinary;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
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

  async deleteJoya(searchTerm: FindOptionsWhere<T>): Promise<T> {
    const entitytoDelete: T = await this.repository.findOneBy(searchTerm);
    const splitUrl = (entitytoDelete as { foto: string }).foto.split("/");
    const imgUrl = splitUrl[splitUrl.length - 1];
    this.cloudinaryProvider.uploader.destroy(imgUrl);
    console.log((entitytoDelete as any).foto);
    return this.repository.remove(entitytoDelete);
  }

  async delete(searchTerm: FindOptionsWhere<T>): Promise<T> {
    const entitytoDelete: T = await this.repository.findOneBy(searchTerm);
    const splitUrl = (entitytoDelete as { foto: string }).foto.split("/");
    const imgUrl = splitUrl[splitUrl.length - 1];
    this.cloudinaryProvider.uploader.destroy(imgUrl);
    console.log((entitytoDelete as any).foto);
    return this.repository.remove(entitytoDelete);
  }
}

export { GenericRepository };
