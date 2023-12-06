import DijeController from "../../controller/DijeController";
import * as express from "express";
import { Dije } from "../../entity/Dije";
import verifyCookie from "../verifyCookie";
import { upload } from "../../uploadImageConfig";
import verifyImage from "../imageVerifier";
import { handleMulterUpload } from "../multerErroHandler";

const controlador = new DijeController(Dije);

const router = express.Router();

router.route("/").get(controlador.getAllDijes.bind(controlador));

router
  .route("/searchReferencia")
  .post(controlador.searchReferencia.bind(controlador));

router
  .route("/editar")
  .put(verifyCookie, upload.none(), controlador.updateDije.bind(controlador));

router
  .route("/create")
  .post(
    verifyCookie,
    handleMulterUpload,
    verifyImage,
    controlador.createDije.bind(controlador),
  );

router
  .route("/eliminar")
  .delete(verifyCookie, controlador.deleteDije.bind(controlador));

router
  .route("/replaceImage")
  .patch(
    verifyCookie,
    handleMulterUpload,
    verifyImage,
    controlador.replaceImage.bind(controlador),
  );

export default router;
