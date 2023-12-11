require("dotenv").config();
import UsuarioRepository from "../repositories/UsuarioRepository";
import { Usuario } from "../entity/Usuario";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import { NextFunction, Request, response, Response } from "express";
import InternalServerError from "../interfaces/internalServerError";

class UsuarioController extends UsuarioRepository {
  constructor(entity: EntityTarget<Usuario>) {
    super(entity);
  }

  async getAllUsuarios(request: Request, response: Response) {
    try {
      const usuarios = await this.getAll();
      return response.status(200).json(usuarios);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async getUsuario(request: Request) {
    if (!request.body.id) {
      response.status(400).json({ response: "No se encontro id" });
      return;
    }
    try {
      const searchTermIdAnillo: any = { ...request.body };
      const usuario = await this.getBy(searchTermIdAnillo);
      return response.status(200).json(usuario);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async createUsuario(usuario: Usuario): Promise<Usuario | undefined> {
    try {
      const createdUser: Usuario = await this.create(usuario);
      return createdUser;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUsuario(request: Request, response: Response) {
    if (!request.body.correo || !request.body.rol || !request.query.id) {
      response.status(400).json("No se envio los datos necesarios");
      return;
    }
    try {
      const usuarioValues: Usuario = { ...request.body };

      if (usuarioValues.contrasena) {
        usuarioValues.contrasena = await this.encryptPassword(
          usuarioValues.contrasena,
        );
      }

      console.log(usuarioValues);

      await this.update(
        { id: parseInt(request.query.id as string) },
        usuarioValues,
      );

      return response.status(200).json("Usuario fue editado exitosamente");
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async deleteUsuario(request: Request, response: Response) {
    if (!request.query.id) {
      response.status(400).json({ response: "No se encontro id" });
      return;
    }
    try {
      const searchTermIdUsuario: FindOptionsWhere<Usuario> = {
        id: parseInt(request.query.id as string),
      };

      await this.repository.delete(searchTermIdUsuario);

      return response.status(200).json("Usuario fue eliminado exitosamente");
    } catch (error) {
      return response.status(500).json(error);
    }
  }

  async toggleEstadoUsuario(request: Request, response: Response) {
    if (!request.query.id) {
      response.status(400).json("No se envio los datos necesarios");
      return;
    }
    try {
      const usuarioToInactivate: Usuario = await this.getBy({
        id: parseInt(request.query.id as string),
      });

      usuarioToInactivate.estado = !usuarioToInactivate.estado;

      await this.update({ id: usuarioToInactivate.id }, usuarioToInactivate);

      return response.status(200).json("Usuario fue desactivado correctamente");
    } catch (error) {
      return response.status(500).json(error);
    }
  }

  GetBy = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!request.body) {
      response.status(400).json("Falta cuerpo");
      return;
    }
    try {
      const searchTerm = request.body as FindOptionsWhere<Usuario>;
      const entity = await this.repository.findOneBy(searchTerm);
      response.status(200).json(entity);
      return entity;
    } catch (error) {
      return new InternalServerError(__filename, "GetBy", error);
    }
  };
}

export default UsuarioController;
