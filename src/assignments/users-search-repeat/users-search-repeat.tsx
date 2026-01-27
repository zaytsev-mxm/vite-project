import { type FormEventHandler, useEffect, useRef, useState } from 'react';

const BASE_URL = 'https://api.github.com/search/users?q=';

type User = {
  id: number;
  login: string;
};

type ResponseBody = {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
};

const useDebounced = (input: string) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(input);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [input]);

  return value;
};

export const UsersSearchRepeat = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const searchQuery = useDebounced(query);
  const cache = useRef(new Map<string, User[]>());

  const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.currentTarget.value || '');
  };

  useEffect(() => {
    if (!searchQuery) {
      setError('');
      setUsers(null);
      return;
    }
    const url = `${BASE_URL}${searchQuery}`;

    if (cache.current.has(url)) {
      setError('');
      setUsers(cache.current.get(url) || []);
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to parse the response');
      })
      .then((data: ResponseBody) => {
        cache.current.set(url, data.items);
        setError('');
        setUsers(data.items);
      })
      .catch((err) => {
        const errorMessage = (err as Error).message || 'Unknown error';
        setError(errorMessage);
        setUsers([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [searchQuery]);

  return (
    <div>
      <form>
        <input
          type="text"
          name="query"
          onInput={handleInput}
          value={query}
          className="border-gray-300 border-2"
        />
      </form>
      <div>
        {error ? <div>Error: {error}</div> : null}
        {isLoading ? <div>loading...</div> : null}
        {users ? (
          <ul>
            {users.map((user) => {
              return <li key={user.id}>{user.login}</li>;
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
};
