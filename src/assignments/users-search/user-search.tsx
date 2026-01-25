import { SearchBar } from './components/search-bar';
import { Results } from './components/results';
import { useCallback, useState } from 'react';
import { useAjax } from './hooks';
import type { SearchResponse } from './types';
import { debounce, fetcher } from './utils';

const BASE_URL = 'https://api.github.com/search/users?q=';

export const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [searchUrl, setSearchUrl] = useState('');

  const debouncedSearchUrlUpdate = useCallback(
    debounce((value: unknown) => {
      setSearchUrl(() => {
        return `${BASE_URL}${value}`;
      });
    }, 1000),
    [],
  );

  const { data, error, isLoading } = useAjax<SearchResponse>(
    searchUrl,
    fetcher,
    { skipFirstMount: true },
  );

  const handleSearchInput = (val: string) => {
    setQuery(val);
    debouncedSearchUrlUpdate(val);
  };

  return (
    <div>
      <SearchBar val={query} onInput={handleSearchInput} />
      <Results users={data?.items} error={error} isLoading={isLoading} />
    </div>
  );
};
