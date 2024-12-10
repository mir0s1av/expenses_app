import { getUserMiddleware } from '@/server/kinde.client';
import { notFoundSchema } from '@/server/lib/constants';
import { createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

import {
  getOneParamsSchema,
  insertBlockSchema,
  selectBlockSchema,
} from "@/server/db/schema/blocks.schema";
// Constants
const TAGS = ["Blocks"] as const;
const BASE_PATH = "/blocks";

export const list = createRoute({
  TAGS,
  path: BASE_PATH,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectBlockSchema),
      "The list of blocks"
    ),
  },
});

export const create = createRoute({
  TAGS,
  path: BASE_PATH,
  method: "post",
  middlewares: [getUserMiddleware, zValidator("json", insertBlockSchema)],
  request: {
    body: jsonContentRequired(insertBlockSchema, "Created Block"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectBlockSchema, "The list of blocks"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertBlockSchema),
      "Validation error(s)"
    ),
  },
});
export const getOne = createRoute({
  TAGS,
  path: `${BASE_PATH}/{hash}`,
  method: "get",
  request: {
    params: getOneParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectBlockSchema, "The requested block"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Entity not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(getOneParamsSchema),
      "Invalid hash"
    ),
  },
});

export type BlockList = typeof list;
export type CreateBlock = typeof create;
export type GetOneBlock = typeof getOne;
