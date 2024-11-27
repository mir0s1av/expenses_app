import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  getAllExpensesQueryOptions,
  loadingCreateQueryOptions,
} from "@/lib/api";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions);
  const { data: loadedExpense } = useQuery(loadingCreateQueryOptions);
  if (error) return "An error occured :: " + error.message;
  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>Show All Expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadedExpense?.data && (
            <TableRow>
              <TableCell className="font-medium">
                {" "}
                <Skeleton className="h-4 w-[250px]" />
              </TableCell>
              <TableCell>{loadedExpense.data.title}</TableCell>
              <TableCell>{loadedExpense.data.amount}</TableCell>
              <TableCell>{loadedExpense.data.spentAt}</TableCell>
            </TableRow>
          )}
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {" "}
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                  </TableRow>
                ))
            : data.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.spentAt}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
