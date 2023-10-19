import * as express from "express";
import { Solitario } from "../../entity/Solitario";
import verifyToken from "../verifyToken";
import SolitarioController from "../../controller/SolitarioController";
import upload from "../../uploadImageConfig";
import verifyImage from "../imageVerifier";

const controlador = new SolitarioController(Solitario);
const router = express.Router();

router.route("/").get(controlador.getAllSolitarios.bind(controlador));

router.route("/getone").post(controlador.getSolitario.bind(controlador));

router
  .route("/create")
  .post(
    verifyToken,
    upload.single("image"),
    verifyImage,
    controlador.createSolitario.bind(controlador),
  );

router
  .route("/editar/:id")
  .put(verifyToken, controlador.updateSolitario.bind(controlador));
router

  .route("eliminarSolitario")
  .delete(verifyToken, controlador.deleteSolitario.bind(controlador));

export default router;
