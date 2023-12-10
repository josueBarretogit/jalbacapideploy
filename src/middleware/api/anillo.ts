import { Anillo } from "../../entity/Anillo";
import AnilloController from "../../controller/AnilloController";
import setupRouter from "../setupRouter";

const controlador = new AnilloController(Anillo);
const router = setupRouter("nombre", controlador);

export default router;
