import * as express from "express";
import { Solitario } from "../../entity/Solitario";
import verifyToken from "../verifyToken";
import SolitarioController from "../../controller/SolitarioController";
import { upload } from "../../uploadImageConfig";
import verifyImage from "../imageVerifier";
import { handleMulterUpload } from "../multerErroHandler";

const controlador = new SolitarioController(Solitario);
const router = express.Router();

router.route("/").get(controlador.getAllSolitarios.bind(controlador));

router.route("/getone").post(controlador.getSolitario.bind(controlador));

router
  .route("/create")
  .post(
    verifyToken,
    handleMulterUpload,
    verifyImage,
    controlador.createSolitario.bind(controlador),
  );

router
  .route("/editar")
  .put(
    verifyToken,
    upload.none(),
    controlador.updateSolitario.bind(controlador),
  );

router
  .route("/eliminar")
  .delete(verifyToken, controlador.deleteSolitario.bind(controlador));

router
  .route("/replaceImage")
  .patch(
    verifyToken,
    handleMulterUpload,
    verifyImage,
    controlador.replaceImage.bind(controlador),
  );

export default router;
