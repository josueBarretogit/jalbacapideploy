require("dotenv").config();

import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { AppDataSource } from "./data-source";
import anilloMiddleware from "./middleware/api/anillo";
import dijeMiddleware from "./middleware/api/dijes";
import solitarioMiddleware from "./middleware/api/solitario";
import usuarioMiddleware from "./middleware/api/usuario";
import corsOptions from "./config/cors";
import notFound from "./middleware/notFound";
import path = require("path");

AppDataSource.initialize()
  .then(() => console.log(`Database connected`))
  .catch((error) => console.log(error));

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build", "public2")));

app.use("/api/usuarios", usuarioMiddleware);
app.use("/api/anillos", anilloMiddleware);
app.use("/api/dijes", dijeMiddleware);
app.use("/api/solitarios", solitarioMiddleware);

app.use(notFound);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`running from ${PORT}`);
  console.log(__dirname);
});
