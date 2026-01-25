import type { FormEventHandler } from 'react';

type Props = {
  val?: string;
  onInput?: (val: string) => void;
};

export const SearchBar = (props: Props) => {
  const { val = '', onInput } = props;

  const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
    const searchQuery = event.currentTarget.value || '';
    onInput?.(searchQuery);
  };

  return (
    <form>
      <input type="text" name="query" value={val} onInput={handleInput} />
    </form>
  );
};
