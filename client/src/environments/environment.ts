
import { baseEnvironment } from "./config";

const environment = {
  PRODUCTION: false,
  API_URL: "http://localhost:5000",
  ...baseEnvironment,
};

export { environment };
