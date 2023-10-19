require("dotenv").config();
import UsuarioRepository from "../repositories/UsuarioRepository";
import { Usuario } from "../entity/Usuario";
import { EntityTarget } from "typeorm";
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
      return response.status(400).json({ error: error });
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
      return response.status(400).json({ error: error });
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
    if (!request.body.correo || !request.body.contrasena || !request.body.id) {
      response.status(400).json({ response: "Peticion sin cuerpo valido" });
      return;
    }
    try {
      const usuarioValues: Usuario = { ...request.body };
      const usuarioToUpdate: Usuario = new Usuario(
        usuarioValues.correo,
        usuarioValues.contrasena,
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

      const usuarioUpdated = await this.update(
        { id: usuarioValues.id },
        usuarioToUpdate,
      );
      return response.status(200).json(usuarioUpdated);
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async deleteUsuario(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json({ response: "No se encontro id" });
      return;
    }
    try {
      const searchTermIdUsuario: any = { ...request.body };

      const usuarioDeleted = await this.delete(searchTermIdUsuario);
      return response.status(200).json(usuarioDeleted);
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }
}

export default UsuarioController;
