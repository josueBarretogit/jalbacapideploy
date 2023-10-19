import { validate, ValidationError } from "class-validator";
import { EntityTarget } from "typeorm";
import Usuario from "../entity/Usuario";
import { GenericRepository } from "../repositories/GenericRepository";
import * as bcrypt from "bcrypt";

class UsuarioRepository extends GenericRepository<Usuario> {
  constructor(usuarioEntity: EntityTarget<Usuario>) {
    super(usuarioEntity);
    this.orderById = { id: "DESC" };
  }

  async validateCreateUsuario(usuario: Usuario): Promise<ValidationError[]> {
    return validate(usuario);
  }

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 15);
  }

  async comparePassword(
    passwordReceived: string,
    passwordStored: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordReceived, passwordStored);
  }
}

export default UsuarioRepository;
