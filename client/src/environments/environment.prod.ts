import { baseEnvironment } from "./config";

const environment = {
  PRODUCTION: true,
  API_URL: "https://eduzone-om33.onrender.com",
  ...baseEnvironment,
};

export { environment };
