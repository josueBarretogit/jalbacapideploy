require("dotenv").config();
import UsuarioRepository from "../repositories/UsuarioRepository";
import { Usuario } from "../entity/Usuario";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import { NextFunction, Request, response, Response } from "express";

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
    if (!request.body.correo || !request.body.contrasena || !request.query.id) {
      response.status(400).json("No se envio los datos necesarios");
      return;
    }
    try {
      const usuarioValues: Usuario = { ...request.body };

      const usuarioToUpdate: Usuario = new Usuario(
        usuarioValues.correo,
        usuarioValues.contrasena,
        usuarioValues.rol,
      );

      const erroresValidacion =
        await this.validateCreateUsuario(usuarioToUpdate);

      if (erroresValidacion.length > 0) {
        response.status(400).json({ errors: erroresValidacion });
        return;
      }

      usuarioToUpdate.contrasena = await this.encryptPassword(
        usuarioValues.contrasena,
      );

      await this.update({ id: usuarioValues.id }, usuarioToUpdate);

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
}

export default UsuarioController;
