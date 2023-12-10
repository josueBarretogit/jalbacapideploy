import * as express from "express";

import { Anillo } from "../../entity/Anillo";
import verifyImage from "../imageVerifier";
import AnilloController from "../../controller/AnilloController";
import { handleMulterUpload } from "../multerErroHandler";
import { verifyCookie } from "../verifyCookie";
import setupRouter from "../setupRouter";

const controlador = new AnilloController(Anillo);
const router = setupRouter("nombre", controlador);

export default router;
