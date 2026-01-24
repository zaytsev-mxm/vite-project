import { useFetch } from './hooks';
import { fetcher } from './utils';
import type { User } from './types';

export const UserSearch = () => {
  const { data, isLoading, error } = useFetch<User[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher,
  );

  if (error) {
    return <div>Error: ${error.message}</div>;
  }

  if (isLoading) {
    return <div>loading...</div>;
  }

  const list = data?.map((user) => {
    return <li key={user.id}>{user.name}</li>;
  });

  return <ul>{list}</ul>;
};
