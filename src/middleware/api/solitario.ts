import * as express from "express";
import { Solitario } from "../../entity/Solitario";
import { verifyCookie } from "../verifyCookie";
import SolitarioController from "../../controller/SolitarioController";
import { upload } from "../../uploadImageConfig";
import verifyImage from "../imageVerifier";
import { handleMulterUpload } from "../multerErroHandler";

const controlador = new SolitarioController(Solitario);
const router = express.Router();

router.route("/").get(controlador.getAllSolitarios.bind(controlador));

router
  .route("/searchReferencia")
  .post(upload.none(), controlador.searchReferencia.bind(controlador));

router
  .route("/create")
  .post(
    verifyCookie,
    handleMulterUpload,
    verifyImage,
    controlador.createSolitario.bind(controlador),
  );

router
  .route("/editar")
  .put(
    verifyCookie,
    upload.none(),
    controlador.updateSolitario.bind(controlador),
  );

router
  .route("/eliminar")
  .delete(verifyCookie, controlador.deleteSolitario.bind(controlador));

router
  .route("/replaceImage")
  .patch(
    verifyCookie,
    handleMulterUpload,
    verifyImage,
    controlador.replaceImage.bind(controlador),
  );

export default router;
