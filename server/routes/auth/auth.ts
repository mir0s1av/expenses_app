import { createRouter } from "@/server/lib/create-app";

import {
  getUserMiddleware,
  kindeClient,
  sessionManager,
} from "../../kinde.client";

export const authRoutes = createRouter()
  .get("login", async (ctx) => {
    const loginUrl = await kindeClient.login(sessionManager(ctx));
    return ctx.redirect(loginUrl.toString());
  })
  .get("register", async (ctx) => {
    const registerUrl = await kindeClient.register(sessionManager(ctx));
    return ctx.redirect(registerUrl.toString());
  })
  .get("callback", async (ctx) => {
    const url = new URL(ctx.req.url);

    await kindeClient.handleRedirectToApp(sessionManager(ctx), url);
    return ctx.redirect("/");
  })
  .get("logout", async (ctx) => {
    const logoutUrl = await kindeClient.logout(sessionManager(ctx));

    return ctx.redirect(logoutUrl.toString());
  })
  .get("me", getUserMiddleware, async (ctx) => {
    return ctx.json({ data: ctx.var.user });
  });
