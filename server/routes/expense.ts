import { zValidator } from '@hono/zod-validator';
import {
  and,
  desc,
  eq,
  sum
  } from 'drizzle-orm';
import { Hono } from 'hono';
import { db } from '../db';
import { expenses, insertExpensesSchema } from '../db/schema/expenses';
import { createExpenseDto } from '../dto/createExpense.dto';
import { getUserMiddleware } from '../kinde.client';

export const expenseRoutes = new Hono()
  .get("/", getUserMiddleware, async (ctx) => {
    const user = ctx.var.user;

    const query = await db
      .select()
      .from(expenses)
      .orderBy(desc(expenses.createdAt))
      .where(eq(expenses.userId, user.id))
      .prepare("get_expenses");

    const result = await query.execute();

    return ctx.json({ expenses: result });
  })
  .post(
    "/",
    getUserMiddleware,
    zValidator("json", createExpenseDto),
    async (ctx) => {
      const data = await ctx.req.valid("json");

      const user = ctx.var.user;

      const validatedExpense = insertExpensesSchema.parse({
        ...data,
        userId: user.id,
      });

      const expensesResult = await db
        .insert(expenses)
        .values(validatedExpense)
        .returning()
        .then((res) => res[0]);

      return ctx.json({ data: expensesResult });
    }
  )
  .get("/:id{[0-9]+}", getUserMiddleware, async (ctx) => {
    const id = Number.parseInt(ctx.req.param("id"));

    const user = ctx.var.user;

    const expensesResult = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.userId, user.id), eq(expenses.id, id)));
    if (!expensesResult) {
      return ctx.notFound();
    }
    return ctx.json({ data: expensesResult });
  })
  .get("total-spent", getUserMiddleware, async (ctx) => {
    const user = ctx.var.user;

    const expensesResult = await db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(eq(expenses.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    return ctx.json({ data: { total: expensesResult.total } });
  });
