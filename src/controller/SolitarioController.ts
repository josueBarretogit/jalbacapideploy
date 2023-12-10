import { Solitario } from "../entity/Solitario";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import GenericController from "./GenericController";

class SolitarioController extends GenericController<Solitario> {
  constructor(entity: EntityTarget<Solitario>) {
    super(entity);
  }
}

export default SolitarioController;
