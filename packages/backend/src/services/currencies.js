//import { currencySymbols } from "../utils/currency-symbols.js";

export class CurrenciesService {
  constructor(app) {
    this.app = app;
  }

  async get({ reply }) {
    try {
      const currencies = {};

      reply.send({ currencies });
    } catch (error) {
      this.app.log.error(error);
      reply.internalServerError();
    }
  }
}
