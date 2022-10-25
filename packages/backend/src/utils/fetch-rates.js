import undici from "undici";
import { config } from "../config.js";

const endpoint = new URL(config.MONEYCONVERT_ENDPOINT);
endpoint.searchParams.set("_", Date.now());

const cacheTime = 3600;
var cache = {};
let cacheTimer = 0;
let mutex = Promise.resolve() // global mutex instance

export const fetchRates = async () => {
  // Prevent cached response.
  mutex = mutex.then(async () => {
    const data = await fetchWithCache("cache", cacheTime);
    return new Map([...Object.entries(data.rates)].sort());
  }).catch(() => {})
  return mutex;
}

const setCacheTimer  = time => {
  const now = new Date().getTime()/1000;
  cacheTimer = now + time;
}

const fetchWithCache = async (cacheName, time) => {
  const now = new Date().getTime()/1000;

  if(!cache[cacheName] || cacheTimer < now) {
    cache[cacheName] = await fetchURL();
    setCacheTimer(time);
  }

  return cache[cacheName];
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