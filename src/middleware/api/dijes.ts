import DijeController from "../../controller/DijeController";
import { Dije } from "../../entity/Dije";
import setupRouter from "../setupRouter";

const controlador = new DijeController(Dije);

const router = setupRouter("dije", controlador);

export default router;
