import undici from "undici";
import { config } from "../config.js";

const endpoint = new URL(config.MONEYCONVERT_ENDPOINT);
endpoint.searchParams.set("_", Date.now());

const cacheTime = 3600;
var cache = {};
let cacheTimer = 0;

export const fetchRates = async () => {
  // Prevent cached response.
  const data = fetchWithCache("cache", cacheTime);
  console.log(data);


  return new Map([...Object.entries(data.rates)].sort());
};

const getCacheTimer  = time => {
  const now = new Date().getTime();
  if(cacheTimer < now + time) {
    cacheTimer = now + time;
  }
  return cacheTimer;
}

const fetchWithCache = async (cacheName, time) => {
  const now = new Date().getTime();
  if(!cache[cacheName] || cache[cacheName].cacheTimer < now) {
    cache[cacheName].data = await fetchURL();
    cache[cacheName].cacheTimer = getCacheTimer(time);
  }
  return cache[cacheName].data;
}

const fetchURL = async () => {
  const { statusCode, body } =  await undici.request(endpoint, {
    method: "GET",
  });
  if (statusCode < 200 || statusCode > 299) {
    throw new Error(`Unexpected API response code: ${statusCode}`);
  }

  const data = await body.json();
  if (!data.rates || typeof data.rates !== "object") {
    throw new Error("Unexpected API response body");
  }
  return data;
}