import { EntityTarget } from "typeorm";
import { GenericRepository } from "../repositories/GenericRepository";
import { Dije } from "../entity/Dije";

class DijeRepository extends GenericRepository<Dije> {
  constructor(dijeEntity: EntityTarget<Dije>) {
    super(dijeEntity);
    this.orderById = { id: "DESC" };
  }
}
export default DijeRepository;
