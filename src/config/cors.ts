import * as cors from "cors";
require("dotenv").config();

const whitelist = [process.env.API_CLIENT_ONE, process.env.API_CLIENT_TWO];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (
      whitelist.indexOf(origin) !== -1 ||
      !origin ||
      /http:\/\/localhost:\w/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("No esta permitodo debido a CORS"));
    }
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

export default corsOptions;
