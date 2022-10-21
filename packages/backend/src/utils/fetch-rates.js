import undici from "undici";
import { config } from "../config.js";

export const fetchRates = async () => {
  const endpoint = new URL(config.MONEYCONVERT_ENDPOINT);
  // Prevent cached response.
  endpoint.searchParams.set("_", Date.now());

  const { statusCode, body } = await undici.request(endpoint, {
    method: "GET",
  });
  if (statusCode < 200 || statusCode > 299) {
    throw new Error(`Unexpected API response code: ${statusCode}`);
  }

  const data = await body.json();
  if (!data.rates || typeof data.rates !== "object") {
    throw new Error("Unexpected API response body");
  }

  return new Map([...Object.entries(data.rates)].sort());
};
