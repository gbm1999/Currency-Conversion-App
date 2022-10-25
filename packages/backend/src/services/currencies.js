import { currencySymbols } from "../utils/currency-symbols.js";

export class CurrenciesService {
  constructor(app) {
    this.app = app;
  }

  async get({ reply }) {
    try {
      const currenciesRetrieved = currencySymbols;
      let currencies = {};
      const code ={};

      for (let key in currenciesRetrieved) {
        code[key] = {code:key, symbol:currenciesRetrieved[key]};
      }
      currencies = code;
      reply.send({ currencies  });
    } catch (error) {
      this.app.log.error(error);
      reply.internalServerError();
    }
  }
}