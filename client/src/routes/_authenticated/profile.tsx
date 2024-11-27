import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { userQueryOptions } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { data, isPending, error } = useQuery(userQueryOptions);
  if (error) return "ERROR";
  if (isPending) return "Loading...";
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          {data.picture && <AvatarImage src={data.picture} />}

          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>
          {data?.given_name} {data?.family_name}
        </p>
      </div>
      <Button asChild className="my-4">
        <a href="/api/v1/logout">Logout</a>
      </Button>
    </div>
  );
}
