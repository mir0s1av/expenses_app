import { insertExpensesSchema } from '../db/schema/expenses';
import type { z } from "zod";

export const createExpenseDto = insertExpensesSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type CreateExpenseDto = z.infer<typeof createExpenseDto>;
