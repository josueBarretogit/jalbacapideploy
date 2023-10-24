import DijeController from "../../controller/DijeController";
import * as express from "express";
import { Dije } from "../../entity/Dije";
import verifyToken from "../verifyToken";
import { upload } from "../../uploadImageConfig";
import verifyImage from "../imageVerifier";

const controlador = new DijeController(Dije);

const router = express.Router();

router.route("/").get(controlador.getAllDijes.bind(controlador));

router.route("/getone").post(controlador.getDije.bind(controlador));

router
  .route("/editar/:id")
  .put(verifyToken, controlador.updateDije.bind(controlador));

router
  .route("/create")
  .post(
    verifyToken,
    upload.single("image"),
    verifyImage,
    controlador.createDije.bind(controlador),
  );

router
  .route("/eliminarDije")
  .delete(verifyToken, controlador.deleteDije.bind(controlador));

export default router;
