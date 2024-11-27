import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { createExpenseDto } from '@server/dto/createExpense.dto';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import {
  createNewExpense,
  getAllExpensesQueryOptions,
  loadingCreateQueryOptions,
} from "@/lib/api";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreacteExpense,
});

function CreacteExpense() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),

    defaultValues: {
      title: "",
      amount: "0",
      spentAt: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions
      );
      queryClient.setQueryData(loadingCreateQueryOptions.queryKey, {
        data: value,
      });
      navigate({ to: "/expenses" });
      try {
        const newExpense = await createNewExpense({ value });
        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
          ...existingExpenses.expenses,
          expenses: [newExpense.data, ...existingExpenses.expenses],
        });
        toast("Expense has been created", {
          description: `Hey, you have hust created a new expense : ${newExpense.data.id}.`,
        });
      } catch (error) {
        toast("Error", {
          description: "Oh no, an error occured while creating expense...",
        });
      } finally {
        queryClient.setQueryData(loadingCreateQueryOptions.queryKey, {});
      }
    },
  });
  return (
    <div className="p-2">
      <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          validators={{
            onChange: createExpenseDto.shape.title,
          }}
          name="title"
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Title</Label>{" "}
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
              />
              {field.state.meta.errors ? (
                <em role="alert">{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseDto.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>{" "}
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
              />
              {field.state.meta.errors ? (
                <em role="alert">{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="spentAt"
          validators={{
            onChange: createExpenseDto.shape.spentAt,
          }}
          children={(field) => (
            <div>
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border"
              />
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
