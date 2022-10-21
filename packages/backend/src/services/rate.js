import { fetchRates } from "../utils/fetch-rates.js";

export class RateService {
  constructor(app) {
    this.app = app;
  }

  async get({ request, reply }) {
    try {
      const base = request.params.base.toUpperCase();
      const target = request.params.target.toUpperCase();

      // Cross rate formula.
      // https://www.investopedia.com/terms/c/crossrate.asp

      const rates = await fetchRates();
      const baseRate = rates.get(base);
      const targetRate = rates.get(target);
      if (typeof baseRate !== "number" || typeof targetRate !== "number") {
        reply.notFound();
        return;
      }

      const rate = targetRate / baseRate;
      reply.send({ rate });
    } catch (error) {
      this.app.log.error(error);
      reply.internalServerError();
    }
  }
}
