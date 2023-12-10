import { Anillo } from "../entity/Anillo";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import GenericController from "./GenericController";

class AnilloController extends GenericController<Anillo> {
  constructor(entity: EntityTarget<Anillo>) {
    super(entity);
  }
}

export default AnilloController;
