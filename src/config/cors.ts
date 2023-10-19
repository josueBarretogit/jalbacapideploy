import * as cors from "cors";

const allowedOrigins = [/http:\/\/localhost:\w/];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins[0],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

export default corsOptions;
