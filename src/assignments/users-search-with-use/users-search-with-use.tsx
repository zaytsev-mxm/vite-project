import {
  use,
  Suspense,
  useState,
  useEffect,
  Component,
  type ReactNode,
} from 'react';

const BASE_URL = 'https://api.github.com/search/users?q=';

// Types
type User = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

type ResponseBody = {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

// Custom debounce hook
const useDebounced = (input: string, delay: number = 300): string => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(input);
    }, delay);

    return () => clearTimeout(timeout);
  }, [input, delay]);

  return value;
};

// Promise cache - MUST be outside the component
// This is crucial: we need stable promise references
const promiseCache = new Map<string, Promise<User[]>>();
const dataCache = new Map<string, User[]>();

function fetchUsers(query: string): Promise<User[]> {
  const url = `${BASE_URL}${query}`;

  // If we already have the data, return a resolved promise
  if (dataCache.has(url)) {
    return Promise.resolve(dataCache.get(url)!);
  }

  // If we have a pending promise, return it
  if (promiseCache.has(url)) {
    return promiseCache.get(url)!;
  }

  // Create new promise and cache it
  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users`);
      }
      return response.json() as Promise<ResponseBody>;
    })
    .then((data) => {
      // Cache the actual data
      dataCache.set(url, data.items);
      // Clean up promise cache
      promiseCache.delete(url);
      return data.items;
    })
    .catch((error: Error) => {
      // Clean up on error so retry is possible
      promiseCache.delete(url);
      throw error;
    });

  promiseCache.set(url, promise);
  return promise;
}

// This component uses the `use` hook and will SUSPEND
// until the promise resolves
function UsersList({ query }: { query: string }) {
  // The magic happens here! This suspends the component
  const users = use(fetchUsers(query));

  if (users.length === 0) {
    return <p className="text-gray-500 italic">No users found for "{query}"</p>;
  }

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center gap-3 p-2 bg-white rounded shadow-sm"
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-8 h-8 rounded-full"
          />
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {user.login}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Error Boundary component - required for catching errors with `use`
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 font-medium">Something went wrong!</p>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-600">Searching GitHub users...</span>
    </div>
  );
}

// Main search component
export function UsersSearchWithUse() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounced(query);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">GitHub User Search</h1>
      <p className="text-sm text-gray-500 mb-4">
        Using React 19's <code className="bg-gray-100 px-1 rounded">use</code>{' '}
        hook with Suspense
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search GitHub users..."
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />

      <div className="mt-4">
        {debouncedQuery ? (
          <ErrorBoundary key={debouncedQuery}>
            <Suspense fallback={<LoadingFallback />}>
              <UsersList query={debouncedQuery} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <p className="text-gray-400 italic">
            Type to search for GitHub users...
          </p>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
        <h2 className="font-semibold mb-2">How it works:</h2>
        <ol className="list-decimal list-inside space-y-1 text-gray-600">
          <li>
            <code className="bg-gray-200 px-1 rounded">use(promise)</code>{' '}
            suspends the component
          </li>
          <li>
            <code className="bg-gray-200 px-1 rounded">Suspense</code> shows the
            loading fallback
          </li>
          <li>
            <code className="bg-gray-200 px-1 rounded">ErrorBoundary</code>{' '}
            catches any errors
          </li>
          <li>When resolved, the component renders with data</li>
        </ol>
      </div>
    </div>
  );
}
