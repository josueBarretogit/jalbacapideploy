require("dotenv").config();
import { Request, Response } from "express";
import Usuario from "../entity/Usuario";
import * as jwt from "jsonwebtoken";
import { EntityTarget } from "typeorm";
import UsuarioController from "./UsuarioController";

class AuthController extends UsuarioController {
  constructor(usuario: EntityTarget<Usuario>) {
    super(usuario);
  }

  async register(request: Request, response: Response) {
    if (!request.body.correo || !request.body.contrasena) {
      response.status(400).json({ response: "Peticion sin cuerpo" });
      return;
    }
    try {
      const { correo, contrasena } = request.body;

      const userAlreadyExist: Usuario = await this.getBy({ correo: correo });
      if (userAlreadyExist) {
        response.status(400).json({ response: "correo ya existe" });
        return;
      }
      const usuarioToCreate = new Usuario(correo, contrasena);
      const erroresValidacion =
        await this.validateCreateUsuario(usuarioToCreate);

      if (erroresValidacion.length > 0) {
        response.status(400).json({ errors: erroresValidacion });
        return;
      }

      usuarioToCreate.contrasena = await this.encryptPassword(contrasena);

      const usuarioCreated = await this.createUsuario(usuarioToCreate);

      const accessToken = jwt.sign(
        {
          id: usuarioCreated?.id,
          correo: usuarioCreated?.correo,
        },
        process.env.PRIVATE_KEY as string,
        { expiresIn: "10m" },
      );

      const refreshToken = jwt.sign(
        {
          id: usuarioCreated?.id,
          correo: usuarioCreated?.correo,
        },
        process.env.PRIVATE_REFRESH_KEY as string,
        { expiresIn: "1d" },
      );

      return response
        .cookie("refreshToken", refreshToken, {
          maxAge: 10000 * 300,
          httpOnly: true,
          sameSite: "strict",
        })
        .header("authorization", accessToken)
        .status(200)
        .json({ isRegistered: true, usuarioCreated: usuarioCreated });
    } catch (error) {
      return response.status(400).json({ errors: error });
    }
  }

  async logIn(request: Request, response: Response) {
    if (!request.body.correo || !request.body.contrasena) {
      response.status(400).json({ response: "Peticion sin cuerpo valido" });
      return;
    }
    try {
      const { correo, contrasena } = request.body;
      const foundUsuario: Usuario = await this.getBy({ correo: correo });
      if (!foundUsuario) {
        response.status(400).json({
          isLogged: false,
          response: "Este correo no esta registrado",
        });
        return;
      }
      const passwordMatch = await this.comparePassword(
        contrasena,
        foundUsuario.contrasena,
      );

      if (!passwordMatch) {
        response
          .status(400)
          .json({ isLogged: false, response: "Esta contraseña no es valida" });
        return;
      }

      const accessToken = jwt.sign(
        {
          id: foundUsuario.id,
          correo: foundUsuario.correo,
        },
        process.env.PRIVATE_KEY as string,
        { expiresIn: "1d" },
      );

      const refreshToken = jwt.sign(
        {
          id: foundUsuario.id,
          correo: foundUsuario.correo,
        },
        process.env.PRIVATE_REFRESH_KEY as string,
        { expiresIn: "1d" },
      );

      return response
        .cookie("refreshToken", refreshToken, {
          maxAge: 86400000,
          sameSite: "none",
          domain: "http://localhost:3000",
          path: "/",
        })

        .header("authorization", accessToken)
        .status(200)
        .json({
          isLogged: true,
          correo: foundUsuario.correo,
          idUsuario: foundUsuario.id,
          accessToken,
        });
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async logOut(request: Request, response: Response) {
    try {
      response.clearCookie("refreshToken");
      return response.status(200).json({ response: "Usuario cerró sesión" });
    } catch (error) {
      return response.status(400).json({ response: error });
    }
  }

  async refreshSession(request: Request, response: Response) {
    const refreshToken: string = request.cookies["refreshToken"];
    if (!refreshToken) {
      return response.status(401).json({ response: "unable to refresh token" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.PRIVATE_REFRESH_KEY as string,
      ) as jwt.JwtPayload;

      const newAccessToken = jwt.sign(
        {
          id: decoded.userId,
          correo: decoded.correo,
        },
        process.env.PRIVATE_KEY as string,
        { expiresIn: "10m" },
      );

      return response
        .status(200)
        .header("authorization", newAccessToken)
        .json({ response: "token refreshed" });
    } catch (error) {
      return response.status(400).json({ errors: error });
    }
  }
}

export default AuthController;
