import { Solitario } from "../../entity/Solitario";
import SolitarioController from "../../controller/SolitarioController";
import setupRouter from "../setupRouter";

const controlador = new SolitarioController(Solitario);
const router = setupRouter("solitario", controlador);

export default router;
