import { Solitario } from "../entity/Solitario";
import { EntityTarget } from "typeorm";
import { Request, Response } from "express";
import SolitarioRepository from "../repositories/SolitarioRepository";
import * as path from "path";
import * as fs from "fs/promises";

class SolitarioController extends SolitarioRepository {
  constructor(entity: EntityTarget<Solitario>) {
    super(entity);
  }

  async getAllSolitarios(request: Request, response: Response) {
    try {
      const solitarios = await this.getAll();
      return response.status(200).json(solitarios);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async getSolitario(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json("No se encontro id");
      return;
    }

    try {
      const searchTermIdSolitario: any = { ...request.body };
      const solitario = await this.getBy(searchTermIdSolitario);
      response.status(200).json(solitario);
      return;
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async createSolitario(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }

    try {
      const solitario: any = { ...request.body };
      solitario.foto = request.file?.filename;
      const solitarioCreated = await this.create(solitario);
      return response.status(200).json(solitarioCreated);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async updateSolitario(request: Request, response: Response) {
    if (!Object.keys(request.body).length || !request.body.id) {
      response.status(400).json("Peticion sin cuerpo");
      return;
    }

    try {
      const solitarioValues: Solitario = { ...request.body };
      const solitarioUpdated = await this.update(
        { id: solitarioValues.id },
        solitarioValues,
      );
      response.status(200).json(solitarioUpdated);
      return;
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async deleteSolitario(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json("No se encontró id");
      return;
    }

    try {
      const searchTermIdSolitario: any = { ...request.body };

      const solitarioDeleted = await this.delete(searchTermIdSolitario);

      await fs.unlink(
        path.join(__dirname, "..", "public", solitarioDeleted.foto),
      );

      response.status(200).json(solitarioDeleted);

      return;
    } catch (error) {
      return response
        .status(400)
        .json({ error: error + "No se encontró el anillo a eliminar" });
    }
  }
}

export default SolitarioController;
