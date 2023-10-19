import { EntityTarget } from "typeorm";
import { Solitario } from "../entity/Solitario";
import { GenericRepository } from "../repositories/GenericRepository";

class SolitarioRepository extends GenericRepository<Solitario> {
  constructor(solitarioEntity: EntityTarget<Solitario>) {
    super(solitarioEntity);
    this.orderById = { id: "DESC" };
  }
}

export default SolitarioRepository;
