import { STATUS_CODES } from "http";

export const currenciesSchema = {
  description: "Get supported currencies.",
  tags: ["currencies"],
  response: {
    200: {
      description: `${STATUS_CODES[200]}. Supported currencies.`,
      type: "object",
      required: ["currencies"],
      properties: {
        currencies: {
          type: "object",
          patternProperties: {
            "^.*$": {
              type: "object",
              required: ["code"],
              properties: {
                code: { type: "string" },
                symbol: { type: "string" },
              },
            },
          },
        },
      },
      example: {
        currencies: {
          EUR: { code: "EUR", symbol: "€" },
          USD: { code: "USD", symbol: "$" },
        },
      },
    },
    400: {
      description: `${STATUS_CODES[400]}. The request is malformed.`,
      type: "object",
      properties: {},
    },
    403: {
      description: `${STATUS_CODES[403]}. The client is banned for not complying with the rate-limit.`,
      type: "object",
      properties: {},
    },
    429: {
      description: `${STATUS_CODES[429]}. The client is making too many requests in a short window.`,
      type: "object",
      properties: {},
    },
    500: {
      description: STATUS_CODES[500],
      type: "object",
      properties: {},
    },
  },
};
