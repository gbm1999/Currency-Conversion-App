import "dotenv/config";

const getStrEnv = (env, def) => {
  return process.env[env] || process.env[`APPSETTING_${env}`] || def;
};

const getNumEnv = (env, def) => {
  const v = getStrEnv(env, def);
  return typeof v === "number" ? v : Number.parseInt(v, 10);
};

const getBoolEnv = (env, def) => {
  const v = getStrEnv(env, def);
  return typeof v === "boolean" ? v : v === "true";
};

export const config = {
  DEBUG: getBoolEnv("DEBUG", false),
  HOST: getStrEnv("HOST", "127.0.0.1"),
  PORT: getNumEnv("PORT", 5000),
  MONEYCONVERT_ENDPOINT: getStrEnv(
    "MONEYCONVERT_ENDPOINT",
    "https://cdn.moneyconvert.net/api/ecb.json"
  ),
};
