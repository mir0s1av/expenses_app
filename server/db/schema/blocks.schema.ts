import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const blocksTable = pgTable(
  "blocks",
  {
    id: serial("id").primaryKey(),
    hash: varchar({ length: 255 }).notNull(),
    userId: text("user_id").notNull(),
    previousHash: varchar({ length: 255 }).notNull(),
    payload: text("payload").notNull(),
    nonce: integer("nonce").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (blocks) => {
    return {
      blockHashIndex: index("blockHashIndex").on(blocks.hash),
      blockIdIndex: index("blockIdIndex").on(blocks.id),
      userIdIndex: index("userIdIndex").on(blocks.userId),
    };
  }
);

// Schema for inserting a user - can be used to validate API requests
export const insertBlockSchema = createInsertSchema(blocksTable, {
  hash: z
    .string()
    .min(1, { message: "Hash is required to be more than 1 character" }),
  previousHash: z.string().min(1, {
    message: "previousHash is required to be more than 1 character",
  }),
});
export const createExpenseDto = insertBlockSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Schema for selecting a user - can be used to validate API responses
export const selectBlockSchema = createSelectSchema(blocksTable);
export type BlockType = z.infer<typeof selectBlockSchema>;
export const getOneParamsSchema = z.object({
  hash: z.string(),
});
