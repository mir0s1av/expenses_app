import blocksRoutes from '@/server/routes/blocks/blocks.index';
import index from '@/server/routes/index.route';
import { serveStatic } from 'hono/bun';
import configureOpenApi from './lib/configure-open-api';
import createApp from './lib/create-app';
// import { authRoutes } from "./routes/auth/auth";
// import { expenseRoutes } from "./routes/expense";

// To use ApiRoutes on client side:
// 1. Create a type for your API client
// type ApiClient = {
//   blocks: typeof blocksRoutes;
//   index: typeof index;
// }
//
// 2. Use with React Query or Fetch:
// const fetchData = async () => {
//   const response = await fetch('/api/v1/blocks');
//   return response.json();
// }
//
// function MyComponent() {
//   const { data } = useQuery<ApiRoutes>(['blocks'], fetchData);
//   return <div>{/* Use data */}</div>
// }

const GLOBAL_PREFIX = "/api/v1";
const app = createApp();

configureOpenApi(app);

const apiRoutes = [index, blocksRoutes];
apiRoutes.forEach((route) => {
  app.route(GLOBAL_PREFIX, route);
});
// const apiRoutes = app
//   .basePath(GLOBAL_PREFIX)
//   .route(`/expenses`, expenseRoutes)
//   .route("/", authRoutes);

app.get("*", serveStatic({ root: "./client/dist" }));
app.get("*", serveStatic({ root: "./client/dist/index.html" }));

export default app;
export type ApiRoutes = (typeof apiRoutes)[number];
