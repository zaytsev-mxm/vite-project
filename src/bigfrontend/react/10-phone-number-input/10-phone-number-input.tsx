import React from 'react';

const TPL = '(xxx)xxx-xxxx';

type TplChar = { ch: string; pos: number };

const compactTpl = (tpl: string, ph: string = 'x') => {
  let minLen: number | undefined = undefined;
  const tplChars = [...tpl].reduce<TplChar[]>((acc, ch, pos) => {
    if (ch !== ph) {
      acc.push({ ch, pos });
    }
    return acc;
  }, []);
  minLen = tplChars.length > 1 ? tplChars[1].pos : undefined;

  return { tplChars, minLen };
};

const formatDigitsStr = (str: string, tpl: string = TPL): string => {
  const { tplChars, minLen } = compactTpl(tpl);

  if (minLen !== undefined && str.length < minLen) {
    return str;
  }

  const strSplit = str.split('');

  for (const char of tplChars) {
    if (strSplit.length > char.pos) {
      strSplit.splice(char.pos, 0, char.ch);
    }
  }

  return strSplit.join('').substring(0, tpl.length);
};

export function PhoneNumberInput() {
  const [value, setValue] = React.useState('');

  const formatValue = (input: string) => {
    return formatDigitsStr(input);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const enteredValue = event.target.value || '';
    const sanitisedValue = enteredValue.replace(/\D/gi, '');
    const formattedValue = formatValue(sanitisedValue);

    setValue(formattedValue);
  };

  return (
    <input
      data-testid="phone-number-input"
      value={value}
      onChange={handleChange}
      placeholder="(123)456-7890"
      className="border m-2 rounded-md p-2"
    />
  );
}
