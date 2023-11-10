import DijeController from "../../controller/DijeController";
import * as express from "express";
import { Dije } from "../../entity/Dije";
import verifyToken from "../verifyToken";
import { upload } from "../../uploadImageConfig";
import verifyImage from "../imageVerifier";
import { handleMulterUpload } from "../multerErroHandler";

const controlador = new DijeController(Dije);

const router = express.Router();

router.route("/").get(controlador.getAllDijes.bind(controlador));

router.route("/getone").post(controlador.getDije.bind(controlador));

router
  .route("/editar")
  .put(verifyToken, upload.none(), controlador.updateDije.bind(controlador));

router
  .route("/create")
  .post(
    verifyToken,
    handleMulterUpload,
    verifyImage,
    controlador.createDije.bind(controlador),
  );

router
  .route("/eliminar")
  .delete(verifyToken, controlador.deleteDije.bind(controlador));

router
  .route("/replaceImage")
  .patch(
    verifyToken,
    handleMulterUpload,
    verifyImage,
    controlador.replaceImage.bind(controlador),
  );

export default router;
