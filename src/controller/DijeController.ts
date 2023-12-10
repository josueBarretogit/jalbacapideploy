import { EntityTarget, FindOptionsWhere } from "typeorm";
import { Dije } from "../entity/Dije";
import GenericController from "./GenericController";

class DijeController extends GenericController<Dije> {
  constructor(entity: EntityTarget<Dije>) {
    super(entity);
  }
}

export default DijeController;
