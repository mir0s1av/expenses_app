import { createRouter } from "@/server/lib/create-app";
import * as blockHandlers from "./blocks.handlers";
import * as blockRoutes from "./blocks.routes";

const blockRouter = createRouter()
  .openapi(blockRoutes.list, blockHandlers.list)
  .openapi(blockRoutes.create, blockHandlers.createBlock)
  .openapi(blockRoutes.getOne, blockHandlers.getOne);

export default blockRouter;
