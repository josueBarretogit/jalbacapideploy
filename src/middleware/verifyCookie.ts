require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface PayloadUsuario extends jwt.JwtPayload {
  id: string;
  correo: string;
}

const verifyCookie = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const accessCookie = request.cookies["accessCookie"];
  if (!accessCookie) {
    response.status(401).json({ response: "No puedes acceder a esto" });
    return;
  }
  try {
    const verifiedToken: PayloadUsuario = jwt.verify(
      accessCookie,
      process.env.PRIVATE_KEY,
    ) as PayloadUsuario;
    request.userId = verifiedToken.id;
    request.correo = verifiedToken.correo;
    next();
  } catch (error) {
    return response.status(401).json("Esta cookie es invalida");
  }
};
export default verifyCookie;
