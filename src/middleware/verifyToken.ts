require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface PayloadUsuario extends jwt.JwtPayload {
  id: string;
  correo: string;
}

const verifyToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const accessToken = request.cookies["accessCookie"];
  if (!accessToken) {
    response.status(401).json({ response: "No puedes acceder a esto" });
    return;
  }
  try {
    const verifiedToken: PayloadUsuario = jwt.verify(
      accessToken,
      process.env.PRIVATE_KEY,
    ) as PayloadUsuario;
    request.userId = verifiedToken.id;
    request.correo = verifiedToken.correo;
    next();
  } catch (error) {}
};
export default verifyToken;
