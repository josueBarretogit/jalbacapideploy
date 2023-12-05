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
  const accessToken = request.headers["authorization"];
  const refreshToken = request.cookies["refreshToken"];
  if (!accessToken || !refreshToken) {
    response.status(401).json({ response: "No cookie was found" });
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
  } catch (error) {
    return verifyRefreshToken(
      refreshToken,
      accessToken,
      request,
      response,
      next,
    );
  }
};

const verifyRefreshToken = async (
  refreshToken: string,
  accessToken: string,
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<any> => {
  if (!refreshToken) {
    response.status(401).json({ response: "No refresh token was found" });
    return;
  }
  try {
    const refreshedToken: PayloadUsuario = jwt.verify(
      refreshToken,
      process.env.PRIVATE_REFRESH_KEY,
    ) as PayloadUsuario;
    request.userId = refreshedToken.id;
    request.correo = refreshedToken.correo;

    response
      .cookie("refreshToken", refreshToken, {
        maxAge: 10000 * 300,
        sameSite: "strict",
      })
      .header("authorization", accessToken);

    next();
  } catch (error) {
    return response
      .status(400)
      .json({ response: "some error ocurred", errorresponse: error });
  }
};
export default verifyToken;
