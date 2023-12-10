import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
import anilloMiddleware from "./middleware/api/anillo";
import dijeMiddleware from "./middleware/api/dijes";
import solitarioMiddleware from "./middleware/api/solitario";
import usuarioMiddleware from "./middleware/api/usuario";
import corsOptions from "./config/cors";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
dotenv.config();

AppDataSource.initialize()
  .then(() => console.log(`Database connected`))
  .catch((error) => console.log(error));

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/usuarios", usuarioMiddleware);
app.use("/api/nombres", anilloMiddleware);
app.use("/api/dijes", dijeMiddleware);
app.use("/api/solitarios", solitarioMiddleware);

app.use(errorHandler);

app.use(notFound);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`running from localhost:${PORT}`);
});
