import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { customLogger } from "../middleware/pino-logger";
import type { AppBindings } from "../types/app.schema";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();
  app.use(customLogger());
  app.use(serveEmojiFavicon("🥑"));
  app.notFound(notFound);
  app.onError(onError);
  return app;
}
