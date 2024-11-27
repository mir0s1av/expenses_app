import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth';
import { expenseRoutes } from './routes/expense';

const GLOBAL_PREFIX = "/api/v1";
const server = new Hono();

server.use("*", logger());
const apiRoutes = server
  .basePath(GLOBAL_PREFIX)
  .route(`/expenses`, expenseRoutes)
  .route("/", authRoutes);

server.get("*", serveStatic({ root: "./client/dist" }));
server.get("*", serveStatic({ root: "./client/dist/index.html" }));

export default server;
export type ApiRoutes = typeof apiRoutes;
