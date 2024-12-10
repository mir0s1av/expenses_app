import app from "./app";
import env from "./lib/env";

Bun.serve({
  port: env.PORT || 3000,
  fetch: app.fetch,
});

console.log("Server is running");
