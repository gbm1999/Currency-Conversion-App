import { currencySymbols } from "../utils/currency-symbols.js";
import { fetchRates } from "../utils/fetch-rates.js";


export class CurrenciesService {
  constructor(app) {
    this.app = app;
  }

  async get({ reply }) {
    try {
      const currenciesRetrieved = currencySymbols;
      let currencies = {};
      const code ={};

      //Obtenemos los rates de la API
      const rates = await fetchRates();
      //Filtramos los rates de currency-symbols con los rates de la API
      //En asArray preparamos las claves de la api para hacer match 
      const asArray = Array.from(rates.keys());
      const filtered = Object.keys(currenciesRetrieved)
      .filter(key => asArray.includes(key))
      .reduce((obj, key) => {
        obj[key] = currenciesRetrieved[key];
        return obj;
      }, {});

      //Generamos el schema
      for (let key in filtered) {
        code[key] = {code:key, symbol:filtered[key]};
      }
      currencies = code;
      reply.send({ currencies  });
    } catch (error) {
      this.app.log.error(error);
      reply.internalServerError();
    }
  }
}