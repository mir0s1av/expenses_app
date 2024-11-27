import { CreateExpenseDto } from '@server/dto/createExpense.dto';
import { queryOptions } from '@tanstack/react-query';
import { hc } from 'hono/client';
import { type ApiRoutes } from "@server/app";
const QueryKeys = [];
const client = hc<ApiRoutes>("/");
export const api = client.api;
async function fetchCurrentUser() {
  const response = await api.v1["me"].$get();
  if (!response.ok) {
    throw new Error("Server error");
  }
  const { data } = await response.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: fetchCurrentUser,
});

export async function getExpenses() {
  const res = await api.v1.expenses.$get();
  if (!res.ok) {
    throw new Error("Error");
  }
  const data = await res.json();
  return data;
}
export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getExpenses,
  staleTime: 1000 * 60 * 5,
});

export const createNewExpense = async ({
  value,
}: {
  value: CreateExpenseDto;
}) => {
  const res = await api.v1.expenses.$post({ json: value });
  if (!res.ok) {
    throw new Error("something went wrong");
  }
  const newExpense = await res.json();
  return newExpense;
};

export const loadingCreateQueryOptions = queryOptions<{
  data?: CreateExpenseDto;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});
