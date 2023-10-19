import DijeRepository from "../repositories/DijeRepository";
import { EntityTarget } from "typeorm";
import { Request, Response } from "express";
import { Dije } from "../entity/Dije";
import * as path from "path";
import * as fs from "fs/promises";

class DijeController extends DijeRepository {
  constructor(entity: EntityTarget<Dije>) {
    super(entity);
  }

  async getAllDijes(request: Request, response: Response) {
    try {
      const dijes = await this.getAll();
      return response.status(200).json(dijes);
    } catch (error) {
      return response.status(400).json({ messagge: error });
    }
  }

  async getDije(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json({ response: "No se encontro id" });
      return;
    }
    try {
      const searchTermIdDije: any = { ...request.body };
      const dije = await this.getBy(searchTermIdDije);
      return response.status(200).json(dije);
    } catch (error) {
      return response.status(400).json({ messagge: error });
    }
  }

  async createDije(request: Request, response: Response) {
    if (!Object.keys(request.body).length) {
      response.status(400).json({ response: "Peticion sin cuerpo" });
      return;
    }
    try {
      const dije: any = { ...request.body };

      dije.foto = request.file?.filename;
      const dijeCreated = await this.create(dije);

      return response.status(200).json(dijeCreated);
    } catch (error) {
      return response.status(400).json({ messagge: error });
    }
  }

  async updateDije(request: Request, response: Response) {
    const receivedInvalidBody = !Object.keys(request.body).length;
    if (receivedInvalidBody) {
      response.status(400).json({ response: "Peticion sin cuerpo" });
      return;
    }
    try {
      const dijeToUpdate = { ...request.body };
      const dijeUpdated = await this.update(
        { id: dijeToUpdate.idDije },
        dijeToUpdate,
      );
      return response.status(200).json(dijeUpdated);
    } catch (error) {
      return response.status(400).json({ messagge: error });
    }
  }

  async deleteDije(request: Request, response: Response) {
    if (!request.body.id) {
      response.status(400).json({ response: "No se encontro id" });

      return;
    }
    try {
      const searchTermIdDije: any = { ...request.body };
      const dije = await this.delete(searchTermIdDije);

      await fs.unlink(path.join(__dirname, "..", "public", dije.foto));

      return response.status(200).json(dije);
    } catch (error) {
      return response
        .status(400)
        .json({ messagge: error + "No se encontró el dije a eliminar" });
    }
  }
}

export default DijeController;
