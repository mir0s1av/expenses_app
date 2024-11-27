import { Button } from '@/components/ui/button';
import { userQueryOptions } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router';
const Login = () => {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      <p>You have to login or register</p>
      <Button asChild className="my-4">
        <a href="/api/v1/login">Login</a>
      </Button>
      <Button asChild className="my-4">
        <a href="/api/v1/register">Register</a>
      </Button>
    </div>
  );
};
const Component = () => {
  const { user } = Route.useRouteContext();

  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return { user: data };
    } catch (e) {
      return { user: null };
    }
  },
  component: Component,
});
