import * as express from "express";
import Usuario from "../../entity/Usuario";
import verifyToken from "../verifyToken";
import AuthController from "../../controller/AuthController";
import UsuarioController from "../../controller/UsuarioController";
import { upload } from "../../uploadImageConfig";

const controlador = new UsuarioController(Usuario);
const authControlador = new AuthController(Usuario);
const router = express.Router();

router
  .route("/getone")
  .post(verifyToken, controlador.getUsuario.bind(controlador));

router
  .route("/register")
  .post(upload.none(), authControlador.register.bind(authControlador));

router
  .route("/")
  .get(verifyToken, authControlador.getAllUsuarios.bind(authControlador));

router
  .route("/login")
  .post(upload.none(), authControlador.logIn.bind(authControlador));

router
  .route("/refresh")
  .get(authControlador.refreshSession.bind(authControlador));

router
  .route("/logout")
  .get(verifyToken, authControlador.logOut.bind(authControlador));

router
  .route("/editar")
  .put(verifyToken, upload.none(), controlador.updateUsuario.bind(controlador));

router
  .route("/eliminar")
  .delete(verifyToken, controlador.deleteUsuario.bind(controlador));

router
  .route("/desactivar")
  .patch(verifyToken, controlador.toggleEstadoUsuario.bind(controlador));

export default router;
