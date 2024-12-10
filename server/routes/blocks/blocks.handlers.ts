import { db } from '@/server/db';
import { desc, eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhares from 'stoker/http-status-phrases';
import blockService from './blocks.service';

import {
  blocksTable,
  insertBlockSchema,
} from "@/server/db/schema/blocks.schema";

import type { AppRouterHandler } from "@/server/types/app.schema";
import type { BlockList, CreateBlock, GetOneBlock } from "./blocks.routes";

export const list: AppRouterHandler<BlockList> = async (c) => {
  const result = await db
    .select()
    .from(blocksTable)
    .orderBy(desc(blocksTable.createdAt));

  return c.json(result);
};
export const createBlock: AppRouterHandler<CreateBlock> = async (c) => {
  const data = await c.req.valid("json");
  const user = c.var.user;

  const [previousBlock] = await db
    .select()
    .from(blocksTable)
    .orderBy(desc(blocksTable.id));

  const hash = blockService.calculateHash({
    index: previousBlock.id + 1 || 0,
    createdAt: new Date(),
    payload: JSON.stringify({
      givenName: user.given_name,
      familyName: user.family_name,
    }),
    previousHash: previousBlock.hash || "",
  });
  const validatedBlock = insertBlockSchema.parse({
    ...data,
    hash,
    userId: crypto.randomUUID(),
  });

  const [insterted] = await db
    .insert(blocksTable)
    .values(validatedBlock)
    .returning();
  return c.json(insterted, HttpStatusCodes.OK);
};
export const getOne: AppRouterHandler<GetOneBlock> = async (c) => {
  const { hash } = c.req.valid("param");
  const [result] = await db
    .select()
    .from(blocksTable)
    .orderBy(desc(blocksTable.createdAt))
    .where(eq(blocksTable.hash, hash));

  if (!result) {
    return c.json(
      { message: HttpStatusPhares.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }
  return c.json(result, HttpStatusCodes.OK);
};
