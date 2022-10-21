import { config } from "./config.js";
import { build } from "./app.js";

export const stop = async (app) => {
  await app.close();
  process.exit(0);
};

export const start = async () => {
  const app = await build();
  try {
    await app.listen({ host: config.HOST, port: config.PORT });
    process.on("SIGINT", () => stop(app));
    process.on("SIGTERM", () => stop(app));
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
  return app;
};

start();
