require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Anillo } from "./entity/Anillo";
import { Dije } from "./entity/Dije";
import Usuario from "./entity/Usuario";
import { Solitario } from "./entity/Solitario";

export const AppDataSource = new DataSource({
  url: "sql3.freemysqlhosting.net",
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "sql3654808",
  password: "izv2VN57Hm",
  database: " sql3654808",
  synchronize: false,
  logging: false,
  entities: [Anillo, Dije, Usuario, Solitario],
  connectTimeout: 20000,
  migrations: [],
  subscribers: [],
});
