import { PinoLogger } from "hono-pino";
import {
  OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
} from "@hono/zod-openapi";
import type { UserType } from "@kinde-oss/kinde-typescript-sdk";

export type AppBindings = {
  Variables: {
    user: UserType;
    logger: PinoLogger;
  };
};

export type AppType = OpenAPIHono<AppBindings>;
export type AppRouterHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
