require("dotenv").config();
import { Request, Response, NextFunction } from "express";

const notFound = (request: Request, response: Response, next: NextFunction) => {
  response.status(404).send("No se encontró esta pagina");
};

export default notFound;
