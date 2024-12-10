import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import type { Context } from "hono";
import type { PinoLogger } from "hono-pino";
import type { AppBindings } from "./types/app.schema";

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: Bun.env.KINDE_AUTH_DOMAIN!,
    clientId: Bun.env.KINDE_CLIENT_ID!,
    clientSecret: Bun.env.KINDE_CLIENT_SECRET,
    redirectURL: Bun.env.KINDE_REDIRECT_URL!,
    logoutRedirectURL: Bun.env.KINDE_LOGOUT_URL,
  }
);

export const sessionManager = (ctx: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(ctx, key);

    return result;
  },

  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;

    if (typeof value === "string") {
      setCookie(ctx, key, value, cookieOptions);
    } else {
      setCookie(ctx, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(ctx, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(ctx, key);
    });
  },
});

// type Env = {
//   Variables: {
//     user: UserType;
//     logger: PinoLogger;
//   };
// };

export const getUserMiddleware = createMiddleware<AppBindings>(
  async (ctx, next) => {
    try {
      const isAuthenticated = await kindeClient.isAuthenticated(
        sessionManager(ctx)
      );
      console.log(isAuthenticated);
      if (!isAuthenticated) {
        return ctx.json({ error: "Unauthorised" }, 403);
      }
      const user = await kindeClient.getUserProfile(sessionManager(ctx));

      // const query = await db
      //   .select()
      //   .from(expenses)
      //   .where(eq(expenses.userId, user.id));

      ctx.set("user", user);
      await next();
    } catch (error) {
      console.error(error);
      return ctx.json({ error: "Unauthorised" }, 403);
    }
  }
);
