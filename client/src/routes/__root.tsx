import { Toaster } from '@/components/ui/sonner';
import { QueryClient } from '@tanstack/react-query';
import {
  createRootRoute,
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="p-2 flex  justify-between max-w-2xl m-auto items-baseline">
        <Link to="/" className="[&.active]:font-bold">
          Expense Tracker
        </Link>{" "}
        <div className="flex gap-2">
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
          <Link to="/create-expense" className="[&.active]:font-bold">
            Create Expense
          </Link>
          <Link to="/expenses" className="[&.active]:font-bold">
            Show Expenses
          </Link>
          <Link to="/profile" className="[&.active]:font-bold">
            Profile
          </Link>
        </div>
      </div>
      <hr />
      <div className="p-2 gap-2 max-w-2xl m-auto">
        {" "}
        <Outlet />
      </div>
      <Toaster />
    </>
  ),
});
