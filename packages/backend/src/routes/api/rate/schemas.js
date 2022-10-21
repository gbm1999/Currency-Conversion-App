import { STATUS_CODES } from "http";

export const rateSchema = {
  description: "Get a currency exchange rate.",
  tags: ["rate"],
  params: {
    type: "object",
    required: ["base", "target"],
    properties: {
      base: {
        description: "Code of the base currency.",
        type: "string",
      },
      target: {
        description: "Code of the target currency.",
        type: "string",
      },
    },
  },
  response: {
    200: {
      description: `${STATUS_CODES[200]}. Exchange rate.`,
      type: "object",
      required: ["rate"],
      properties: {
        rate: { type: "number" },
      },
      example: {
        rate: 1.052227,
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
    404: {
      description: `${STATUS_CODES[404]}. Exchange rate not found.`,
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
