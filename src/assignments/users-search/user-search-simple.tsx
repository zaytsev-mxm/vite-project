import { useState, useEffect } from 'react';

const BASE_URL = 'https://api.github.com/search/users?q=';

type GitHubUser = {
  id: number;
  login: string;
};

export const UserSearchSimple = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      fetch(`${BASE_URL}${query}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => setUsers(data.items))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search GitHub users..."
      />

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {users.map((user) => (
        <div key={user.id}>{user.login}</div>
      ))}
    </div>
  );
};
