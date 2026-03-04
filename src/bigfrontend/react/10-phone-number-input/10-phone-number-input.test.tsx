// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PhoneNumberInput } from './10-phone-number-input';

afterEach(cleanup);

const getInput = () => screen.getByTestId('phone-number-input') as HTMLInputElement;

const type = (input: HTMLInputElement, value: string) => {
  fireEvent.change(input, { target: { value } });
};

describe('PhoneNumberInput', () => {
  it('renders an input with the correct placeholder', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('(123)456-7890');
  });

  it('starts with an empty value', () => {
    render(<PhoneNumberInput />);
    expect(getInput().value).toBe('');
  });

  it('formats 10 digits with the full template', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '1234567890');
    expect(input.value).toBe('(123)456-7890');
  });

  it('strips non-digit characters before formatting', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, 'abc123def456ghi7890');
    expect(input.value).toBe('(123)456-7890');
  });

  it('does not apply formatting for a single digit (below minLen threshold)', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '1');
    expect(input.value).toBe('1');
  });

  it('does not format when below the minLen threshold (fewer than 4 digits)', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '12');
    expect(input.value).toBe('12');
  });

  it('applies formatting once the minLen threshold of 4 digits is reached', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '1234');
    expect(input.value).toBe('(123)4');
  });

  it('truncates the result to the template length', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '12345678901234');
    expect(input.value).toBe('(123)456-7890');
  });

  it('formats a partial number correctly', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '12345');
    expect(input.value).toBe('(123)45');
  });

  it('clears the value when input is emptied', () => {
    render(<PhoneNumberInput />);
    const input = getInput();
    type(input, '1234567890');
    type(input, '');
    expect(input.value).toBe('');
  });
});
