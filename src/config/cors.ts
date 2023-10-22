import * as cors from "cors";

const whitelist = [
  "https://anillosjalbacapi.onrender.com",
  "https://anillos-jalbac.web.app",
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (
      whitelist.indexOf(origin) !== -1 ||
      !origin ||
      /http:\/\/localhost:\w/.test(origin)
    ) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("No esta permitodo debido a CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

export default corsOptions;
