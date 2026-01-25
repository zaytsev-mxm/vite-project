import { SearchBar } from './components/search-bar';
import { Results } from './components/results';
import { useState } from 'react';
import { useAjax, useDebouncedValue } from './hooks';
import type { SearchResponse } from './types';
import { fetcher } from './utils';

const BASE_URL = 'https://api.github.com/search/users?q=';

export const UserSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 1000);

  const searchUrl = debouncedQuery ? `${BASE_URL}${debouncedQuery}` : '';

  const { data, error, isLoading } = useAjax<SearchResponse>(
    searchUrl,
    fetcher,
    { enabled: !!searchUrl },
  );

  const handleSearchInput = (val: string) => {
    setQuery(val);
  };

  return (
    <div>
      <SearchBar val={query} onInput={handleSearchInput} />
      <Results users={data?.items} error={error} isLoading={isLoading} />
    </div>
  );
};
