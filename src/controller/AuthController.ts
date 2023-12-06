require("dotenv").config();
import { CookieOptions, Request, Response } from "express";
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
      console.log(createdeUser);

      return response.status(200).json("Usuario registrado exitosamente");
    } catch (error) {
      return response.status(500).json(error);
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

      const cookie = jwt.sign(
        {
          id: foundUsuario.id,
          correo: foundUsuario.correo,
          rol: foundUsuario.rol,
          secretKey: process.env.PRIVATE_KEY as string,
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
        })
        .status(200)
        .header("authorizationToken", authorizationToken)
        .json({
          isLogged: true,
          usuario: foundUsuario,
        });
    } catch (error) {
      return response.status(400).json({ error: error });
    }
  }

  async logOut(request: Request, response: Response) {
    try {
      response.clearCookie("accessCookie");
      response.status(200).json({ response: "Usuario cerró sesión" });
    } catch (error) {
      response.status(400).json({ response: error });
    }
  }
}

export default AuthController;
