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
  username: "id21425586_josue",
  password: process.env.DB_PASSWORD,
  database: "id21425586_anillosjalbac",
  synchronize: false,
  logging: false,
  entities: [Anillo, Dije, Usuario, Solitario],
  migrations: [],
  subscribers: [],
});
