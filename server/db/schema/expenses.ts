import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
  date,
  index,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    spentAt: date("spentAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index("userIdIndex").on(expenses.userId),
    };
  }
);

export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z.string().min(1, { message: "Title must be at least 1 word" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a positive number",
  }),
});

export const selectExpensesSchema = createSelectSchema(expenses);
