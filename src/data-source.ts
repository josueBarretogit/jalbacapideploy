require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Anillo } from "./entity/Anillo";
import { Dije } from "./entity/Dije";
import Usuario from "./entity/Usuario";
import { Solitario } from "./entity/Solitario";

export const AppDataSource = new DataSource({
  url: "mysql://avnadmin:AVNS_nyfqata3GvAv_rykT_-@mysql-2eb00650-josueportela9-d77c.a.aivencloud.com:15131/defaultdb?ssl-mode=REQUIRED",

  type: "mysql",
  host: "mysql-2eb00650-josueportela9-d77c.a.aivencloud.com",

  port: 15131,
  username: "avnadmin",
  password: "AVNS_nyfqata3GvAv_rykT_-",
  database: "defaultdb",
  synchronize: false,
  logging: false,
  entities: [Anillo, Dije, Usuario, Solitario],
  connectTimeout: 60 * 60 * 10000,
  acquireTimeout: 60 * 60 * 10000,
  migrations: [],
  subscribers: [],
});
