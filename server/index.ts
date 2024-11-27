import server from "./app";

Bun.serve({
  port: process.env.PORT || 3000,
  fetch: server.fetch,
});

console.log("Server is running");
