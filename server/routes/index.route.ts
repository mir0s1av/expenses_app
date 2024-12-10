import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { createRouter } from "../lib/create-app";

const router = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("MiroTron Api message"),
        "MiroTron BlockChain API index"
      ),
    },
  }),
  (c) => {
    return c.json({ message: "Hey" });
  }
);

export default router;
