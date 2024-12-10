import { pinoLogger } from "hono-pino";
import pino from "pino";
import env from "../lib/env";

export function customLogger() {
  return pinoLogger({
    http: {
      reqId: () => crypto.randomUUID(),
    },
    pino: pino({
      level: env.LOG_LEVEL || "debug",
      transport:
        env.NODE_ENV === "production"
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            },
    }),
  });
}
