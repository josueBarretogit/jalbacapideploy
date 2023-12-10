import * as express from "express";
import { verifyCookie } from "./verifyCookie";
import verifyAuthorizationToken from "./verifyJwt";
import verifyImage from "./imageVerifier";
import { handleMulterUpload } from "./multerErroHandler";

export default function setupRouter(entityName: string, controller: any) {
  const router = express.Router();

  router.route("/").get(controller.GetAll.bind(controller));

  router
    .route("/create")
    .post(
      verifyCookie,
      verifyAuthorizationToken,
      handleMulterUpload,
      verifyImage,
      controller.Insert.bind(controller),
    );

  router
    .route("/editar")
    .put(
      verifyCookie,
      verifyAuthorizationToken,
      controller.Update.bind(controller),
    );

  router
    .route("/eliminar")
    .delete(
      verifyCookie,
      verifyAuthorizationToken,
      controller.Delete.bind(controller),
    );

  router
    .route("/replaceImage")
    .delete(
      verifyCookie,
      verifyAuthorizationToken,
      controller.Delete.bind(controller),
    );

  router
    .route("/searchReferencia")
    .post(
      verifyCookie,
      verifyAuthorizationToken,
      controller.searchReferencia.bind(controller),
    );

  router
    .route("/replaceImage")
    .patch(
      verifyCookie,
      verifyAuthorizationToken,
      handleMulterUpload,
      verifyImage,
      controller.replaceImage.bind(controller),
    );

  return router;
}
