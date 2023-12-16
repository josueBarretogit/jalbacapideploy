import * as express from "express";
import Usuario from "../../entity/Usuario";
import { verifyCookie } from "../verifyCookie";
import AuthController from "../../controller/AuthController";
import UsuarioController from "../../controller/UsuarioController";
import upload from "../../uploadImageConfig";
import verifyAuthorizationToken from "../verifyJwt";

const controlador = new UsuarioController(Usuario);
const authControlador = new AuthController(Usuario);
const router = express.Router();

router
  .route("/getone")
  .post(
    verifyCookie,
    verifyAuthorizationToken,
    controlador.getUsuario.bind(controlador),
  );

router
  .route("/register")
  .post(
    upload.none(),
    verifyCookie,
    verifyAuthorizationToken,
    authControlador.register.bind(authControlador),
  );

router
  .route("/refreshAuthorization")
  .get(
    verifyCookie,
    authControlador.refreshAuthorizationToken.bind(authControlador),
  );

router
  .route("/")
  .get(
    verifyCookie,
    verifyAuthorizationToken,
    authControlador.getAllUsuarios.bind(authControlador),
  );

router
  .route("/login")
  .post(upload.none(), authControlador.logIn.bind(authControlador));

router
  .route("/logout")
  .get(
    verifyCookie,
    verifyAuthorizationToken,
    authControlador.logOut.bind(authControlador),
  );

router
  .route("/editar")
  .put(
    verifyCookie,
    verifyAuthorizationToken,
    upload.none(),
    controlador.updateUsuario.bind(controlador),
  );

router
  .route("/desactivar")
  .patch(
    verifyCookie,
    verifyAuthorizationToken,
    controlador.toggleEstadoUsuario.bind(controlador),
  );

router
  .route("/getBy")
  .post(
    verifyCookie,
    verifyAuthorizationToken,
    upload.none(),
    controlador.GetBy,
  );

export default router;
