import * as express from "express";
import Usuario from "../../entity/Usuario";
import verifyToken from "../verifyToken";
import AuthController from "../../controller/AuthController";
import UsuarioController from "../../controller/UsuarioController";
import { upload } from "../../uploadImageConfig";

const controlador = new UsuarioController(Usuario);
const authControlador = new AuthController(Usuario);
const router = express.Router();

router.route("/register").post(authControlador.register.bind(authControlador));

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
  .route("/")
  .get(verifyToken, controlador.getAllUsuarios.bind(controlador))
  .post(verifyToken, controlador.createUsuario.bind(controlador))
  .put(verifyToken, controlador.updateUsuario.bind(controlador))
  .delete(verifyToken, controlador.deleteUsuario.bind(controlador));

router
  .route("/getone")
  .post(verifyToken, controlador.getUsuario.bind(controlador));

export default router;
