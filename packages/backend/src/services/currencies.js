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
      const code2 = {code:"", symbol:""};
      for (const key in currenciesRetrieved) {
        code2.code = key;
        code2.symbol = currenciesRetrieved[key];
        code[key] = code2;
      }
      currencies = code;
      reply.send({ currencies  });
    } catch (error) {
      this.app.log.error(error);
      reply.internalServerError();
    }
  }
}
