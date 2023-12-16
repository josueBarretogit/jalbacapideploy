require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import Usuario from "../entity/Usuario";
import * as jwt from "jsonwebtoken";
import { EntityTarget } from "typeorm";
import UsuarioController from "./UsuarioController";
import InternalServerError from "../interfaces/internalServerError";

class AuthController extends UsuarioController {
  constructor(usuario: EntityTarget<Usuario>) {
    super(usuario);
  }

  async register(request: Request, response: Response, next: NextFunction) {
    if (!request.body.correo || !request.body.contrasena) {
      response.status(400).json("No se ingresó los datos necesarios");
      return;
    }
    try {
      const { correo, contrasena, rol }: Usuario = request.body;

      const userAlreadyExist: Usuario = await this.getBy({ correo: correo });

      if (userAlreadyExist) {
        response.status(400).json("Correo ya existe");
        return;
      }

      const usuarioToCreate = new Usuario(correo, contrasena, rol, true);

      const erroresValidacion =
        await this.validateCreateUsuario(usuarioToCreate);

      if (erroresValidacion.length > 0) {
        response.status(400).json(erroresValidacion);
        return;
      }

      usuarioToCreate.contrasena = await this.encryptPassword(contrasena);

      const createdeUser = await this.createUsuario(usuarioToCreate);

      return response.status(200).json("Usuario registrado exitosamente");
    } catch (error) {
      return next(new InternalServerError(__filename, "register", error));
    }
  }

  async logIn(request: Request, response: Response, next: NextFunction) {
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

      if (!foundUsuario.estado) {
        response.status(401).json({
          isLogged: false,
          response:
            "Este usuario esta desactivado por lo tanto no tiene acceso",
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

      const cookie = jwt.sign(
        {
          id: foundUsuario.id,
        },
        process.env.PRIVATE_KEY as string,
        { expiresIn: "1d" },
      );

      const authorizationToken = jwt.sign(
        {
          id: foundUsuario.id,
          correo: foundUsuario.correo,
        },
        process.env.AUTHORIZATION_TOKEN as string,
        { expiresIn: "1d" },
      );

      return response
        .cookie("accessCookie", cookie, {
          maxAge: 8.64e7,
          sameSite: "strict",
          secure: true,
          httpOnly: true,
        })
        .status(200)
        .header("authorization", authorizationToken)
        .json({
          isLogged: true,
          usuario: foundUsuario,
          authorizationToken: authorizationToken,
        });
    } catch (error) {
      return next(new InternalServerError(__filename, "Login", error));
    }
  }

  async logOut(request: Request, response: Response, next: NextFunction) {
    try {
      response.clearCookie("accessCookie");
      response.status(200).json({ response: "Usuario cerró sesión" });
    } catch (error) {
      return next(new InternalServerError(__filename, "Login", error));
    }
  }

  refreshAuthorizationToken = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const userLogged: Usuario = await this.repository.findOneBy({
        id: parseInt(request.userId),
      });

      const authorizationToken = jwt.sign(
        {
          id: userLogged.id,
          correo: userLogged.correo,
          rol: userLogged.rol,
        },
        process.env.AUTHORIZATION_TOKEN as string,
        { expiresIn: "1d" },
      );
      response
        .status(200)
        .header("authorization", authorizationToken)
        .json(authorizationToken);
    } catch (error) {
      return next(
        new InternalServerError(__filename, "refreshAuthorizationToken", error),
      );
    }
  };
}

export default AuthController;
