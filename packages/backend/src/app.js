import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySensible from "@fastify/sensible";
import { api } from "./routes/api/index.js";
import { config } from "./config.js";

export const build = async () => {
  const app = fastify({
    ...(config.DEBUG
      ? {
          logger: {
            level: "debug",
            transport: {
              target: "pino-pretty",
            },
          },
          disableRequestLogging: false,
        }
      : {
          logger: {
            level: "error",
          },
          disableRequestLogging: true,
        }),
  });

  app.register(fastifySensible);

  app.register(fastifyRateLimit, {
    global: false,
    max: 100,
    ban: 3,
    timeWindow: 1000,
    cache: 10000,
  });

  app.register(fastifyCors, {
    origin: "*",
    exposedHeaders: [
      "Retry-After",
      "X-Ratelimit-Limit",
      "X-Ratelimit-Remaining",
      "X-Ratelimit-Reset",
    ],
  });

  app.register(api, {
    prefix: "v1",
  });

  if (config.DEBUG) {
    app.get("/", {}, (_, reply) => {
      reply.redirect(302, "/v1/documentation");
    });
  }

  return app;
};
