import * as express from "express";

import { Anillo } from "../../entity/Anillo";
import verifyToken from "../verifyToken";
import verifyImage from "../imageVerifier";
import { upload } from "../../uploadImageConfig";

import AnilloController from "../../controller/AnilloController";

const controlador = new AnilloController(Anillo);
const router = express.Router();

router.route("/").get(controlador.getAllAnillos.bind(controlador));

router.route("/getone").post(controlador.getAnillo.bind(controlador));

router
  .route("/create")
  .post(
    verifyToken,
    upload.single("image"),
    verifyImage,
    controlador.createAnillo.bind(controlador),
  );

router
  .route("/editar/:id")
  .put(upload.none(), controlador.updateAnillo.bind(controlador));

router
  .route("/eliminarAnillo")
  .delete(verifyToken, controlador.deleteAnillo.bind(controlador));

router
  .route("/replaceImage/:id")
  .patch(verifyToken, controlador.replaceImage.bind(controlador));

export default router;
