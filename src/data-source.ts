require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Anillo } from "./entity/Anillo";
import { Dije } from "./entity/Dije";
import Usuario from "./entity/Usuario";
import { Solitario } from "./entity/Solitario";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [Anillo, Dije, Usuario, Solitario],
  migrations: [],
  subscribers: [],
});
