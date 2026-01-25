import { SearchBar } from './components/search-bar';
import { Results } from './components/results';
import { useState, useEffect } from 'react';
import { useAjax } from './hooks';
import type { SearchResponse } from './types';
import { debounce, fetcher } from './utils';

const BASE_URL = 'https://api.github.com/search/users?q=';

export const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [searchUrl, setSearchUrl] = useState('');

  const debouncedSearchUrlUpdate = debounce(() => {
    setSearchUrl(`${BASE_URL}${query}`);
  }, 1000);

  useEffect(() => {
    debouncedSearchUrlUpdate();
  }, [debouncedSearchUrlUpdate]);

  const { data, error, isLoading } = useAjax<SearchResponse>(
    searchUrl,
    fetcher,
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
