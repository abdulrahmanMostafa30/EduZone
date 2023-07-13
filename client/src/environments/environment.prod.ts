import { baseEnvironment } from "./config";

const environment = {
  PRODUCTION: true,
  API_URL: "https://staging-dot-eduzone-391614.lm.r.appspot.com",
  ...baseEnvironment,
};

export { environment };
