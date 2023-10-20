import * as cors from "cors";

const whitelist = [
  "https://anillosjalbac.com",
  "https://anillosjalbacapi.onrender.com",
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No esta permitodo debido a CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

export default corsOptions;
