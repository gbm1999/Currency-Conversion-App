import { currenciesSchema } from "./schemas.js";
import { CurrenciesService } from "../../../services/currencies.js";

export const currencies = async (app) => {
  const currenciesService = new CurrenciesService(app);

  app.route({
    method: "GET",
    url: "/",
    schema: currenciesSchema,
    handler: (request, reply) => {
      return currenciesService.get({ request, reply });
    },
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 10000,
      },
    },
  });
};
