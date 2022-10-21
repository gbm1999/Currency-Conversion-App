import { rateSchema } from "./schemas.js";
import { RateService } from "../../../services/rate.js";

export const rate = async (app) => {
  const rateService = new RateService(app);

  app.route({
    method: "GET",
    url: "/:base/:target",
    schema: rateSchema,
    handler: (request, reply) => {
      return rateService.get({ request, reply });
    },
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 10000,
      },
    },
  });
};
