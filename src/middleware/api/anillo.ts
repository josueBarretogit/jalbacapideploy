import * as express from "express";

import { Anillo } from "../../entity/Anillo";
import verifyImage from "../imageVerifier";
import { upload } from "../../uploadImageConfig";
import AnilloController from "../../controller/AnilloController";
import { handleMulterUpload } from "../multerErroHandler";
import { verifyAuthorizationToken, verifyCookie } from "../verifyCookie";

const controlador = new AnilloController(Anillo);
const router = express.Router();

router.route("/").get(controlador.getAllAnillos.bind(controlador));

router
  .route("/searchReferencia")
  .post(controlador.searchReferencia.bind(controlador));

router.route("/create").post(
  verifyCookie,
  verifyAuthorizationToken,

  handleMulterUpload,
  verifyImage,
  controlador.createAnillo.bind(controlador),
);

router
  .route("/editar")
  .put(verifyCookie, upload.none(), controlador.updateAnillo.bind(controlador));

router
  .route("/eliminar")
  .delete(
    verifyCookie,
    verifyAuthorizationToken,
    controlador.deleteAnillo.bind(controlador),
  );

router
  .route("/replaceImage")
  .patch(
    verifyCookie,
    handleMulterUpload,
    verifyImage,
    controlador.replaceImage.bind(controlador),
  );

export default router;
