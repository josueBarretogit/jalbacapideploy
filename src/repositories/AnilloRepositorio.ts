import { EntityTarget, FindOptionsOrder } from "typeorm";
import { Anillo } from "../entity/Anillo";
import { GenericRepository } from "../repositories/GenericRepository";

class AnilloRepository extends GenericRepository<Anillo> {
  constructor(anilloEntity: EntityTarget<Anillo>) {
    super(anilloEntity);
    this.orderById = { id: "DESC" };
  }
}

export default AnilloRepository;
