import * as express from "express";
import Usuario from "../../entity/Usuario";
import { verifyCookie } from "../verifyCookie";
import AuthController from "../../controller/AuthController";
import UsuarioController from "../../controller/UsuarioController";
import { upload } from "../../uploadImageConfig";

const controlador = new UsuarioController(Usuario);
const authControlador = new AuthController(Usuario);
const router = express.Router();

router
  .route("/getone")
  .post(verifyCookie, controlador.getUsuario.bind(controlador));

router
  .route("/register")
  .post(upload.none(), authControlador.register.bind(authControlador));

router
  .route("/refreshAuthorization")
  .get(
    verifyCookie,
    authControlador.refreshAuthorizationToken.bind(authControlador),
  );

router
  .route("/")
  .get(verifyCookie, authControlador.getAllUsuarios.bind(authControlador));

router
  .route("/login")
  .post(upload.none(), authControlador.logIn.bind(authControlador));

router
  .route("/logout")
  .get(verifyCookie, authControlador.logOut.bind(authControlador));

router
  .route("/editar")
  .put(
    verifyCookie,
    upload.none(),
    controlador.updateUsuario.bind(controlador),
  );

router
  .route("/eliminar")
  .delete(verifyCookie, controlador.deleteUsuario.bind(controlador));

router
  .route("/desactivar")
  .patch(verifyCookie, controlador.toggleEstadoUsuario.bind(controlador));

export default router;
