import * as express from "express";
import { verifyCookie } from "./verifyCookie";
import verifyAuthorizationToken from "./verifyJwt";
import verifyImage from "./imageVerifier";
import { handleMulterUpload } from "./multerErroHandler";
import GenericController from "../controller/GenericController";
import upload from "../uploadImageConfig";

export default function setupRouter(
  entityName: string,
  controller: GenericController<any>,
) {
  const router = express.Router();

  router.route("/").get(controller.GetAll);

  router
    .route("/getBy")
    .post(
      verifyCookie,
      verifyAuthorizationToken,
      upload.none(),
      controller.GetBy,
    );

  router
    .route("/create")
    .post(
      verifyCookie,
      verifyAuthorizationToken,
      handleMulterUpload,
      verifyImage,
      controller.Insert,
    );

  router
    .route("/editar")
    .put(
      verifyCookie,
      verifyAuthorizationToken,
      upload.none(),
      controller.Update,
    );

  router
    .route("/eliminar")
    .delete(verifyCookie, verifyAuthorizationToken, controller.Delete);

  router
    .route("/searchReferencia")
    .post(verifyCookie, verifyAuthorizationToken, controller.SearchReferencia);

  router
    .route("/replaceImage")
    .patch(
      verifyCookie,
      verifyAuthorizationToken,
      handleMulterUpload,
      verifyImage,
      controller.ReplaceImage,
    );

  return router;
}
