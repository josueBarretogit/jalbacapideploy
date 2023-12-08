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
    const verifiedCookie: PayloadUsuario = jwt.verify(
      accessCookie,
      process.env.PRIVATE_KEY,
    ) as PayloadUsuario;
    request.userId = verifiedCookie.id;
    next();
  } catch (error) {
    return response.status(401).json("Esta cookie es invalida");
  }
};

const verifyAuthorizationToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorizationToken = request.headers["authorization"];
  if (!authorizationToken) {
    response.status(401).json({ response: "No puedes acceder a esto" });
    return;
  }
  const token = authorizationToken.split(" ")[1];
  try {
    const verifiedCookie: PayloadUsuario = jwt.verify(
      token,
      process.env.AUTHORIZATION_TOKEN as string,
    ) as PayloadUsuario;
    request.userId = verifiedCookie.id;
    next();
  } catch (error) {
    return response.status(401).json("Este token no es valido");
  }
};

export { verifyCookie, verifyAuthorizationToken };
