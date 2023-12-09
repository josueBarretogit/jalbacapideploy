import { Request, Response, NextFunction } from "express";
import { PayloadUsuario } from "./verifyCookie";
import * as jwt from "jsonwebtoken";

export default async function verifyAuthorizationToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
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
}
