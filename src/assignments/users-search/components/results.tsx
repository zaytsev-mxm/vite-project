import type { GitHubUser } from '../types';

type Props = {
  isLoading?: boolean;
  error?: Error;
  users?: GitHubUser[];
};

export const Results = (props: Props) => {
  const { isLoading, error, users } = props;

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>Error: ${error.message}</div>;
  }

  return (
    <div>
      {users?.map((user) => {
        return <div key={user.id}>{user.login}</div>;
      })}
    </div>
  );
};
