require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Anillo } from "./entity/Anillo";
import { Dije } from "./entity/Dije";
import Usuario from "./entity/Usuario";
import { Solitario } from "./entity/Solitario";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "anillosjalbac",
  synchronize: true,
  logging: false,
  entities: [Anillo, Dije, Usuario, Solitario],
  migrations: [],
  subscribers: [],
});
