import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});
async function fetchTotalSpent() {
  const response = await api.v1.expenses["total-spent"].$get();
  if (!response.ok) {
    throw new Error("Server error");
  }
  const { data } = await response.json();
  return data;
}
function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: fetchTotalSpent,
  });

  if (error) return "An error has occured :: " + error.message;
  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>You have spent: </CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "Loading..." : data.total}</CardContent>
      </Card>
    </>
  );
}
